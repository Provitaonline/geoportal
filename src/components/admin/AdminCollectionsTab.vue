<template>
  <div class="container" style="max-width: 900px;">
    <b-loading v-model="isLoading"></b-loading>
    <div class="buttons" style="justify-content: center;">
      <b-button @click="confirmDelete()" style="width: 160px;" :disabled="!collectionListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-button @click="addCollection()" style="width: 160px;"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addcollection')}}</b-button>
      <b-button @click="saveChanges()" style="width: 160px;" :disabled="!isChanged" :type="isChanged ? 'is-warning' : ''"><font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.savechanges')}}</b-button>
    </div>
    <b-table style="cursor: grab;"
      checkable
      hoverable
      :header-checkable="false"
      v-if="Collections"
      :data="Collections.collections"
      :checked-rows.sync="collectionListCheckedRows"
      draggable
      @dragstart="dragStart"
      @dragover="dragOver"
      @drop="dropRow">
      <b-table-column field="collectionId" :label="$t('label.collectionid')" v-slot="props">
        {{props.row.collectionId}}
      </b-table-column>
      <b-table-column field="name" :label="$t('label.collectionname')" v-slot="props">
        {{props.row.name[$i18n.locale.substr(0, 2)]}}
      </b-table-column>
      <b-table-column label="Info" centered v-slot="props">
        <a @click="editCollection(props.index)">
          <font-awesome :icon="['far', 'edit']"/>
        </a>
      </b-table-column>
    </b-table>
  </div>

</template>

<script>
  import {getCollectionsFromRepo, saveCollections} from '~/utils/data'
  import CollectionEditor from '~/components/admin/CollectionEditor'

  export default {
    name: 'AdminCollectionsTab',
    data() {
      return {
        Collections: null,
        collectionListCheckedRows: [],
        isLoading: true,
        currentIndex: 0,
        isNew: false,
        isChanged: false,
        draggingRowIndex: null
      }
    },
    mounted() {
      this.$eventBus.$on('collectionstabvisible', this.getCollections)
      this.$eventBus.$on('acceptcollectionchanges', this.acceptCollectionChanges)
    },
    methods: {
      getCollections() {
        if (!this.Collections) {
          console.log('get collections')
          getCollectionsFromRepo(sessionStorage.githubtoken).then((result) => {
            this.Collections = result
            this.isLoading = false
          }).catch((err) => {
            this.Collections = {}
            this.isLoading = false
            if (err.response.status != 404) {
              console.log('error getting collections from repo')
            }
          })
        }
      },
      editCollection(index) {
        this.isNew = false
        this.currentIndex = index
        this.openCollectionEditor(JSON.parse(JSON.stringify(this.Collections.collections[index])))
      },
      addCollection() {
        this.isNew = true
        this.openCollectionEditor({collectionId: ''})
      },
      openCollectionEditor(collection) {
        console.log(collection)
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: CollectionEditor,
          props: {
            collection: collection
          }
        })
      },
      acceptCollectionChanges(question) {
        this.isChanged = true
        if (this.isNew) {
          this.Collections.collections.push(question)
        } else {
          this.$set(this.Collections.collections, this.currentIndex, question)
        }
      },
      confirmDelete() {
        console.log('confirm delete')
        this.$buefy.dialog.confirm({
          title: this.$t('message.removequestions'),
          message: this.$t('message.removequestionswarning'),
          confirmText: this.$t('label.confirm'),
          cancelText: this.$t('label.cancel'),
          type: 'none',
          focusOn: 'cancel',
          onConfirm: () => {this.deleteCollections()}
        })
      },
      saveChanges() {
        /*saveCollections(sessionStorage.githubtoken, this.Collections).then(() => {
          console.log('saved collections')
          this.isChanged = false
          this.$store.commit('setPublishIndicator', true)
        }).catch((e) => {
          console.log('error saving collections to github ', e)
        }) */
      },
      deleteCollections() {
        this.Collections.collections = this.Collections.collections.filter(x => !this.collectionListCheckedRows.includes(x))
        this.isChanged = true
      },
      dragStart(payload) {
        this.draggingRowIndex = payload.index
        payload.event.dataTransfer.effectAllowed = 'move'
      },
      dragOver(payload) {
        payload.event.dataTransfer.dropEffect = 'move'
        payload.event.preventDefault()
      },
      dropRow(payload) {
        var element = this.Collections.collections[this.draggingRowIndex]
        this.Collections.collections.splice(this.draggingRowIndex, 1)
        this.Collections.collections.splice(payload.index, 0, element)
        this.isChanged = true
      }
    }
  }

</script>

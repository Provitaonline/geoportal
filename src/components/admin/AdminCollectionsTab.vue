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
      :is-row-checkable="(row) => !collectionsInUse[row.collectionId]"
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
  import {getCollectionsFromRepo, getMetaListFromRepo, getMetaFromRepo, getCollectionItems, saveCollections, submitJob} from '~/utils/data'
  import CollectionEditor from '~/components/admin/CollectionEditor'
  import {dataConfig} from '~/utils/config'

  export default {
    name: 'AdminCollectionsTab',
    data() {
      return {
        Collections: null,
        collectionListCheckedRows: [],
        collectionsInUse: {},
        isLoading: true,
        currentIndex: 0,
        isNew: false,
        isChanged: false,
        draggingRowIndex: null,
        savedTileInfo: null,
        regenTiles: {}
      }
    },
    mounted() {
      this.$eventBus.$on('collectionstabvisible', this.getCollections)
      this.$eventBus.$on('acceptcollectionchanges', this.acceptCollectionChanges)
    },
    methods: {
      async getCollections() {
        console.log('get collections')
        this.isLoading = true
        if (!this.Collections) {
          this.Collections = await getCollectionsFromRepo(sessionStorage.githubtoken)
        }
        // Get latest version of collection items
        this.collectionsInUse = await getCollectionItems(sessionStorage.githubtoken)
        this.isLoading = false
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
        if (collection.tileInfo && collection.tileInfo.type === 'raster') {
          this.savedTileInfo = JSON.stringify(collection.tileInfo)
        }
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: CollectionEditor,
          props: {
            collection: collection
          }
        })
      },
      acceptCollectionChanges(collection) {
        this.isChanged = true
        if (this.isNew) {
          this.Collections.collections.push(collection)
        } else {
          this.$set(this.Collections.collections, this.currentIndex, collection)
          if (collection.tileInfo && collection.tileInfo.type === 'raster' && JSON.stringify(collection.tileInfo) !== this.savedTileInfo) {
            this.regenTiles[collection.collectionId] = true
          }
        }
      },
      confirmDelete() {
        console.log('confirm delete')
        this.$buefy.dialog.confirm({
          title: this.$t('message.removecollections'),
          message: this.$t('message.removecollectionswarning'),
          confirmText: this.$t('label.confirm'),
          cancelText: this.$t('label.cancel'),
          type: 'none',
          focusOn: 'cancel',
          onConfirm: () => {this.deleteCollections()}
        })
      },
      async saveChanges() {
        this.isLoading = true
        await saveCollections(sessionStorage.githubtoken, this.Collections)
        console.log('saved collections')
        this.isChanged = false
        this.$store.commit('setPublishIndicator', true)
        // Regenerate tiles where needed
        for (const key of Object.keys(this.regenTiles)) {
          let collection = this.Collections.collections.find(c => c.collectionId === key)
          let tileInfo = JSON.parse(JSON.stringify(collection.tileInfo)) // Make a copy of tileInfo
          if (tileInfo.colorTable && tileInfo.hideNoData) {
            tileInfo.colorTable.push(['nv', '#ffffff00'])
          }
          for (const f of this.collectionsInUse[key]) {
            await this.regenerateTiles(tileInfo, f)
          }
        }
        this.isLoading = false
        this.regenTiles = {}
      },
      async regenerateTiles(tileInfo, file) {
        let fileMeta = await getMetaFromRepo(sessionStorage.githubtoken, file)
        let job = {tileInfo: tileInfo}
        if (fileMeta.tileGenSrc) {
          job.file = fileMeta.tileGenSrc
          job.directory = dataConfig.privateFilesDirectory
        } else {
          job.file = fileMeta.file
          job.directory = dataConfig.filesDirectory
        }
        await submitJob(sessionStorage.githubtoken, job)
        console.log('job submitted', job.file)
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

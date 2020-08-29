<template>
  <div class="container" style="max-width: 900px;">
    <b-loading v-model="isLoading"></b-loading>
    <div class="buttons" style="justify-content: center;">
      <b-button @click="confirmDelete" style="width: 160px;" :disabled="!newsItemListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-button @click="addNewsItem()" style="width: 160px;"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addnews')}}</b-button>
    </div>
    <b-table :data="sortedListOfNewsItems" checkable hoverable :header-checkable="false" :checked-rows.sync="newsItemListCheckedRows">
      <b-table-column field="date" :label="$t('label.publishdate')" v-slot="props">
        {{$d(new Date(props.row.date), 'short')}}
      </b-table-column>
      <b-table-column field="title" :label="$t('label.headline')" v-slot="props">
        {{props.row.headline[$i18n.locale.substr(0, 2)]}}
      </b-table-column>
      <b-table-column label="Info" centered v-slot="props">
        <a @click="editInfo(props.index)">
          <font-awesome :icon="['far', 'edit']"/>
        </a>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>

  import {getListOfNewsItems, saveNewsItem, deleteObjects} from '~/utils/data'
  import NewsItemEditor from '~/components/NewsItemEditor'

  export default {
    name: 'AdminNewsTab',
    data() {
      return {
        listOfNewsItems: null,
        newsItemListCheckedRows: [],
        isLoading: true
      }
    },
    mounted() {
      this.$eventBus.$on('newstabvisible', this.getListOfNewsItems)
      this.$eventBus.$on('acceptnewsitemchanges', this.acceptNewsItemChanges)
    },
    methods: {
      getListOfNewsItems() {
        if (!this.listOfNewsItems) {
          console.log('get news items')
          getListOfNewsItems().then((result) => {
            this.listOfNewsItems = result
            this.isLoading = false
          })
        }
      },
      editInfo(index) {
        this.openNewsItemEditor(JSON.parse(JSON.stringify(this.sortedListOfNewsItems[index])))
      },
      addNewsItem() {
        this.openNewsItemEditor({headline: {}, text: {}})
      },
      openNewsItemEditor(newsItem) {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: NewsItemEditor,
          props: {
            newsItem: newsItem
          }
        })
      },
      acceptNewsItemChanges(newsItem) {
        saveNewsItem(sessionStorage.githubtoken, newsItem).then(() => {
          let index = this.listOfNewsItems.findIndex(item => item.key === newsItem.key)
          if (index != -1) {
            this.$set(this.listOfNewsItems, index, newsItem)
          } else {
            this.listOfNewsItems.push(newsItem)
          }
        }).catch((e) => {
          console.log('error saving news item to s3 ', e)
        })
      },
      confirmDelete() {
        console.log('confirm delete')
        let itemsToDelete = this.newsItemListCheckedRows.map((item) => item.key)
        this.$buefy.dialog.confirm({
          title: this.$t('message.removenewsitems'),
          message: this.$t('message.removenewsitemswarning') + ':<br><br>' + itemsToDelete.join(', '),
          confirmText: this.$t('label.confirm'),
          cancelText: this.$t('label.cancel'),
          type: 'none',
          focusOn: 'cancel',
          onConfirm: () => {this.deleteNewsItems(itemsToDelete)}
        })
      },
      deleteNewsItems(itemsToDelete) {
        deleteObjects(sessionStorage.githubtoken, JSON.stringify(itemsToDelete)).then(() => {
          this.newsItemListCheckedRows = []
          this.getListOfNewsItems()
        }).catch((e) => {
          console.log('error deleting news items ', e.response)
        })
      }
    },
    computed: {
      sortedListOfNewsItems() {
        if (this.listOfNewsItems && this.listOfNewsItems.length) {
          return this.listOfNewsItems.sort((a, b) => (a.date > b.date) ? -1 : 1)
        }
      }
    }
  }
</script>

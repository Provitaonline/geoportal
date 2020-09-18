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

  import {deleteItemsFromRepo, getListOfNewsItemsFromRepo, saveNewsItemFromRepo} from '~/utils/data'
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
          console.log('get list of news items')
          getListOfNewsItemsFromRepo(sessionStorage.githubtoken).then(result => {
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
        this.isLoading = true
        saveNewsItemFromRepo(sessionStorage.githubtoken, newsItem).then(() => {
          let index = this.listOfNewsItems.findIndex(item => item.key === newsItem.key)
          if (index != -1) {
            this.$set(this.listOfNewsItems, index, newsItem)
          } else {
            this.$set(this.listOfNewsItems, this.listOfNewsItems.length, newsItem)
          }
          this.isLoading = false
        }).catch((e) => {
          console.log('error saving news item to github ', e)
        })
      },
      confirmDelete() {
        console.log('confirm delete')
        this.$buefy.dialog.confirm({
          title: this.$t('message.removenewsitems'),
          message: this.$t('message.removenewsitemswarning'),
          confirmText: this.$t('label.confirm'),
          cancelText: this.$t('label.cancel'),
          type: 'none',
          focusOn: 'cancel',
          onConfirm: () => {this.deleteNewsItems()}
        })
      },
      deleteNewsItems() {
        let itemsToDelete = this.newsItemListCheckedRows.map((item) => item.key)
        let thumbsToDelete = this.newsItemListCheckedRows.map((item) => item.thumb ? item.thumb.substr(2) : null).filter((t) => t)

        deleteItemsFromRepo(sessionStorage.githubtoken, thumbsToDelete).then(() => {
          deleteItemsFromRepo(sessionStorage.githubtoken, itemsToDelete)

          this.listOfNewsItems = this.listOfNewsItems.filter(item => !itemsToDelete.includes(item.key))
          this.newsItemListCheckedRows = []
        })

        /* deleteObjects(sessionStorage.githubtoken, JSON.stringify(itemsToDelete)).then(() => {
          this.newsItemListCheckedRows = []
          this.reloadListOfNewsItems()
          deleteObjects(sessionStorage.githubtoken, JSON.stringify(thumbsToDelete))
        }).catch((e) => {
          console.log('error deleting news items ', e.response)
        }) */
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

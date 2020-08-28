<template>
  <div class="container" style="max-width: 900px;">
    <div class="buttons" style="justify-content: center;">
      <b-button @click="" style="width: 160px;" :disabled="!newsItemListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
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

  import {getListOfNewsItems, saveNewsItem} from '~/utils/data'
  import NewsItemEditor from '~/components/NewsItemEditor'

  export default {
    name: 'AdminNewsTab',
    data() {
      return {
        listOfNewsItems: [],
        newsItemListCheckedRows: []
      }
    },
    mounted() {
      this.getListOfNewsItems()
      this.$eventBus.$on('acceptnewsitemchanges', this.acceptNewsItemChanges)
    },
    methods: {
      getListOfNewsItems() {
        console.log('get news items')
        getListOfNewsItems().then((result) => {
          this.listOfFiles = result
        })
      },
      editInfo(index) {
        console.log(index)
        this.openNewsItemEditor(JSON.parse(JSON.stringify(this.sortedListOfNewsItems[index])))
      },
      addNewsItem() {
        this.openNewsItemEditor({headline: {}, text: {}})
      },
      openNewsItemEditor(newsItem) {
        console.log(newsItem)
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
      }
    },
    computed: {
      sortedListOfNewsItems() {
        if (this.listOfNewsItems.length) {
          return this.listOfNewsItems.sort((a, b) => (a.date > b.date) ? -1 : 1)
        }
      }
    }
  }
</script>

<template>
  <div class="container" style="max-width: 900px;">
    <div class="buttons" style="justify-content: center;">
      <b-button @click="" style="width: 160px;" :disabled="!newsItemListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-button @click="addNewsItem()" style="width: 160px;"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addnews')}}</b-button>
    </div>
    <b-table :data="listOfNewsItems" checkable hoverable :header-checkable="false" :checked-rows.sync="newsItemListCheckedRows">
      <template slot-scope="props">
        <b-table-column field="date" :label="$t('label.publishdate')">
          {{$d(new Date(props.row.date), 'short')}}
        </b-table-column>
        <b-table-column field="title" :label="$t('label.headline')">
          {{props.row.headline[$i18n.locale.substr(0, 2)]}}
        </b-table-column>
        <b-table-column label="Info" centered>
          <a @click="editInfo(props.index)">
            <font-awesome :icon="['far', 'edit']"/>
          </a>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>

  import {getListOfNewsItems} from '~/utils/data'
  import NewsItemEditor from '~/components/NewsItemEditor'

  export default {
    name: 'AdminNewsTab',
    data() {
      return {
        listOfNewsItems: [
          {
            key: 'news/2020-08-24T19:51:29.227Z-ke8xrtfv.json',
            date: '2020-08-24T19:51Z',
            headline: {
              en: 'testing dgdfgdgf g dfg df g dfg df g dfgdfgdfgdfg dfg dfg dfgdf g dfg df gdf gd fg dfg',
              es: 'probando dgdfgdgf g dfg df g dfg df g dfgdfgdfgdfg dfg dfg dfgdf g dfg df gdf gd fg dfg'
            },
            text: {
              en: 'testing',
              es: 'probando'
            },
            image: '',
            reference: ''
          },
          {
            key: 'news/2020-08-24T19:51:29.227Z-ke8xrtfq.json',
            date: '2020-08-24T19:51Z',
            headline: {
              en: 'testing 2 dgdfgdgf g dfg df g dfg df g dfgdfgdfgdfg dfg dfg dfgdf g dfg df gdf gd fg dfg',
              es: 'probando 2 dgdfgdgf g dfg df g dfg df g dfgdfgdfgdfg dfg dfg dfgdf g dfg df gdf gd fg dfg'
            },
            text: {
              en: 'testing',
              es: 'probando'
            },
            image: '',
            reference: ''
          }
        ],
        newsItemListCheckedRows: []
      }
    },
    mounted() {
      this.getListOfNewsItems()
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
        this.openNewsItemEditor(JSON.parse(JSON.stringify(this.listOfNewsItems[index])))
      },
      addNewsItem() {
        this.openNewsItemEditor({})
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
      }
    }
  }
</script>

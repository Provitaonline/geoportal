<template>
  <Layout>
    <template slot="banner">
      <h1 class="title has-text-centered is-uppercase">
        Geoportal Provita
      </h1>
    </template>

    <div class="columns is-gapless">

      <aside class="side-panel column is-narrow">
        <div class="side-panel-content">
          <div class="panel">
            <p class="panel-heading">
              <b>{{$t('label.files')}}</b>
            </p>
            <div class="panel-block">
              <div class="control has-icons-left">
                <input class="input" type="search" v-model="searchString" :placeholder="$t('label.search')">
                <span class="icon is-left">
                  <font-awesome :icon="['fas', 'search']"/>
                </span>
              </div>
            </div>
          </div>
          <div v-for="item, index in sortedFileList">
            <div v-show="isMatch(item)" class="card"  >
              <div class="card-header">
                <p class="card-header-title">{{ item.name[$i18n.locale.substr(0, 2)] }}</p>
                <a href="#" @click="item.expanded = !item.expanded" class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <font-awesome v-if="item.expanded" :icon="['fas', 'angle-up']"/>
                    <font-awesome v-else :icon="['fas', 'angle-down']"/>
                  </span>
                </a>
              </div>
              <transition name="slide">
                <div v-show="item.expanded" class="card-content">
                  <div class="buttons">
                    <b-button @click="downloadFile(index)" tag="button" v-bind:disabled="!item.file" style="width: 48%;" type="is-text" size="is-small">
                      <font-awesome :icon="['fas', 'download']"/>
                      <b> {{ $t('label.download') }}</b>
                      ({{mFormatter(item.fileSize)}})
                    </b-button>
                    <a :id="'download-' + index" download :href="filesBaseUrl + filesDirectory + '/' + item.file"></a>
                    <b-field>
                      <b-switch
                        @input="addToMap(item, $event)"
                        v-bind:disabled="!item.tiles"
                        v-model="item.layerShow"
                        size="is-small">
                        {{ $t('label.addtomap') }}
                      </b-switch>
                    </b-field>
                  </div>
                  <div class="columns" style="margin-bottom: 0px;">
                    <div class="column is-narrow">
                      <small><b>{{ $t('label.date') }}: </b>{{ $d(new Date(item.date)) }}</small>
                    </div>
                    <div class="column">
                      <small><b>{{ $t('label.format') }}: </b>{{ $t('label.' + item.format) }}</small>
                    </div>
                  </div>
                  <div><small><b>{{ $t('label.source') }}: </b>{{ item.source }}</small></div><br>
                  <div v-if="item.keywords">
                    <span class="tag" style="margin-right: 0.5em;" v-for="kwd in item.keywords[$i18n.locale.substr(0, 2)]">
                      {{ kwd }}
                    </span>
                    <br><br>
                  </div>
                  <span v-html="item.description[$i18n.locale.substr(0, 2)]"></span>
                </div>
              </transition>
            </div>
          </div>
          <div style="padding: 2em;"></div>
        </div>
      </aside>

      <div class="column">
        <InteractiveMap :layerMeta="fileList" class="map-container" ref="interactivemap">
        </InteractiveMap>
      </div>

    </div>
    <b-modal :active.sync="isPopupModalModalActive" :width="640" scroll="keep">
      <div class="card">
          <div class="card-header has-text-centered">
            <p class="card-header-title" style="display: inline-block;">
              {{popUpModalHeading}}
            </p>
          </div>
          <div class="card-content">
              <div class="content">
                <b-table :data="popupModalData" :columns="popUpModalColumns"></b-table>
              </div>
          </div>
      </div>
    </b-modal>
  </Layout>
</template>

<style lang="scss" scoped>

  .card-header {
    background-color: rgba(85,107,47, 0.1);
  }

</style>

<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  @media only screen and (min-width: 769px) {
    .side-panel {
      width: 20rem;
      transition: margin-left .3s;
    }
  }

  @media only screen and (max-width: 768px) {
    .side-panel {
      min-width: 20rem;
      border-right: 0;
    }
  }

  .side-panel-content {
    overflow-y: auto;
    position: sticky;
    top: 0;
    height: 70vh;
  }

  @media only screen and (max-width: 768px) {
    .side-panel-content {
      height: auto;
    }
  }

  @media only screen and (max-width: 768px) {
    .map-container {
      flex-grow: 1;
      margin: 0 auto;
      position: relative;
      width: auto;
      max-width: 90vw;
    }
  }

  .card {
    border: 1px solid rgba(85,107,47, 0.2);
  }

  .card-header {
    border-bottom: 1px solid rgba(85,107,47, 0.2);
  }
</style>

<page-query>
  query($locale: String) {
    home: allHomeData(filter: { locale: { eq: $locale }}) {
      edges {
        node {
          content
        }
      }
    }
  }
</page-query>

<script>
  import InteractiveMap from '~/components/InteractiveMap.vue'
  import UserSurveyForm from '~/components/UserSurveyForm'

  import {dataConfig} from '~/utils/config'
  import * as data from '~/utils/data'
  import {getPureText} from '~/utils/misc'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.main')
      }
    },
    data() {
      return {
        filesBaseUrl: dataConfig.filesBaseUrl,
        filesDirectory: dataConfig.filesDirectory,
        fileList: [],
        isLoading: true,
        isPopupModalModalActive: false,
        popupModalData: {},
        popUpModalHeading: '',
        searchString: ''
      }
    },
    components: {
      InteractiveMap
    },
    created() {
      this.fileList = this.$store.state.fileList
      if (this.fileList.length === 0) {
        data.getMetaEntries().then((result) => {
          this.fileList =  result.data.collection
          this.isLoading = false
          this.fileList.forEach(item => {
            this.$set(item, 'expanded', false)
            if (item.file) {
              data.getFileSize(item.file).then((fileSize) => {
                this.$set(item, 'fileSize', fileSize)
              })
            }
          })
          this.$store.commit('setFileList', this.fileList)
        }).catch((error) => {
          if (error.response.status !== 404) {
            console.log('Error accessing meta', error)
          }
        })
      }
    },
    mounted() {
      this.$eventBus.$on('showpopupmodal', (info) => {
        this.popupModalData = Object.keys(info.itemProperties).map(key => {
          return {id: key, value: info.itemProperties[key]}
        }).sort((a, b) => a.id.localeCompare(b.id))
        this.popUpModalHeading = info.layerName + ': ' + info.itemText
        this.isPopupModalModalActive = true
      })
    },
    methods: {
      kFormatter: function (num) {
          return Math.abs(num) > 999 ? this.$n(Math.sign(num)*((Math.abs(num)/1000).toFixed(1))) + 'K' : Math.sign(num)*Math.abs(num)
      },
      mFormatter: function (num) {
          return Math.abs(num) > 999999 ? this.$n(Math.sign(num)*((Math.abs(num)/1000000).toFixed(1))) + 'M' : this.kFormatter(num)
      },
      addToMap: function (item, isOn) {
        if (isOn) {
          this.$eventBus.$emit('addtilelayer', {tiles: item.tiles, tileInfo: item.tileInfo, source: item.source})
        } else {
          this.$eventBus.$emit('removetilelayer', item.tiles)
        }
        this.$store.commit('setFileList', this.fileList)
      },
      isMatch(item) {
        if (this.searchString.length < 3) return true
        if (getPureText(item.name[this.locale]).includes(getPureText(this.searchString))) return true
        if (getPureText(item.keywords[this.locale].join(' ')).includes(getPureText(this.searchString))) return true
        return false
      },
      downloadFile(index) {
        this.openUserSurvey(index)
        //document.getElementById('download-' + index).click()
      },
      openUserSurvey(index) {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: UserSurveyForm,
          props: {
            downloadFileIndex: index
          }
        })
      },
    },
    computed: {
      getNumRows() {
        return (this.fileList.length/3).toFixed(0)
      },
      sortedFileList() {
        let collator = new Intl.Collator()
        if (this.fileList.length) {
          return this.fileList.sort((a, b) => (collator.compare(a.name[this.locale], b.name[this.locale])))
          //return this.fileList.sort((a, b) => (a.name[locale].normalize('NFD') > b.name[locale].normalize('NFD')) ? 1 : -1)
        }
      },
      popUpModalColumns() {
        return [
          {
            field: 'id',
            label: this.$t('label.fieldid')
          },
          { field: 'value',
            label: this.$t('label.fieldvalue')
          }
        ]
      },
      locale() {
        return this.$i18n.locale.toString().substr(0,2)
      }
    }
  }
</script>

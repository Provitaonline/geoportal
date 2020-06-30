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
              <p class="control has-icons-left">
              <input class="input" type="search" :placeholder="$t('label.search')">
              <span class="icon is-left">
                <font-awesome :icon="['fas', 'search']"/>
              </span>
              </p>
            </div>
          </div>
          <div v-for="item, index in sortedFileList" class="card">
            <div class="card-header">
              <p class="card-header-title has-text-centered">{{ item.name[$i18n.locale.substr(0, 2)] }}</p>
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
                  <b-button tag="a" download :href="'https://geoportalp.s3-us-west-2.amazonaws.com/files/' + item.file" v-bind:disabled="!item.file" style="width: 48%;" type="is-text" size="is-small">
                    <font-awesome :icon="['fas', 'download']"/>
                    <b> {{ $t('label.download') }}</b>
                    ({{mFormatter(item.fileSize)}})
                  </b-button>
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
                <small><b>{{ $t('label.date') }}: </b>{{ $d(new Date(item.date)) }}</small><br><br>
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

  import * as data from '~/utils/data'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.main')
      }
    },
    components: {
    },
    data() {
      return {
        fileList: [],
        isLoading: true,
        isPopupModalModalActive: false,
        popupModalData: {},
        popUpModalHeading: ''
      }
    },
    components: {
      InteractiveMap
    },
    created() {
      this.doFitBounds = true
      data.getMetaEntries().then((result) => {
        this.fileList =  result.collection
        this.isLoading = false
        this.fileList.forEach(item => {
          this.$set(item, 'expanded', false)
          if (item.file) {
            data.getFileSize(item.file).then((fileSize) => {
              this.$set(item, 'fileSize', fileSize)
            })
          }
        })
      })
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
          this.$eventBus.$emit('addtilelayer', {tiles: item.tiles, tileInfo: item.tileInfo})
        } else {
          this.$eventBus.$emit('removetilelayer', item.tiles)
        }
      }
    },
    computed: {
      getNumRows() {
        return (this.fileList.length/3).toFixed(0)
      },
      sortedFileList() {
        let locale = this.$i18n.locale.toString().substr(0,2)
        let collator = new Intl.Collator()
        if (this.fileList.length) {
          return this.fileList.sort((a, b) => (collator.compare(a.name[locale], b.name[locale])))
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
      }
    }
  }
</script>

<template>

  <aside class="side-panel">
    <div class="side-panel-content">
      <div class="panel">
        <p class="panel-heading has-text-centered is-size-5">
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
        <div class="panel-block">
          <b-taginput
            icon="tag"
            v-model="tags"
            autocomplete
            :data="sortedFilteredTags"
            @typing="getFilteredTags"
            :placeholder="$t('label.filter')">
          </b-taginput>
        </div>
      </div>
      <div v-for="item, index in sortedFileList">
        <div v-show="isMatch(item)" class="card">
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
              <div class="columns">
                <div class="column">
                <a @click="downloadFile(index)" href="" v-bind:disabled="!item.file">
                    <small><font-awesome :icon="['fas', 'download']"/>
                      <b> {{ $t('label.download') }}</b>
                      ({{mFormatter(item.fileSize)}})
                    </small>
                  </a>
                  <a style="display: none;" :id="'download-' + index" download :href="filesBaseUrl + filesDirectory + '/' + item.format + '/' + item.file"></a>
                </div>
              </div>
              <div class="columns">
                <div class="column is-narrow">
                  <small><a @click="displayTilesInfo(item)"><font-awesome :icon="['fas', 'link']"/><b> {{ $t('label.tiles') }}</b></a></small>
                </div>
                <div class="column">
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
                <a class="tag" @click="addTagToFilterList(kwd)" :title="$t('label.addtagtofilter')" style="margin-right: 0.5em;" v-for="kwd in item.keywords[$i18n.locale.substr(0, 2)]">
                  {{ kwd }}
                </a>
                <br><br>
              </div>
              <div class="content site-text" v-html="item.description[$i18n.locale.substr(0, 2)]"></div>
            </div>
          </transition>
        </div>
      </div>
      <div style="padding: 2em;"></div>
    </div>
  </aside>

</template>

<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  .md-text p {
    margin-bottom: 10px !important;
  }

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
    max-height: 80vh;
  }

  @media only screen and (max-width: 768px) {
    .side-panel-content {
      height: auto;
    }
  }

  .panel-heading {
    color: $site-color;
    background-color: #FAFAFA;
  }

  .card {
    border: 1px solid rgba(85,107,47, 0.2);
  }

  .card-header {
    background-color: rgba(85,107,47, 0.1);
    border-bottom: 1px solid rgba(85,107,47, 0.2);
  }

</style>

<script>
  import UserSurveyForm from '~/components/UserSurveyForm'
  import TilesInfo from '~/components/TilesInfo'

  import {dataConfig} from '~/utils/config'
  import {getFileSize} from '~/utils/data'
  import {getPureText} from '~/utils/misc'

  export default {
    name: 'SidePanel',
    props: {
      fileList: { type: Array, required: true }
    },
    data() {
      return {
        filesBaseUrl: dataConfig.filesBaseUrl,
        filesDirectory: dataConfig.filesDirectory,
        searchString: '',
        surveyTemplate: null,
        tags: [],
        allKeywords: {en: [], es: []},
        filteredTags: null
      }
    },
    created() {
      this.fileList.forEach(item => {
        // Auto add format as keyword
        if (!item.keywords['en'].includes(item.format)) item.keywords['en'].push(item.format)
        if (!item.keywords['es'].includes(item.format)) item.keywords['es'].push(item.format)

        item.keywords['en'].forEach(kw => {
          if (!this.allKeywords.en.includes(kw)) {
            this.allKeywords.en.push(kw)
          }
        })
        item.keywords['es'].forEach(kw => {
          if (!this.allKeywords.es.includes(kw)) {
            this.allKeywords.es.push(kw)
          }
        })
        this.filteredTags = this.allKeywords[this.locale]

        this.$set(item, 'expanded', false)
        if (typeof(item.tileInfo) === 'string') this.$set(item, 'tileInfo', JSON.parse(item.tileInfo))
        if (item.file) {
          if (!item.fileSize) {
            getFileSize(item.format + '/' + item.file).then((fileSize) => {
              this.$set(item, 'fileSize', fileSize)
            })
          }
        }
      })
    },
    methods: {
      kFormatter: function (num) {
          return Math.abs(num) > 999 ? this.$n(Math.sign(num)*((Math.abs(num)/1000).toFixed(1))) + 'K' : Math.sign(num)*Math.abs(num)
      },
      mFormatter: function (num) {
          if (num) return Math.abs(num) > 999999 ? this.$n(Math.sign(num)*((Math.abs(num)/1000000).toFixed(1))) + 'M' : this.kFormatter(num)
      },
      addToMap: function (item, isOn) {
        if (isOn) {
          this.$eventBus.$emit('addtilelayer', {tiles: item.tiles, tileInfo: item.tileInfo, source: item.source})
        } else {
          this.$eventBus.$emit('removetilelayer', item.tiles)
        }
      },
      isMatch(item) {
        if (this.tags.length === 0 && this.searchString.length < 3) return true
        if (getPureText(item.name[this.locale]).includes(getPureText(this.searchString)) ||
            getPureText(item.description[this.locale]).includes(getPureText(this.searchString))) {
          if (this.tags.length === 0 || item.keywords[this.locale].some(k => this.tags.includes(k))) return true
        }
        return false
      },
      getFilteredTags(text) {
        this.filteredTags = this.allKeywords[this.locale].filter((option) => {
          return getPureText(option).includes(getPureText(text))
        })
      },
      downloadFile(index) {
        if (localStorage.surveySubmitted) {
          document.getElementById('download-' + index).click()
          this.$ga.event('files', 'downloaded', this.sortedFileList[index].file)
        } else {
          this.openUserSurvey(index)
        }
      },
      openUserSurvey(index) {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: UserSurveyForm,
          props: {
            downloadFileIndex: index,
            file: this.sortedFileList[index].file
          }
        })
      },
      displayTilesInfo(item) {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x', 'outside'],
          component: TilesInfo,
          props: {
            metaData: item
          }
        })
      },
      addTagToFilterList(tag) {
        if (!this.tags.includes(tag)) this.tags.push(tag)
      }
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
      sortedFilteredTags() {
        let collator = new Intl.Collator()
        return this.filteredTags.sort((a, b) => (collator.compare(a, b)))
      },
      locale() {
        return this.$i18n.locale.toString().substr(0,2)
      }
    }
  }
</script>

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
            <input class="input" type="text" :placeholder="$t('label.search')">
            <span class="icon is-left">
              <font-awesome :icon="['fas', 'search']"/>
            </span>
            </p>
          </div>
          </div>
          <div v-for="item, index in fileList" class="card">
            <div class="card-header">
              <p class="card-header-title has-text-centered">{{ item.name[$i18n.locale.substr(0, 2)] }}</p>
              <a href="#" @click="item.visible = !item.visible" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <font-awesome :icon="['fas', 'angle-down']"/>
                </span>
              </a>
            </div>
            <transition name="slide">
              <div v-show="item.visible" class="card-content">
                <div class="buttons" style="margin-top: 2px; justify-content: center;">
                  <b-button style="width: 48%;" size="is-small" rounded>
                    <font-awesome :icon="['fas', 'download']"/><b> {{ $t('label.download') }}</b>
                  </b-button>
                  <!-- <b-button style="width: 48%;" size="is-small" type="is-primary" outlined>
                    <font-awesome :icon="['fas', 'map-marked-alt']"/><b> {{ $t('label.addtomap') }}</b>
                  </b-button> -->
                  <b-field>
                    <b-switch size="is-small">{{ $t('label.addtomap') }}</b-switch>
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
        </div>
      </aside>

      <div class="column">
        <InteractiveMap class="map-container" ref="interactivemap">
        </InteractiveMap>
      </div>

    </div>

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
        accessToken: 'NOT NEEDED',
        mapStyle: null,
        mapCenter: [-66.58, 6.42],
        mapZoom: 5,
        activeTab: 0,
        isLoading: true
      }
    },
    components: {
      InteractiveMap
    },
    created() {

      this.doFitBounds = true
      data.getMetaEntries().then((data) => {
        this.fileList =  data.collection
        this.isLoading = false
        this.fileList.forEach(item => {
          this.$set(item, 'visible', false)
        })
        console.log(data.collection)
      })
    },
    mounted() {

    },
    methods: {
      tabChange(value) {
        if (value === 1) {
          this.$nextTick().then(() => {
            this.$refs.interactivemap.map.resize()
          })
        }
      }
    },
    computed: {
      getNumRows() {
        return (this.fileList.length/3).toFixed(0)
      }
    }
  }
</script>

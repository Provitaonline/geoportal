<template>
  <Layout :hasBanner="false">
    <ClientOnly>
      <div v-if="showDisclaimer" class="disclaimer">
        <b-notification type="is-warning" :closable="false" has-icon class="has-text-centered" role="alert">
          <span v-html="$page.aboutData.disclaimer[$i18n.locale.substr(0, 2)]"></span>
          <br>
          <b-button @click="ackDisclaimer()" label="Ok" />
        </b-notification>
      </div>
    </ClientOnly>
    <div class="columns is-gapless">
      <SidePanel class="column is-narrow" :fileList="fileList" />
      <InteractiveMap id="mapColumn" class="column" :layerMeta="fileList" />
    </div>
  </Layout>
</template>

<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .disclaimer {
    position: absolute;
    top: 64px;
    left: 0px;
    z-index: 18;
  }

  @media only screen and (min-width: 769px) {
    .disclaimer {
      left: 320px;
    }
  }


</style>
<page-query>
  query {
    allMetaData: allMetaData (sort: [{ by: "collectionId", order: ASC }, { by: "collectionItemId", order: ASC }]) {
      edges {
        node {
          date
          description {
            en
            es
          }
          file
          format
          keywords {
            en
            es
          }
          name {
            en
            es
          }
          source
          tiles
          tileInfo
          tileLabels
          isCollectionItem
          collectionId
          collectionItemId
        }
      }
    }
    collectionsData: collectionsData (id: "collections") {
      collections {
        collectionId
        description {
          en
          es
        }
        format
        source
        keywords {
          en
          es
        }
        name {
          en
          es
        }
        tileInfo
        tileLabels
        itemLabel {
          en
          es
        }
      }
    }
    aboutData: aboutData (id: "about") {
      disclaimer {
        en
        es
      }
    }
  }
</page-query>

<script>
  import SidePanel from '~/components/SidePanel.vue'
  import InteractiveMap from '~/components/InteractiveMap.vue'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.main')
      }
    },
    data() {
      return {
        fileList: [],
        showDisclaimer: false
      }
    },
    components: {
      SidePanel,
      InteractiveMap
    },
    created() {
      if (process.isClient) this.showDisclaimer = !localStorage.disclaimerAcknowledged
      this.fileList = []
      this.$page.allMetaData.edges.forEach(item => {
        if (!item.node.isCollectionItem) {
          this.fileList.push(item.node)
        } else {
          let collection = this.$page.collectionsData.collections.find(c => c.collectionId === item.node.collectionId)
          let idx = this.fileList.findIndex(el => el.collectionId === item.node.collectionId)
          if (idx === -1) {
            let cII = {collectionItemInfo: [{collectionItemId: item.node.collectionItemId, file: item.node.file, tiles: item.node.tiles, date: item.node.date}]}
            this.fileList.push(Object.assign(item.node, collection, cII))
          } else {
            this.fileList[idx].collectionItemInfo.push({collectionItemId: item.node.collectionItemId, file: item.node.file, tiles: item.node.tiles, date: item.node.date})
          }
        }
      })
      console.log('Branch ', process.env.GRIDSOME_BRANCH)
    },
    methods: {
      ackDisclaimer() {
        this.showDisclaimer = false
        localStorage.disclaimerAcknowledged = true
      }
    }
  }
</script>

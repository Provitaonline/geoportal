<template>
  <Layout :hasBanner="false">
    <div class="columns is-gapless">
      <SidePanel class="column is-narrow" :fileList="fileList" />
      <InteractiveMap id="mapColumn" class="column" :layerMeta="fileList" />
    </div>
  </Layout>
</template>

<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  @media only screen and (max-width: 768px) {
    .map-container {
      flex-grow: 1;
      margin: 0 auto;
      position: relative;
      width: auto;
      max-width: 90vw;
    }
  }
</style>

<page-query>
  query {
    allMetaData: allMetaData {
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
        }
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
        fileList: []
      }
    },
    components: {
      SidePanel,
      InteractiveMap
    },
    created() {
      this.fileList = this.$page.allMetaData.edges.map(item => item.node)
    }
  }
</script>

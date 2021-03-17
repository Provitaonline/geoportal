<template>
  <Layout :hasBanner="false">
    <div class="columns is-gapless">
      <SidePanel class="column is-narrow" :fileList="fileList" />
      <InteractiveMap id="mapColumn" class="column" :layerMeta="fileList" />
    </div>
  </Layout>
</template>

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
          hashCode
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

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
        date
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
      console.log(this.fileList)
      this.fileList = []
      this.$page.allMetaData.edges.forEach(item => {
        if (!item.node.isCollectionItem) {
          this.fileList.push(item.node)
        } else {
          let collection = this.$page.collectionsData.collections.find(c => c.collectionId === item.node.collectionId)
          let idx = this.fileList.findIndex(el => el.collectionId === item.node.collectionId)
          if (idx === -1) {
            let cII = {collectionItemInfo: [{collectionItemId: item.node.collectionItemId, file: item.node.file, tiles: item.node.tiles}]}
            this.fileList.push(Object.assign(item.node, collection, cII))
          } else {
            this.fileList[idx].collectionItemInfo.push({collectionItemId: item.node.collectionItemId, file: item.node.file, tiles: item.node.tiles})
          }
        }
      })
      console.log('Branch ', process.env.GRIDSOME_BRANCH)
    }
  }
</script>

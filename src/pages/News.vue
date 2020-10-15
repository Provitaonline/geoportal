<template>
  <NewsLayout>
    <div class="box">
      <DisplayNewsItem v-for="item, index in loadedNewsItems" :key="item.id" :item="item" />
      <ClientOnly>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </ClientOnly>
    </div>
  </NewsLayout>
</template>

<page-query>
  query ($page: Int) {
    allNewsData: allNewsData (sortBy: "date", order: DESC, perPage: 10, page: $page) @paginate {
      pageInfo {
        totalPages
        currentPage
      }
      edges {
        node {
          headline {
            en
            es
          }
          text {
            en
            es
          }
          date
          key
          reference
          thumb
        }
      }
    }
  }
</page-query>

<script>

  import NewsLayout from '~/layouts/NewsLayout'
  import DisplayNewsItem from '~/components/DisplayNewsItem'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.news')
      }
    },
    data() {
      return {
        loadedNewsItems: [],
        currentPage: 1,
        isImageModalActive: false,
        image: null
      }
    },
    created() {
      this.loadedNewsItems.push(...this.$page.allNewsData.edges)
    },
    components: {
      NewsLayout,
      DisplayNewsItem
    },
    methods: {
      async infiniteHandler($state) {
        if (this.currentPage + 1 > this.$page.allNewsData.pageInfo.totalPages) {
          $state.complete()
        } else {
          const { data } = await this.$fetch(
            `/news/${this.currentPage + 1}`
          )
          if (data.allNewsData.edges.length) {
            this.currentPage = data.allNewsData.pageInfo.currentPage
            this.loadedNewsItems.push(...data.allNewsData.edges)
            $state.loaded()
          } else {
            $state.complete()
          }
        }
      }
    }
  }
</script>

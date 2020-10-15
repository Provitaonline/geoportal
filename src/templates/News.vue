<template>
  <NewsLayout :yyyymm="$context.yyyymm">
    <div class="box">
      <DisplayNewsItem v-for="item, index in $page.allNewsData.edges" :key="item.id" :item="item" />
    </div>
  </NewsLayout>
</template>

<page-query>
  query($yyyymm: Date) {
    allNewsData: allNewsData (filter: {yyyymm: {dteq: $yyyymm}}, sortBy: "date", order: DESC) {
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
    components: {
      NewsLayout,
      DisplayNewsItem
    }
  }
</script>

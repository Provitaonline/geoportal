<template>
  <NewsLayout :yyyymm="$context.yyyymm">
    <DisplayNews :news="$page.allNewsData.edges" />
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
  import DisplayNews from '~/components/DisplayNews'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.news')
      }
    },
    components: {
      NewsLayout,
      DisplayNews
    }
  }
</script>

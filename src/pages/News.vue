<template>
  <NewsLayout>
    <DisplayNews :news="$page.allNewsData.edges" />
  </NewsLayout>
</template>

<page-query>
  query {
    allNewsData: allNewsData (sortBy: "date", order: DESC, limit: 50) {
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

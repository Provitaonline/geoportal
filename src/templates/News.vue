<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.news') }} ({{ new Date($context.yyyymm).toLocaleString($i18n.locale, { month: 'long' }) + ' ' + $context.yyyymm.substr(0, 4) }})
      </h1>
    </template>
    <br>
    <DisplayNews :news="$page.allNewsData.edges" />
  </Layout>
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

  import DisplayNews from '~/components/DisplayNews'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.news')
      }
    },
    components: {
      DisplayNews
    }
  }
</script>

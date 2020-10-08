<template>
  <Layout :bannerImage="bannerImage">
    <template slot="banner">
      {{ $t('label.about') }}
    </template>
    <div class="container" v-html="$page.about.edges[0].node.content"></div>
  </Layout>
</template>

<style lang="scss" scoped>

  ::v-deep p {
    padding: 1em;
  }

</style>

<page-query>
  query($locale: String) {
    about: allAboutData(filter: { locale: { eq: $locale }}) {
      edges {
        node {
          content
        }
      }
    }
  }
</page-query>

<script>

export default {
  metaInfo() {
    return {
      title: this.$t('label.about')
    }
  },
  data() {
    return {
      bannerImage: require('!!assets-loader!~/../data/images/about.jpg')
    }
  }
}
</script>

<template>
  <Layout :bannerImage="bannerImage">
    <template slot="banner">
      {{ $t('label.about') }}
    </template>
    <div class="container" v-html="$page.aboutData.text[$i18n.locale.substr(0, 2)]"></div>
  </Layout>
</template>

<style lang="scss" scoped>

  ::v-deep p {
    padding: 1em;
  }

</style>

<page-query>
  query About {
    aboutData: aboutData (id: "about") {
      text {
        en
        es
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

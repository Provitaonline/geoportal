<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.about') }}
      </h1>
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
  }
}
</script>

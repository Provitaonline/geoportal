<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.about') }}
      </h1>
    </template>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error doloremque omnis animi, eligendi magni a voluptatum, vitae, consequuntur rerum illum odit fugit assumenda rem dolores inventore iste reprehenderit maxime! Iusto.</p>
  </Layout>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.$t('label.about')
    }
  }
}
</script>

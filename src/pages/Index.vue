<template>
  <Layout>
    <template slot="banner">
      <h1 class="title has-text-centered is-uppercase">
        Geoportal Provita
      </h1>
    </template>

    <b-tabs type="is-boxed" :animated="false">
      <b-tab-item label="Archivos">
        <g-image alt="Example image" src="~/favicon.png" width="135" />

        <h1>{{ $i18n.locale }} {{ $t('message.hello') }}, world!</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur excepturi labore tempore expedita, et iste tenetur suscipit explicabo! Dolores, aperiam non officia eos quod asperiores
        </p>

        <p class="home-links">
          <a href="https://gridsome.org/docs/" target="_blank" rel="noopener">Gridsome Docs</a>
          <a href="https://github.com/gridsome/gridsome" target="_blank" rel="noopener">GitHub</a>
        </p>
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-4 is-child box">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">Vialidad</p>
                    </div>
                  </div>
                  <div class="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus nec iaculis mauris.
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-4 is-child box">
              <p class="title">Two</p>
            </div>
            <div class="tile is-4 is-child box">
              <p class="title">Three</p>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item label="Mapa">
        PRONTO...
      </b-tab-item>
    </b-tabs>

  </Layout>
</template>

<style lang="scss" scoped>

  .home-links a {
    margin-right: 1rem;
  }

  .box {
    box-shadow: none;
  }
</style>

<script>
  export default {
    metaInfo() {
      return {
        title: this.$t('label.main')
      }
    },
  }
</script>

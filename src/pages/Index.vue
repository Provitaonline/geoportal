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
          <div class="tile is-parent" style="flex-wrap: wrap;">
            <div v-for="item in fileList" class="tile is-4 is-parent">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/480x320.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">{{ item.name[$i18n.locale.substr(0, 2)] }}</p>
                    </div>
                  </div>
                  <div class="content">
                    {{ item.description[$i18n.locale.substr(0, 2)] }}
                  </div>
                </div>
              </div>
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

</style>

<script>
  import * as data from '~/utils/data'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.main')
      }
    },
    data() {
      return {
        fileList: []
      }
    },
    created() {
      data.getMetaEntries().then((data) => {
        this.fileList =  data.collection
        console.log(data.collection)
      })
    },
    computed: {
      getNumRows() {
        return (this.fileList.length/3).toFixed(0)
      }
    }
  }
</script>

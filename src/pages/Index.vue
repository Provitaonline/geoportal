<template>
  <Layout>
    <template slot="banner">
      <h1 class="title has-text-centered is-uppercase">
        Geoportal Provita
      </h1>
    </template>
    <br>
    <h1>{{ $i18n.locale }} {{ $t('message.hello') }}, world!</h1>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur excepturi labore tempore expedita, et iste tenetur suscipit explicabo! Dolores, aperiam non officia eos quod asperiores
    </p>
    <br><br>
    <b-tabs type="is-boxed" :animated="false">
      <b-tab-item :label="$t('label.files')">
        <div class="tile is-ancestor">
          <div class="tile is-parent" style="flex-wrap: wrap;">
            <div v-for="item in fileList" class="tile is-4 is-parent">
              <div style="width: 100%;" class="card">
                <div class="card-header">
                  <p style="display: block;" class="card-header-title has-text-centered">{{ item.name[$i18n.locale.substr(0, 2)] }}</p>
                </div>
                <div class="card-image">
                  <figure class="image is-4by3">
                    <g-image v-if="item.thumb" :src="'https://raw.githubusercontent.com/jimmyangel/geoportal-data/master/thumbnails/' + item.thumb" alt="Thumbnail"></g-image>
                    <g-image v-else src="~/assets/images/480x320.png" alt="Placeholder image"></g-image>
                  </figure>
                  <div class="buttons" style="margin-top: 2px; justify-content: center;">
                    <b-button style="width: 48%;" size="is-small" type="is-primary" outlined>
                      <font-awesome :icon="['fas', 'download']"/><b> {{ $t('label.download') }}</b>
                    </b-button>
                    <b-button style="width: 48%;" size="is-small" type="is-primary" outlined>
                      <font-awesome :icon="['fas', 'map-marked-alt']"/><b> {{ $t('label.addtomap') }}</b>
                    </b-button>
                  </div>
                </div>
                <div class="card-content">
                  <div class="content">
                    <small><b>{{ $t('label.date') }}: </b>{{ $d(new Date(item.date)) }}</small><br><br>
                    <div v-if="item.keywords">
                      <span class="tag" style="margin-right: 0.5em;" v-for="kwd in item.keywords[$i18n.locale.substr(0, 2)]">
                        {{ kwd }}
                      </span>
                      <br><br>
                    </div>
                    <span v-html="item.description[$i18n.locale.substr(0, 2)]"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('label.map')">
        PRONTO...
      </b-tab-item>
    </b-tabs>

  </Layout>
</template>

<style lang="scss" scoped>

  .card-header {
    background-color: rgba(85,107,47, 0.1);
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

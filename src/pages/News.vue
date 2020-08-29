<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.news') }}
      </h1>
    </template>
    <br>
    <div class="container">
      <div class="box">
        <article v-for="item, index in sortedListOfNewsItems" class="media">
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{item.headline[$i18n.locale.substr(0, 2)]}}</strong>
                <br>
                <small>{{$d(new Date(item.date), 'long')}}</small>
                <br>
                {{item.text[$i18n.locale.substr(0, 2)]}}
              </p>
            </div>
          </div>
          <figure v-if="item.thumb" class="media-right">
            <p class="image is-270x270">
              <img :src="item.thumb">
            </p>
          </figure>
        </article>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>

  .is-270x270 {
    height: 270px;
    width: 270px;
  }

</style>

<script>
  import {getListOfNewsItems} from '~/utils/data'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.news')
      }
    },
    data() {
      return {
        listOfNewsItems: []
      }
    },
    mounted() {
      this.getListOfNewsItems()
      console.log(this.listOfNewsItems)
    },
    methods: {
      getListOfNewsItems() {
        getListOfNewsItems().then((result) => {
          this.listOfNewsItems = result
        })
      }
    },
    computed: {
      sortedListOfNewsItems() {
        if (this.listOfNewsItems.length) {
          return this.listOfNewsItems.sort((a, b) => (a.date > b.date) ? -1 : 1)
        }
      }
    }
  }
</script>

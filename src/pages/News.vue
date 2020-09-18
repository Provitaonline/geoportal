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
                <div class="is-size-5 has-text-weight-bold">{{item.headline[$i18n.locale.substr(0, 2)]}}</div>
                <small>{{$d(new Date(item.date), 'long')}}</small>
                <br><br>
                {{item.text[$i18n.locale.substr(0, 2)]}}
              </p>
              <p v-if="item.reference" class="has-text-weight-semibold">
                <g-link :to="item.reference">{{$t('label.readmore')}}</g-link>
              </p>
            </div>
          </div>
          <figure v-if="item.thumb" class="media-right">
            <p class="image">
              <g-image :src="item.thumb"></g-image>
            </p>
          </figure>
        </article>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>

  .image {
    width: 300px;
  }

  @media screen and (max-width: 600px) {
    .media {
      flex-direction: column;
    }
    .media-right {
      align-self: center;
      margin-left: 0;
      margin-top: 12px;
    }
  }

</style>

<page-query>
  query {
    allNewsData: allNewsData {
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
      this.listOfNewsItems = this.$page.allNewsData.edges.map(item => item.node)
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

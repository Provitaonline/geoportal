<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.news') }} <a title="RSS feed" href="/rss.xml"><span class="is-size-5"><font-awesome :icon="['fas', 'rss']"/></span></a>
      </h1>
    </template>
    <br>
    <div class="container">
      <div class="box">
        <article v-for="item, index in $page.allNewsData.edges" class="media">
          <div class="media-content">
            <div class="content">
              <p>
                <div class="is-size-5 has-text-weight-bold">{{item.node.headline[$i18n.locale.substr(0, 2)]}}</div>
                <small>{{$d(new Date(item.node.date), 'long')}}</small>
                <br><br>
                {{item.node.text[$i18n.locale.substr(0, 2)]}}
              </p>
              <p v-if="item.node.reference" class="has-text-weight-semibold">
                <g-link :to="item.node.reference">{{$t('label.readmore')}}</g-link>
              </p>
            </div>
          </div>
          <figure v-if="item.node.thumb" class="media-right">
            <p class="image">
              <g-image :src="item.node.thumb"></g-image>
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
    allNewsData: allNewsData (sortBy: "date", order: DESC, limit: 50) {
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

  export default {
    metaInfo() {
      return {
        title: this.$t('label.news')
      }
    }
  }
</script>

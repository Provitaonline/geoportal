<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.faqlong') }}
      </h1>
    </template>
    <br>
    <div class="container">
      <div class="box">
        <article v-for="item, index in FAQ" class="media">
            <div class="content">
              <div>
                <div class="is-size-4 has-text-weight-bold is-italic">{{item.question[$i18n.locale.substr(0, 2)]}}</div>
                <br>
                <div v-html="answerHTML(index)"></div>
              </div>
            </div>
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

<script>
  import {getFAQ} from '~/utils/data'
  import marked from 'marked'

  export default {
    metaInfo() {
      return {
        title: this.$t('label.faq')
      }
    },
    data() {
      return {
        FAQ: []
      }
    },
    mounted() {
      this.getFAQ()
    },
    methods: {
      getFAQ() {
        getFAQ().then((result) => {
          this.FAQ = result
        })
      },
      answerHTML(index) {
        return marked(this.FAQ[index].answer[this.$i18n.locale.substr(0, 2)])
      }
    }
  }
</script>

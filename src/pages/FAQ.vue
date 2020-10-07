<template>
  <Layout :bannerImage="bannerImage" :bannerText="$t('label.faqlong')">
    <br>
    <div class="container">
      <div class="box">
        <article v-for="item, index in $page.faqData.questions" class="media">
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

  .hero-bg-img {
    width: 100%;
    object-fit: cover;
  }

</style>

<page-query>
  query FAQ {
    faqData: faqData (id: "faq") {
      questions {
        question {
          en
          es
        }
        answer {
          en
          es
        }
      }
    }
  }
</page-query>

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
        bannerImage: require('~/../data/images/faq.jpg')
      }
    },
    mounted() {
    },
    methods: {
      answerHTML(index) {
        return marked(this.$page.faqData.questions[index].answer[this.$i18n.locale.substr(0, 2)])
      }
    }
  }
</script>

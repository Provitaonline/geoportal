<template>
  <Layout :bannerImage="bannerImage">
    <template slot="banner">
      {{$t('label.faqlong')}}
    </template>
    <br>
    <div class="container">
      <div v-for="subject, idx in questionsBySubject">
        <div :id="'subject-' + idx" class="subject is-size-3 has-text-weight-bold">
          {{$t('label.faqsubjects')[idx]}}
        </div>
        <b-collapse :open="false" class="card" animation="slide" v-for="itemindex in subject" v-bind:key="itemindex">
          <div slot="trigger" slot-scope="props" class="card-header is-size-4 has-text-weight-semibold">
            <p class="card-header-title" v-bind:class="{'open-question': props.open}">
              {{$page.faqData.questions[itemindex].question[$i18n.locale.substr(0, 2)]}}
            </p>
            <a class="card-header-icon" v-bind:class="{'open-question': props.open}">
              <b-icon
                :icon="props.open ? 'angle-up' : 'angle-down'">
              </b-icon>
            </a>
          </div>
          <div class="card-content" v-html="answerHTML(itemindex)"></div>
        </b-collapse>
      </div>
    </div>
    <br>
  </Layout>
</template>

<style lang="scss" scoped>
  @import "~/assets/style/_variables";

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

  .subject {
    color: $site-color;
  }

  .open-question {
    color: $site-icon-color;
  }

</style>

<page-query>
  query FAQ {
    faqData: faqData (id: "faq") {
      questions {
        subject
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
        bannerImage: require('!!assets-loader!~/../data/images/faq.jpg')
      }
    },
    mounted() {
    },
    methods: {
      answerHTML(index) {
        return marked(this.$page.faqData.questions[index].answer[this.$i18n.locale.substr(0, 2)])
      }
    },
    computed: {
      questionsBySubject() {
        let questionsBySubject = []
        this.$page.faqData.questions.forEach((question, index) => {
          if (questionsBySubject[question.subject]) {
            questionsBySubject[question.subject].push(index)
          } else {
            questionsBySubject[question.subject] = [index]
          }
        })
        return questionsBySubject
      }
    }
  }
</script>

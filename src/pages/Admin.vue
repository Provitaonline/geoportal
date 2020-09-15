<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.admin') }}
      </h1>
    </template>
    <br>
    <section class="container">
      <b-tabs @input="tabChanged()" v-model="activeTab" type="is-boxed" :animated="false">
        <b-tab-item value="files" :label="$t('label.files')">
          <AdminFilesTab />
        </b-tab-item>
        <b-tab-item value="news" :label="$t('label.news')">
          <AdminNewsTab />
        </b-tab-item>
        <b-tab-item value="survey" :label="$t('label.survey')">
          <AdminSurveyTab />
        </b-tab-item>
        <b-tab-item value="faq" :label="$t('label.faq')">
          <AdminFAQTab />
        </b-tab-item>
        <b-tab-item value="more" :label="$t('label.more')">
          <AdminMoreTab />
        </b-tab-item>
      </b-tabs>
    </section>

    <ClientOnly>
      <b-modal :active="isLoginActive" :can-cancel="false" :width="640" scroll="keep">
        <div class="card">
          <div class="card-header has-text-centered">
            <div class="card-header-title" style="display: inline-block;">
              <g-image style="max-height: 61px;" src="~/assets/images/logo.png" alt="Logo" />
              <br><br>{{$t('message.adminconnect')}}<br>
              <span style="font-weight: normal;">{{$t('message.admincolab')}}</span>
            </div>
          </div>
          <div class="card-content has-text-centered">
            <b-message v-if="loginError" :title="$t('message.connectionerror')" type="is-warning" :closable="false">
              {{loginError}}
            </b-message>
            <font-awesome size="4x" :icon="['fab', 'github']"/><br><br>
            <a @click="userLogin" class="button is-primary">
                {{$t('label.connect')}}
            </a>
          </div>
        </div>
      </b-modal>
    </ClientOnly>
  </Layout>
</template>

<style lang="scss" scoped>

  .is-hidden {
    display: none;
  }

</style>

<script>
import {getStateToken, getUserInfo} from '~/utils/user'
import {getListOfFiles, getMetaFromRepo, getMetaSha, saveMetaFromRepo, getPresignedUrl, uploadFileToS3, deleteFiles, submitJob} from '~/utils/data'
import {adminConfig} from '~/utils/config'
import {getPureText} from '~/utils/misc'
import AdminFilesTab from '~/components/AdminFilesTab'
import AdminNewsTab from '~/components/AdminNewsTab'
import AdminSurveyTab from '~/components/AdminSurveyTab'
import AdminFAQTab from '~/components/AdminFAQTab'
import AdminMoreTab from '~/components/AdminMoreTab'

export default {
  metaInfo() {
    return {
      title: this.$t('label.admin')
    }
  },
  data() {
    return {
      loginError: null,
      isLoginActive: true,
      activeTab: 'files'
    }
  },
  components: {
    AdminFilesTab,
    AdminNewsTab,
    AdminSurveyTab,
    AdminFAQTab,
    AdminMoreTab
  },
  created() {
    if (this.$route.query.token) {
      let token = this.$route.query.token
      if (this.$route.query.state === sessionStorage.stateToken) {
        getUserInfo(token).then((info) => {
          sessionStorage.githubtoken = token
          sessionStorage.userInfo = JSON.stringify(info)
          this.commitUserInfo(info)
        }).catch((e) => {
          if (e.status === 403) {
            console.log('Unauthorized', e)
            this.loginError = this.$t('message.unauthorized')
          } else {
            console.log('Login failed', e)
            this.loginError = e.data.message
          }
        })
      } else {
        // This should never happen
        console.log('State mismatch')
        this.loginError = 'State mismatch'
      }

      let eLang = sessionStorage.stateToken.substr(0,2)
      let langPath = (this.$i18n.fallbackLocale.substr(0,2) === eLang) ? '' : '/' + eLang
      this.$router.push(langPath + '/admin') // Clean the url, stay with selected locale
      this.isLoginActive = false
    } else {
      if (process.isClient) {
        if (sessionStorage.githubtoken) {
          this.commitUserInfo(JSON.parse(sessionStorage.userInfo))
          this.isLoginActive = false
          console.log('user already connected', this.$store.state.login)
        }
      } else {
        this.isLoginActive = false
      }
    }
    this.$eventBus.$on('userlogoff', this.userLogoff)
  },
  mounted () {

  },
  methods: {
    userLogin: function() {
      sessionStorage.stateToken = this.locale + getStateToken()
      window.location.href = '/.netlify/functions/auth-start?state=' + sessionStorage.stateToken
    },
    userLogoff: function() {
      this.$store.commit('setLogin', null)
      this.$store.commit('setName', null)
      this.$store.commit('setAvatar', null)
      sessionStorage.removeItem('githubtoken')
      sessionStorage.removeItem('userInfo')
      this.isLoginActive = true
    },
    commitUserInfo(info) {
      this.$store.commit('setLogin', info.login)
      this.$store.commit('setName', info.name)
      this.$store.commit('setAvatar', info.avatar)
    },
    tabChanged() {
      if (this.activeTab !== 'more') {
        this.$eventBus.$emit(this.activeTab + 'tabvisible')
      }
    }
  },
  computed: {
    locale() {
      return this.$i18n.locale.toString().substr(0,2)
    }
  }
}
</script>

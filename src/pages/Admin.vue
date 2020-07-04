<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.admin') }}
      </h1>
    </template>
    <br>
    <section class="container">
      <b-tabs type="is-boxed" :animated="false">
        <b-tab-item label="Archivos">
          <div class="container" style="max-width: 600px;">
            <div class="buttons" style="justify-content: center;">
              <b-button :disabled="!fileListCheckedRows.length">Remove checked</b-button>&nbsp;&nbsp;
              <b-upload><a class="button">Upload new file</a></b-upload>
            </div>
            <b-table :data="listOfFiles" checkable :header-checkable="false" :checked-rows.sync="fileListCheckedRows">
              <template slot-scope="props">
                <b-table-column field="name" :label="$t('label.name')">
                  {{props.row.name}}
                </b-table-column>
                <b-table-column field="size" :label="$t('label.size')" centered>
                  {{$n(props.row.size)}}
                </b-table-column>
                <b-table-column field="date" :label="$t('label.date')">
                  {{$d(new Date(props.row.date), 'long')}}
                </b-table-column>
              </template>
            </b-table>
          </div>
        </b-tab-item>
        <b-tab-item label="Metadata">
          Metadatos
        </b-tab-item>
      </b-tabs>
    </section>
    <b-modal v-if="!$store.state.login" :active="true" :can-cancel="false" :width="640" scroll="keep">
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
  </Layout>
</template>

<script>
import {getStateToken, getUserInfo} from '~/utils/user'
import {getListOfFiles} from '~/utils/data'

export default {
  metaInfo() {
    return {
      title: this.$t('label.admin')
    }
  },
  data() {
    return {
      loginError: null,
      listOfFiles: [],
      fileListCheckedRows: [],
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        createImageThumbnails: false
      }
    }
  },
  components: {
  },
  mounted () {
    if (this.$route.query.token) {
      let token = this.$route.query.token
      if (this.$route.query.state === sessionStorage.stateToken) {
        getUserInfo(token).then((info) => {
          sessionStorage.githubtoken = token
          sessionStorage.userInfo = JSON.stringify(info)
          this.commitUserInfo(info)
          this.loginRequired = false
          this.getListOfFiles()
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
    } else {
      if (sessionStorage.githubtoken) {
        this.commitUserInfo(JSON.parse(sessionStorage.userInfo))
        this.getListOfFiles()
      }
    }
  },
  methods: {
    userLogin: function() {
      sessionStorage.stateToken = this.$i18n.locale.toString().substr(0,2) + getStateToken()
      window.location.href = '/.netlify/functions/auth-start?state=' + sessionStorage.stateToken
    },
    commitUserInfo(info) {
      this.$store.commit('setLogin', info.login)
      this.$store.commit('setName', info.name)
      this.$store.commit('setAvatar', info.avatar)
    },
    getListOfFiles() {
      getListOfFiles(this.$n).then((result) => {
        this.listOfFiles = result
        console.log(result)
      })
    }
  }
}
</script>

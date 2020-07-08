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
              <b-button style="width: 160px;" :disabled="!fileListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
              <b-upload><a style="width: 160px;" class="button"><font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.upload')}}</a></b-upload>
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
          <div class="container" style="max-width: 900px;">
            <div class="buttons" style="justify-content: center;">
              <b-button style="width: 160px;" :disabled="!metaCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
              <b-button style="width: 160px;" class="button"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addrecord')}}</b-button>
              <b-button style="width: 160px;" :disabled="!isSaveEnabled" class="button"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.savechanges')}}</b-button>
            </div>
            <b-table hoverable :data="sortedMetaFromRepo" checkable :header-checkable="false" :checked-rows.sync="metaCheckedRows">
              <template slot-scope="props">
                <b-table-column field="name" :label="$t('label.title')">
                  {{props.row.name[$i18n.locale.substr(0, 2)]}}
                </b-table-column>
                <b-table-column field="keywords" :label="$t('label.tags')">
                  <span class="tag" style="margin-right: 0.5em;" v-for="kwd in props.row.keywords[$i18n.locale.substr(0, 2)]">
                    {{ kwd }}
                  </span>
                </b-table-column>
                <b-table-column field="date" :label="$t('label.date')">
                  {{$d(new Date(props.row.date), 'long')}}
                </b-table-column>
                <b-table-column>
                  <a @click="editMeta(props.index)"><font-awesome :icon="['far', 'edit']"/></a>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </b-tab-item>
      </b-tabs>
    </section>

    <b-modal v-if="!$store.state.login" :active="isLoginActive" :can-cancel="false" :width="640" scroll="keep">
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
import {getListOfFiles, getMetaFromRepo} from '~/utils/data'
import MetaEntryEditor from '~/components/MetaEntryEditor'

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
      isLoginActive: false,
      metaFromRepo: [],
      metaCheckedRows: [],
      currentIndex: 0,
      currentEntry: {},
      isSaveEnabled: false
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
          this.getListOfFiles()
          this.getMetaFromRepo()
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
        this.getMetaFromRepo()
        console.log('user already connected', this.$store.state.login)
      } else {
        this.isLoginActive = true
      }
    }
    this.$eventBus.$on('userlogoff', this.userLogoff)
    this.$eventBus.$on('acceptmetachanges', this.acceptMetaChanges)
  },
  methods: {
    userLogin: function() {
      sessionStorage.stateToken = this.$i18n.locale.toString().substr(0,2) + getStateToken()
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
    getListOfFiles() {
      getListOfFiles(this.$n).then((result) => {
        this.listOfFiles = result
      })
    },
    getMetaFromRepo() {
      getMetaFromRepo(sessionStorage.githubtoken).then((result) => {
        this.metaFromRepo = result
      }).catch((e) => {
        console.log('error retrieving meta from repo', e)
      })
    },
    editMeta(index) {
      this.currentIndex = index
      this.currentEntry = JSON.parse(JSON.stringify(this.metaFromRepo[index]))

      this.$buefy.modal.open({
        parent: this,
        canCancel: ['escape', 'x'],
        component: MetaEntryEditor,
        props: {
          metaEntry: this.currentEntry
        }
      })
      console.log('meta', this.currentEntry)
    },
    acceptMetaChanges(m) {
      //this.metaFromRepo[this.currentIndex] = m
      this.$set(this.metaFromRepo, this.currentIndex, m)
      this.isSaveEnabled = true
      console.log(this.metaFromRepo)
    }
  },
  computed: {
    sortedMetaFromRepo() {
      let locale = this.$i18n.locale.toString().substr(0,2)
      let collator = new Intl.Collator()
      if (this.metaFromRepo.length) {
        return this.metaFromRepo.sort((a, b) => (collator.compare(a.name[locale], b.name[locale])))
      }
    }
  }
}
</script>

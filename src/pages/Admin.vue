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
              <b-button style="width: 160px;" disabled class="button"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.savechanges')}}</b-button>
            </div>
            <b-table hoverable :data="sortedMetaFromRepo" checkable :header-checkable="false" :checked-rows.sync="metaCheckedRows">
              <template slot-scope="props">
                <b-table-column field="name" :label="$t('label.title')">
                  {{props.row.name[$i18n.locale.substr(0, 2)]}}
                </b-table-column>
                <b-table-column field="keywords" :label="$t('label.tags')">
                  {{props.row.keywords[$i18n.locale.substr(0, 2)].join(', ')}}
                </b-table-column>
                <b-table-column field="date" :label="$t('label.date')">
                  {{$d(new Date(props.row.date), 'long')}}
                </b-table-column>
                <b-table-column>
                  <a @click="isEditModalActive=true; currentIndex=props.index"><font-awesome :icon="['far', 'edit']"/></a>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </b-tab-item>
      </b-tabs>
    </section>
    <b-modal v-if="metaFromRepo.length" :active.sync="isEditModalActive">
      <div class="card">
        <div class="card-header has-text-centered">
          <p class="card-header-title title" style="display: inline-block;">
            {{sortedMetaFromRepo[currentIndex].name[$i18n.locale.substr(0, 2)]}}
          </p>
        </div>
        <div class="card-content">
          <div class="content">
            <b-field :label="$t('label.titlespanish')">
              <b-input v-model="sortedMetaFromRepo[currentIndex].name.es"></b-input>
            </b-field>
            <b-field :label="$t('label.titleenglish')">
              <b-input v-model="sortedMetaFromRepo[currentIndex].name.en"></b-input>
            </b-field>
            <b-field :label="$t('label.file')">
              <b-input v-model="sortedMetaFromRepo[currentIndex].file"></b-input>
            </b-field>
            <b-field :label="$t('label.date')+ ' (UTC)'">
              <b-input v-model="sortedMetaFromRepo[currentIndex].date"></b-input>
            </b-field>
            <b-field :label="$t('label.tagsspanish')">
              <b-taginput v-model="sortedMetaFromRepo[currentIndex].keywords.es" placeholder="Add a tag"></b-taginput>
            </b-field>
            <b-field :label="$t('label.tagsenglish')">
              <b-taginput v-model="sortedMetaFromRepo[currentIndex].keywords.en" placeholder="Add a tag"></b-taginput>
            </b-field>
            <b-field :label="$t('label.descriptionspanish')">
              <b-input v-model="sortedMetaFromRepo[currentIndex].description.es" type="textarea"></b-input>
            </b-field>
            <b-field :label="$t('label.descriptionenglish')">
              <b-input v-model="sortedMetaFromRepo[currentIndex].description.en" type="textarea"></b-input>
            </b-field>
            <br>
            <p class="is-size-5 has-text-weight-bold">{{$t('label.tiledisplay')}}</p>
            <b-field :label="$t('label.tiletype')">
              <b-select v-model="sortedMetaFromRepo[currentIndex].tileInfo.type">
                <option value="raster">{{$t('label.raster')}}</option>
                <option value="vector">{{$t('label.vector')}}</option>
              </b-select>
            </b-field>
            <div v-if="sortedMetaFromRepo[currentIndex].tileInfo.type === 'vector'">
              <b-field :label="$t('label.mapdisplayattribute')">
                <b-input v-model="sortedMetaFromRepo[currentIndex].tileInfo.displayAttribute"></b-input>
              </b-field>
              <b-field :label="$t('label.geometry')">
                <b-select v-model="sortedMetaFromRepo[currentIndex].tileInfo.style.type">
                  <option value="fill">{{$t('label.polygon')}}</option>
                  <option value="line">{{$t('label.line')}}</option>
                </b-select>
              </b-field>
              <div v-if="sortedMetaFromRepo[currentIndex].tileInfo.style.type === 'line'">
                <b-field :label="$t('label.linecolor')">
                  <b-input v-model="sortedMetaFromRepo[currentIndex].tileInfo.style.paint['line-color']"></b-input>
                </b-field>
                <b-field :label="$t('label.linewidth')">
                  <b-input v-model="sortedMetaFromRepo[currentIndex].tileInfo.style.paint['line-width']"></b-input>
                </b-field>
              </div>
              <div v-else>
                <b-field :label="$t('label.fillcolor')">
                  <b-input v-model="sortedMetaFromRepo[currentIndex].tileInfo.style.paint['fill-color']"></b-input>
                </b-field>
                <b-field :label="$t('label.fillopacity')">
                  <b-input v-model="sortedMetaFromRepo[currentIndex].tileInfo.style.paint['fill-opacity']"></b-input>
                </b-field>
                <b-field :label="$t('label.filloutlinecolor')">
                  <b-input v-model="sortedMetaFromRepo[currentIndex].tileInfo.style.paint['fill-outline-color']"></b-input>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
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
      isEditModalActive: false,
      currentIndex: 0
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
        console.log(result)
        this.metaFromRepo = result
      }).catch((e) => {
        console.log('error retrieving meta from repo', e)
      })
    }
  },
  computed: {
    sortedMetaFromRepo() {
      let locale = this.$i18n.locale.toString().substr(0,2)
      let collator = new Intl.Collator()
      if (this.metaFromRepo.length) {
        return this.metaFromRepo.sort((a, b) => (collator.compare(a.name[locale], b.name[locale])))
      }
    },
  }
}
</script>

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
        <b-tab-item :label="$t('label.files')">
          <div class="container" style="max-width: 800px;">
            <div class="buttons" style="justify-content: center;">
              <b-button @click="confirmDelete" style="width: 160px;" :disabled="!fileListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
              <b-upload @input="uploadFile" native accept=".zip,.tif" v-model="fileToUpload"><a style="width: 160px;" class="button"><font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.upload')}}</a></b-upload>
            </div>
            <b-progress v-show="uploadInProgress" :value="uploadProgressValue" show-value format="percent"></b-progress>
            <b-table :data="listOfFiles" checkable hoverable :header-checkable="false" :checked-rows.sync="fileListCheckedRows">
              <template slot-scope="props">
                <b-table-column field="name" searchable :label="$t('label.name')">
                  {{props.row.name}}
                </b-table-column>
                <b-table-column field="size" :label="$t('label.size')" centered>
                  {{$n(props.row.size)}}
                </b-table-column>
                <b-table-column field="date" :label="$t('label.uploaddate')">
                  {{$d(new Date(props.row.date), 'long')}}
                </b-table-column>
                <b-table-column>
                  <a @click="editMeta(props.row.name)"><font-awesome :icon="['far', 'edit']"/></a>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('label.news')">
          <div class="container" style="max-width: 900px;">
            Coming soon...
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

<style lang="scss" scoped>

  .is-hidden {
    display: none;
  }

</style>

<script>
import {getStateToken, getUserInfo} from '~/utils/user'
import {getListOfFiles, getMetaFromRepo, saveMetaFromRepo, getPresignedUrl, uploadFileToS3, deleteFiles} from '~/utils/data'
import {getPureText} from '~/utils/misc'
import {adminConfig} from '~/utils/config'
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
      searchString: '',
      fileToUpload: null,
      uploadInProgress: false,
      uploadProgressValue: 0
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
    editMeta(fileName) {
      let idx = this.metaFromRepo.findIndex(({ file }) => file === fileName)
      if (idx != -1) {
        this.currentIndex = idx
        this.currentEntry = JSON.parse(JSON.stringify(this.metaFromRepo[this.currentIndex]))
        this.openMetaEditor(this.currentEntry)
      } else {
        this.currentIndex = this.metaFromRepo.length
        this.openMetaEditor({file: fileName})
      }
    },
    openMetaEditor(metaEntry) {
      this.$buefy.modal.open({
        parent: this,
        canCancel: ['escape', 'x'],
        component: MetaEntryEditor,
        props: {
          metaEntry: metaEntry,
          listOfFiles: this.listOfFiles.map(f => f.name)
        }
      })
    },
    acceptMetaChanges(m) {
      this.$set(this.metaFromRepo, this.currentIndex, m)
      saveMetaFromRepo(sessionStorage.githubtoken, this.metaFromRepo).then(() => {
        console.log('meta data saved')
      }).catch((e) => {
        console.log('error saving data to repo ', e)
      })
    },
    matchClass(row, index) {
      if (this.searchString.length < 3) return ''
      if (getPureText(row.name[this.locale]).includes(getPureText(this.searchString))) return ''
      if (getPureText(row.keywords[this.locale].join(' ')).includes(getPureText(this.searchString))) return ''
      return 'is-hidden'
    },
    uploadFile(file) {
      if (file) {
        this.uploadInProgress = true
        getPresignedUrl(sessionStorage.githubtoken, file.name, file.type).then((result) => {
          let formData = new FormData()
          Object.entries(result.data.fields).forEach(([k, v]) => {
          	formData.append(k, v)
          })
          formData.append('file', file)
          uploadFileToS3(result.data.url, formData, this.uploadProgress).then((response) => {
            this.resetProgressIndicator()
            this.getListOfFiles()
          }).catch((e) => {
            console.log('error uploading file to S3 ', e, e.response)
            this.resetProgressIndicator()
          })
        }).catch((e) => {
          console.log('error getting presigned post ', e.response)
          this.resetProgressIndicator()
        })
      }
      this.$nextTick(() => {
        this.fileToUpload = null // Reset input upload
      })
    },
    confirmDelete() {
      console.log('confirm delete')
      let filesToDelete = this.fileListCheckedRows.map((item) => item.name)
      this.$buefy.dialog.confirm({
        title: this.$t('message.removefiles'),
        message: this.$t('message.removefileswarning') + ':<br><br>' + filesToDelete.join(', '),
        confirmText: this.$t('label.confirm'),
        cancelText: this.$t('label.cancel'),
        type: 'none',
        focusOn: 'cancel',
        onConfirm: () => {this.deleteFilesAndMeta(filesToDelete)}
      })
    },
    deleteFilesAndMeta(filesToDelete) {
      let oLength = this.metaFromRepo.length
      this.metaFromRepo = this.metaFromRepo.filter((item) => !filesToDelete.includes(item.file))
      if (oLength != this.metaFromRepo.length) { // We have meta to delete
        saveMetaFromRepo(sessionStorage.githubtoken, this.metaFromRepo).then(() => {
          console.log('meta data saved')
          deleteFiles(sessionStorage.githubtoken, JSON.stringify(filesToDelete)).then(() => {
            this.fileListCheckedRows = []
            this.getListOfFiles()
          }).catch((e) => {
            console.log('error deleting files ', e.response)
          })
        }).catch((e) => {
          console.log('error saving data to repo ', e)
        })
      } else {
        deleteFiles(sessionStorage.githubtoken, JSON.stringify(filesToDelete)).then(() => {
          this.fileListCheckedRows = []
          this.getListOfFiles()
        }).catch((e) => {
          console.log('error deleting files ', e.response)
        })
      }
    },
    uploadProgress(e) {
      this.uploadProgressValue =  Math.round((e.loaded * 100) / e.total)
    },
    resetProgressIndicator() {
      this.uploadInProgress = false
      this.uploadProgressValue = 0
    }
  },
  computed: {
    sortedMetaFromRepo() {
      let collator = new Intl.Collator()
      if (this.metaFromRepo.length) {
        return this.metaFromRepo.sort((a, b) => (collator.compare(a.name[this.locale], b.name[this.locale])))
      }
    },
    locale() {
      return this.$i18n.locale.toString().substr(0,2)
    }
  }
}
</script>

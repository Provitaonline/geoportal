<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.admin') }}
      </h1>
    </template>
    <div style="max-width: 400px; margin: 0 auto; height: 16px;">
      <b-progress v-show="uploadInProgress" :value="uploadProgressValue" show-value format="percent"></b-progress>
    </div>
    <section class="container">
      <b-tabs type="is-boxed" :animated="false">
        <b-tab-item :label="$t('label.files')">
          <div class="container" style="max-width: 800px;">
            <div class="buttons" style="justify-content: center;">
              <b-button @click="confirmDelete" style="width: 160px;" :disabled="!fileListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
              <b-upload @input="uploadFile" :disabled="uploadInProgress" native accept=".zip,.tif" v-model="fileToUpload">
                <a style="width: 160px;" class="button" :disabled="uploadInProgress">
                  <font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.upload')}}
                </a>
              </b-upload>
            </div>
            <div class="control has-icons-left" style="max-width: 300px;">
              <input class="input" type="search" v-model="searchString" :placeholder="$t('label.search')">
              <span class="icon is-left">
                <font-awesome :icon="['fas', 'search']"/>
              </span>
            </div>
            <b-table :data="listOfFiles" checkable hoverable :header-checkable="false" :checked-rows.sync="fileListCheckedRows" :row-class="matchClass">
              <b-table-column field="name" :label="$t('label.name')" v-slot="props">
                {{props.row.name}}
              </b-table-column>
              <b-table-column field="size" :label="$t('label.size')" centered v-slot="props">
                {{$n(props.row.size)}}
              </b-table-column>
              <b-table-column field="date" :label="$t('label.uploaddate')" v-slot="props">
                {{$d(new Date(props.row.date), 'long')}}
              </b-table-column>
              <b-table-column label="Meta" centered v-slot="props">
                <a @click="editMeta(props.row.name)">
                  <font-awesome v-if="fileHasMeta(props.row.name)" :icon="['far', 'edit']"/>
                  <font-awesome v-else :icon="['fas', 'plus']"/>
                </a>
              </b-table-column>
            </b-table>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('label.news')">
          <AdminNewsTab />
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
import {getListOfFiles, getMetaFromRepo, getMetaSha, saveMetaFromRepo, getPresignedUrl, uploadFileToS3, deleteFiles, submitJob} from '~/utils/data'
import {adminConfig} from '~/utils/config'
import {getPureText} from '~/utils/misc'
import MetaEntryEditor from '~/components/MetaEntryEditor'
import AdminNewsTab from '~/components/AdminNewsTab'

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
      metaSha: null,
      currentIndex: 0,
      currentEntry: {},
      fileToUpload: null,
      uploadInProgress: false,
      uploadProgressValue: 0,
      searchString: ''
    }
  },
  components: {
    AdminNewsTab
  },
  created() {
    if (process.isClient) {
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
      } else {
        if (sessionStorage.githubtoken) {
          this.commitUserInfo(JSON.parse(sessionStorage.userInfo))
          console.log('user already connected', this.$store.state.login)
        } else {
          this.isLoginActive = true
        }
      }
    } else {
      this.isLoginActive = true
    }
    this.$eventBus.$on('userlogoff', this.userLogoff)
    this.$eventBus.$on('acceptmetachanges', this.acceptMetaChanges)
  },
  mounted () {
    this.getListOfFiles()
    getMetaFromRepo(sessionStorage.githubtoken).then((result) => {
      this.metaFromRepo = result.data.collection
      this.metaSha = result.sha
    })
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
      getListOfFiles().then((result) => {
        this.listOfFiles = result
      })
    },
    editMeta(fileName) {
      getMetaSha(sessionStorage.githubtoken).then((sha) => {
        if (sha !== this.metaSha) {
          // Meta changed, we must refresh
          console.log('Metadata has been edited')
          getMetaFromRepo(sessionStorage.githubtoken).then((result) => {
            this.metaFromRepo = result.data.collection
            this.metaSha = result.sha
            this.addOrEditMeta(fileName)
          })
        } else {
          this.addOrEditMeta(fileName)
        }
      }).catch((e) => {
        console.log('error retrieving meta sha', e)
      })
    },
    addOrEditMeta(fileName) {
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

      getMetaSha(sessionStorage.githubtoken).then((sha) => {
        if (sha === this.metaSha) { // Can only save if meta has not been changed
          this.$set(this.metaFromRepo, this.currentIndex, m.metaEntry)
          saveMetaFromRepo(sessionStorage.githubtoken, this.metaFromRepo).then(() => {
            console.log('meta data saved')
            // Refresh meta sha
            getMetaSha(sessionStorage.githubtoken).then((sha) => {
              this.metaSha = sha
            })
            if (m.job) {
              this.submitRtilesJob(m.job)
            }
          }).catch((e) => {
            console.log('error saving data to repo ', e)
          })
        } else {
          // Display error message
          this.$buefy.dialog.alert({title: this.$t('label.error'), message: this.$t('message.dataconflictmessage'), type: 'is-danger', hasIcon: true})
          // And refresh meta
          getMetaFromRepo(sessionStorage.githubtoken).then((result) => {
            this.metaFromRepo = result.data.collection
            this.metaSha = result.sha
          })
        }
      })
    },
    submitRtilesJob(job) {
      submitJob(sessionStorage.githubtoken, job).then((response) => {
        console.log('batch job submitted')
      }).catch((e) => {
        console.log('error submitting batch job ', e.response)
      })
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
            if (file.name.split('.').pop().toLowerCase() === 'zip') { // For the time being
              let job = {file: file.name, tileInfo: {type: 'vector'}}
              submitJob(sessionStorage.githubtoken, job).then((response) => {
                console.log('batch job submitted')
              }).catch((e) => {
                console.log('error submitting batch job ', e.response)
              })
            }
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
    },
    fileHasMeta(filename) {
      return this.metaFromRepo.findIndex(element => element.file === filename) == -1 ? false : true
    },
    matchClass(row, index) {
      if (getPureText(row.name).includes(getPureText(this.searchString))) return ''
      return 'is-hidden'
    }
  },
  computed: {
    locale() {
      return this.$i18n.locale.toString().substr(0,2)
    }
  }
}
</script>

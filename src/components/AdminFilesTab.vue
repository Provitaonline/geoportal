<template>
  <div class="container" style="max-width: 800px;">
    <div class="buttons" style="justify-content: center;">
      <b-button @click="confirmDelete" style="width: 160px;" :disabled="!fileListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-upload @input="uploadFile" :disabled="uploadInProgress" native accept=".zip,.tif" v-model="fileToUpload">
        <a style="width: 160px;" class="button" :disabled="uploadInProgress">
          <font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.upload')}}
        </a>
      </b-upload>
    </div>
    <div style="max-width: 400px; margin: 0 auto; height: 16px;">
      <b-progress v-show="uploadInProgress" :value="uploadProgressValue" show-value format="percent"></b-progress>
    </div>
    <br>
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
</template>

<script>
  import {getListOfFiles, getMetaFromRepo, getMetaSha, saveMetaFromRepo, getPresignedUrl, uploadFileToS3, deleteFiles, submitJob} from '~/utils/data'
  import {getPureText} from '~/utils/misc'
  import NewsItemEditor from '~/components/NewsItemEditor'
  import MetaEntryEditor from '~/components/MetaEntryEditor'

  export default {
    name: 'AdminFilesTab',
    data() {
      return {
        listOfFiles: [],
        fileListCheckedRows: [],
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
    mounted() {
      this.getListOfFiles()
      getMetaFromRepo(sessionStorage.githubtoken).then((result) => {
        this.metaFromRepo = result.data.collection
        this.metaSha = result.sha
      })
      this.$eventBus.$on('acceptmetachanges', this.acceptMetaChanges)
    },
    methods: {
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
    }
  }
</script>

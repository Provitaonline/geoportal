<template>
  <div class="container" style="max-width: 800px;">
    <b-loading v-model="isLoading"></b-loading>
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
  import {getListOfFiles, getPresignedUrl, uploadFileToS3, deleteFiles, submitJob, getMetaListFromRepo, deleteMetaListFromRepo} from '~/utils/data'
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
        searchString: '',
        isLoading: true
      }
    },
    mounted() {
      this.getListOfFiles()
      getMetaListFromRepo(sessionStorage.githubtoken).then(result => {
        console.log('retrieve list from meta')
        this.metaFromRepo = result
        this.isLoading = false
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
        this.addOrEditMeta(fileName)
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
            metaEntry: metaEntry
          }
        })
      },
      acceptMetaChanges(m) {
        console.log('accept changes')
        this.$set(this.metaFromRepo, this.currentIndex, m.metaEntry)
        if (m.job) {
          this.submitRtilesJob(m.job)
        }
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
        this.isLoading = true
        let oLength = this.metaFromRepo.length
        this.metaFromRepo = this.metaFromRepo.filter((item) => !filesToDelete.includes(item.file))
        if (oLength != this.metaFromRepo.length) { // We have meta to delete
          deleteMetaListFromRepo(sessionStorage.githubtoken, filesToDelete).then(() => {
            deleteFiles(sessionStorage.githubtoken, JSON.stringify(filesToDelete)).then(() => {
              this.fileListCheckedRows = []
              this.getListOfFiles()
              this.isLoading = false
            }).catch((e) => {
              console.log('error deleting files ', e.response)
            })
          }).catch((e) => {
            console.log('error deleting meta from repo ', e)
          })
        } else {
          deleteFiles(sessionStorage.githubtoken, JSON.stringify(filesToDelete)).then(() => {
            this.fileListCheckedRows = []
            this.getListOfFiles()
            this.isLoading = false
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

<template>
  <div class="card">
    <b-loading v-model="isLoading"></b-loading>
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          {{$t('label.downloadsurveydata')}}
        </p>
      </div>
      <div class="card-content">
        <div class="content">
          <b-field horizontal custom-class="version-label" :label="$t('label.surveyversion')">
            <b-select v-model="selectedVersion" horizontal>
              <option
                v-for="version in versions"
                :value="version"
                :key="version">
                {{ version }}
              </option>
            </b-select>
          </b-field>
        </div>
      </div>
      <a id="download-file" download="surveydata.csv" :href="downloadLink"></a>
      <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="getSurveyData()" style="width: 140px;"><font-awesome :icon="['fas', 'download']"/>&nbsp;{{$t('label.download')}}</b-button>
        </div>
      </div>

  </div>
</template>

<style lang="scss" scoped>

  ::v-deep .version-label {
    flex-basis: auto !important;
  }

</style>

<script>
  import {getSurveyVersions, getSurveyData} from '~/utils/data'

  export default {
    name: 'SurveyDataDownloader',
    props: {
    },
    data() {
      return {
        isLoading: true,
        versions: null,
        selectedVersion: null,
        downloadLink: null
      }
    },
    created() {
      console.log('get versions')
      this.getSurveyVersions()
    },
    methods: {
      getSurveyVersions() {
        if (!this.versions) {
          getSurveyVersions(sessionStorage.githubtoken).then((result) => {
            this.versions = result
            this.selectedVersion = result[this.versions.length - 1]
            this.isLoading = false
          })
        }
      },
      getSurveyData() {
        this.isLoading = true
        getSurveyData(sessionStorage.githubtoken, this.selectedVersion).then(result => {
          this.downloadLink = URL.createObjectURL(new Blob([result]))
          this.$nextTick(() => {
            document.getElementById('download-file').click()
            this.$parent.close()
            URL.revokeObjectURL(this.downloadLink)
            this.downloadLink = null
            this.isLoading = false
          })
        })
      }
    }
  }
</script>

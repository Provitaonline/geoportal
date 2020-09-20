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
          <b-field horizontal custom-class="version-label" label="Versión de la encuesta">
              <b-select v-model="defaultVersion" horizontal placeholder="Versión">
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

      <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="" style="width: 140px;"><font-awesome :icon="['fas', 'download']"/>&nbsp;{{$t('label.download')}}</b-button>
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
  import {getSurveyVersions} from '~/utils/data'

  export default {
    name: 'SurveyDataDownloader',
    props: {
    },
    data() {
      return {
        isLoading: true,
        versions: null,
        defaultVersion: null
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
            this.defaultVersion = result[this.versions.length - 1]
            this.isLoading = false
          })
        }
      }
    }
  }
</script>

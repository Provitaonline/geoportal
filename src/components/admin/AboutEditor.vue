<template>
  <div class="card">
    <b-loading v-model="isLoading"></b-loading>
    <ValidationObserver v-slot="{passes, dirty, pristine, failed}">
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          {{$t('label.about')}}
        </p>
      </div>
      <div v-if="about" class="card-content">
        <div class="content">
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.aboutspanish') + ' (markdown)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="about.text.es" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.aboutenglish') + ' (markdown)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="about.text.en" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
        </div>
      </div>

      <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(saveChanges)" :disabled="failed || pristine" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>

    </ValidationObserver>
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep textarea {
    font-family: monospace;
    font-size: 0.9rem;
    min-height: 14em !important;
  }

</style>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import * as validation from '~/utils/validation'
  import {getAboutFromRepo, saveAbout} from '~/utils/data'

  export default {
    name: 'AboutEditor',
    props: {
    },
    data() {
      return {
        isLoading: true,
        about: null
      }
    },
    components: {
      ValidationObserver,
      ValidationProvider
    },
    beforeCreate() {
      validation.localize(this.$i18n.locale.toString().substr(0,2))
    },
    created() {
      console.log('get about')
      this.getAbout()
    },
    methods: {
      getAbout() {
        if (!this.about) {
          getAboutFromRepo(sessionStorage.githubtoken).then((result) => {
            this.about = result
            this.isLoading = false
          })
        }
      },
      saveChanges() {
        this.isLoading = true
        saveAbout(sessionStorage.githubtoken, JSON.parse(JSON.stringify(this.about))).then(() => {
          console.log('saved About')
          this.isLoading = false
          this.$store.commit('setPublishIndicator', true)
          this.$parent.close()
        }).catch((e) => {
          console.log('error saving About to github ', e)
        })
      }
    }
  }
</script>

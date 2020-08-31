<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty, failed}">
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          <span v-if="!newsItem.key">{{$t('label.newitem')}}: </span>
          {{newsItem.headline[$i18n.locale.substr(0, 2)]}}
        </p>
      </div>
      <div class="card-content">
        <div class="content">
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.publishdate')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-datepicker :disabled="!!newsItem.key" v-model="formDate" :locale="$i18n.locale" icon="calendar" trap-focus></b-datepicker>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.headlinespanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="newsItem.headline.es"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.headlineenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="newsItem.headline.en"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.textspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="newsItem.text.es" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.textenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="newsItem.text.en" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="url" v-slot="{ errors, valid }">
            <b-field :label="$t('label.reference')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="newsItem.reference"></b-input>
            </b-field>
          </ValidationProvider>
          <br>
          <ValidationProvider :rules="'size:' + maxNewsImageKB" v-slot="{ errors, valid }">
            <b-field :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-upload @input="uploadImage" class="file-label" native accept=".jpeg,.jpg,.png" v-model="imageToUpload">
                <span class="file-cta">
                  <font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;&nbsp;<span class="file-label">{{$t('label.addimage')}} ({{$t('label.upto')}} {{maxNewsImageKB}}KB)</span>
                </span>
                <span class="file-name" v-if="imageToUpload">
                  {{ imageToUpload.name }}
                </span>
              </b-upload>
            </b-field>
          </ValidationProvider>
          <div class="image">
            <img :src="imagePreview">
          </div>
        </div>
      </div>

      <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="failed || !dirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>

    </ValidationObserver>
  </div>
</template>

<style lang="scss" scoped>

  .image {
    height: 270px;
    width: 270px;
  }

</style>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'
import {adminConfig} from '~/utils/config'

export default {
  name: 'NewsItemEditor',
  props: {
    newsItem: { type: Object, required: true }
  },
  data() {
    return {
      imagePreview: null,
      imageToUpload: null,
      maxNewsImageKB: adminConfig.maxNewsImageKB,
      formDate: new Date()
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
    if (this.newsItem.date) this.formDate = new Date(this.newsItem.date)
    if (this.newsItem.thumb) this.imagePreview = this.newsItem.thumb
  },
  methods: {
    uploadImage(imageFile) {
      if (imageFile.size <= 1000 * adminConfig.maxNewsImageKB) {
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          this.imagePreview = reader.result
        }, false)

        reader.readAsDataURL(imageFile)
      }
    },
    acceptChanges() {
      if (this.imagePreview) {
        this.newsItem.thumb = this.imagePreview
      }
      if (!this.newsItem.key) {
        this.newsItem.date = this.formDate.toISOString()
        this.newsItem.key = 'news/' + this.newsItem.date + '-' + (new Date().getTime()).toString(36) + '.json'
      }
      this.$eventBus.$emit('acceptnewsitemchanges', this.newsItem)
      this.$parent.close()
    }
  }
}
</script>

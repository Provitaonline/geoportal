<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty}">
      <div class="card-header">
        <p class="card-header-title is-size-4">
          {{newsItem.headline[$i18n.locale.substr(0, 2)]}}
        </p>
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="!dirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <ValidationProvider rules="required|utc" v-slot="{ errors, valid }">
            <b-field :label="$t('label.date')+ ' (UTC)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="newsItem.date"></b-input>
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
              <b-input v-model="newsItem.text.en" type="textarea"></b-input>
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
          <ValidationProvider v-slot="{ errors, valid }">
            <b-field :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-upload @input="uploadImage" native accept=".jpeg,.jpg,.png" v-model="imageToUpload">
                <a style="width: 160px;" class="button">
                  <font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.addimage')}}
                </a>
              </b-upload>
            </b-field>
          </ValidationProvider>
          <div>
            <img style="max-width: 300px;" src="https://bulma.io/images/placeholders/480x480.png">
          </div>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'


export default {
  name: 'NewsItemEditor',
  props: {
    newsItem: { type: Object, required: true }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  },
  beforeCreate() {
    validation.localize(this.$i18n.locale.toString().substr(0,2))
  }
}
</script>

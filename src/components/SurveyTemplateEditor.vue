<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty, pristine, failed}">
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          <span v-if="isNew">{{$t('label.newquestion')}}:&nbsp;</span>
          {{q.label[$i18n.locale.substr(0, 2)]}}
        </p>
      </div>
      <div class="card-content">
        <div class="content">
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.name')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.fieldname"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.questionspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.label.es"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.questionenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.label.en"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.questiontype')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-radio v-model="q.type" name="type" native-value="text">{{$t('label.text')}}</b-radio>
              <b-radio @input="selectEntry()" v-model="q.type" name="type" native-value="select">{{$t('label.selection')}}</b-radio>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-if="q.type === 'select'" rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.optionsspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-taginput v-model="q.options.es" :placeholder="$t('label.addoption')"></b-taginput>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-if="q.type === 'select'" rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.optionsenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-taginput v-model="q.options.en" :placeholder="$t('label.addoption')"></b-taginput>
            </b-field>
          </ValidationProvider>
        </div>
      </div>

      <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="failed || pristine" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.accept')}}</b-button>
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
  name: 'SurveyTemplateEditor',
  props: {
    question: { type: Object, required: true }
  },
  data() {
    return {
      q: this.question,
      isNew: false
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
    if (!this.question.fieldname) this.isNew = true
  },
  methods: {
    acceptChanges() {
      this.$eventBus.$emit('acceptquestionchanges', this.q)
      this.$parent.close()
    },
    selectEntry() {
      if (!this.q.options) this.q.options = {en: [], es: []}
    }
  }
}
</script>

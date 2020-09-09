<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty, pristine, failed}">
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          <span v-if="isNew">{{$t('label.newquestion')}}:&nbsp;</span>
          {{q.question[$i18n.locale.substr(0, 2)]}}
        </p>
      </div>
      <div class="card-content">
        <div class="content">
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.questionspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.question.es"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.answerspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.answer.es" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.questionenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.question.en"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.answerenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="q.answer.en" type="textarea"></b-input>
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
  name: 'FAQEditor',
  props: {
    faqQuestion: { type: Object, required: true }
  },
  data() {
    return {
      q: this.faqQuestion,
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
    if (!this.faqQuestion.question.es) this.isNew = true
  },
  methods: {
    acceptChanges() {
      this.$eventBus.$emit('acceptfaqquestionchanges', this.q)
      this.$parent.close()
    }
  }
}
</script>

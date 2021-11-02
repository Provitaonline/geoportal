<template>
  <div>
    <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
      <b-field :label="$t('label.titlespanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-input v-model="commonMetaFlat['name.es']"></b-input>
      </b-field>
    </ValidationProvider>
    <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
      <b-field :label="$t('label.titleenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-input v-model="commonMetaFlat['name.en']"></b-input>
      </b-field>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'

export default {
  name: 'CommonMeta',
  props: {
    commonMetaFlat: { type: Object, required: true }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  }
}
</script>

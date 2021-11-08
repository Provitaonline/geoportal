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
    <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
      <b-field :label="$t('label.source')" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-input v-model="commonMetaFlat['source']"></b-input>
      </b-field>
    </ValidationProvider>
    <ValidationProvider rules="required" v-slot="{ errors, valid }">
      <b-field :label="$t('label.tagsspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-taginput v-model="esTags" :placeholder="$t('label.addtag')"></b-taginput>
      </b-field>
    </ValidationProvider>
    <ValidationProvider rules="required" v-slot="{ errors, valid }">
      <b-field :label="$t('label.tagsenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-taginput v-model="enTags" :placeholder="$t('label.addtag')"></b-taginput>
      </b-field>
    </ValidationProvider>
    <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
      <b-field :label="$t('label.descriptionspanish') + ' (markdown)'" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-input v-model="commonMetaFlat['description.es']" type="textarea"></b-input>
      </b-field>
    </ValidationProvider>
    <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
      <b-field :label="$t('label.descriptionenglish') + ' (markdown)'" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-input v-model="commonMetaFlat['description.en']" type="textarea"></b-input>
      </b-field>
    </ValidationProvider>
    <br>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'

let flatten = require('flat')
let unflatten = require('flat').unflatten

export default {
  name: 'CommonMeta',
  props: {
    commonMetaFlat: { type: Object, required: true }
  },
  data() {
    return {
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  },
  beforeCreate() {
    validation.localize(this.$i18n.locale.toString().substr(0,2))
  },
  methods: {
    unflattenTags(lang) {
      let kwds = []
      let i = 0
      while (this.commonMetaFlat['keywords.' + lang + '.' + i]) {
        kwds.push(this.commonMetaFlat['keywords.' + lang + '.' + i++])
      }
      return kwds
    },
    reflattenTags(lang, val) {
      let obj = {}
      obj['keywords.' + lang] = val
      let i = 0
      while (this.commonMetaFlat['keywords.' + lang + '.' + i]) {
        delete (this.commonMetaFlat['keywords.' + lang + '.' + i++])
      }
      let f = flatten(obj)
      Object.keys(f).forEach((key) => {
        this.$set(this.commonMetaFlat, key, f[key])
      })
    }
  },
  computed: {
    esTags: {
      get() {
        return this.unflattenTags('es')
      },
      set(val) {
        this.reflattenTags('es', val)
      }
    },
    enTags: {
      get() {
        return this.unflattenTags('en')
      },
      set(val) {
        this.reflattenTags('en', val)
      }
    }
  }
}
</script>

<template>
  <div>

  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'

let flatten = require('flat')
let unflatten = require('flat').unflatten

export default {
  name: 'CommonTileInfo',
  props: {
    commonMetaFlat: { type: Object, required: true }
  },
  data() {
    return {
      //formDate: null
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

  },
  methods: {

  },
  computed: {

  }
}
</script>

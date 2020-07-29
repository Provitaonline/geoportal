import { extend, configure } from 'vee-validate'
import { required, min, regex, oneOf } from 'vee-validate/dist/rules'
import VueI18n from 'vue-i18n'

const i18n = new VueI18n()
i18n.setLocaleMessage('en', require('~/messages/validations.json').en)
i18n.setLocaleMessage('es', require('~/messages/validations.json').es)

extend('required', {
  ...required
})
extend('min', {
  ...min
})
extend('regex', {
  ...regex
})
extend('utc', {
  validate: (value) => {
    return value.match(/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\dZ/)
  }
})
extend('colorhex', {
  validate: (value) => {
    return value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  }
})
extend('colorhexa', {
  validate: (value) => {
    return value.match(/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/)
  }
})
extend('oneOf', {
  ...oneOf
})

configure({
  defaultMessage: (field, values) => {
    return i18n.t(`validations.${values._rule_}`, values)
  }
})

export function localize(locale) {
  i18n.locale = locale
}

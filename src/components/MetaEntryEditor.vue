<template>
  <div class="card">
    <ValidationObserver v-slot="{passes}">"
      <div style="position: sticky; top: 0; z-index: 45; background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          {{metaEntryFlat['name.' + $i18n.locale.substr(0, 2)]}}
        </p>
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="!isDirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.accept')}}</b-button>
        </div>
      </div>
      <div class="card-content">
        <div class="content" @change="isDirty=true">
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.titlespanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['name.es']"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.titleenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['name.en']"></b-input>
            </b-field>
          </ValidationProvider>
          <b-field :label="$t('label.file')">
            <b-input v-model="metaEntryFlat['file']"></b-input>
          </b-field>
          <ValidationProvider rules="required|utc" v-slot="{ errors, valid }">
            <b-field :label="$t('label.date')+ ' (UTC)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['date']"></b-input>
            </b-field>
          </ValidationProvider>
          <b-field :label="$t('label.tagsspanish')">
            <b-taginput v-model="esTags" placeholder="Add a tag"></b-taginput>
          </b-field>
          <b-field :label="$t('label.tagsenglish')">
            <b-taginput v-model="enTags" placeholder="Add a tag"></b-taginput>
          </b-field>
          <b-field :label="$t('label.descriptionspanish')">
            <b-input v-model="metaEntryFlat['description.es']" type="textarea"></b-input>
          </b-field>
          <b-field :label="$t('label.descriptionenglish')">
            <b-input v-model="metaEntryFlat['description.en']" type="textarea"></b-input>
          </b-field>
          <br>
          <p class="is-size-5 has-text-weight-bold">{{$t('label.tiledisplay')}}</p>
          <b-field :label="$t('label.tiletype')">
            <b-select v-model="metaEntryFlat['tileInfo.type']">
              <option value="raster">{{$t('label.raster')}}</option>
              <option value="vector">{{$t('label.vector')}}</option>
            </b-select>
          </b-field>
          <div v-if="metaEntryFlat['tileInfo.type'] === 'vector'">
            <b-field :label="$t('label.mapdisplayattribute')">
              <b-input v-model="metaEntryFlat['tileInfo.displayAttribute']"></b-input>
            </b-field>
            <b-field :label="$t('label.geometry')">
              <b-select v-model="metaEntryFlat['tileInfo.style.type']">
                <option value="fill">{{$t('label.polygon')}}</option>
                <option value="line">{{$t('label.line')}}</option>
              </b-select>
            </b-field>
            <div v-if="metaEntryFlat['tileInfo.style.type'] === 'line'">
              <b-field :label="$t('label.linecolor')">
                <b-input v-model="metaEntryFlat['tileInfo.style.paint.line-color']"></b-input>
              </b-field>
              <b-field :label="$t('label.linewidth')">
                <b-input v-model="metaEntryFlat['tileInfo.style.paint.line-width']"></b-input>
              </b-field>
            </div>
            <div v-else>
              <b-field :label="$t('label.colormethod')">
                <b-select v-model="colorMethod">
                  <option value="simple">{{$t('label.simplemethod')}}</option>
                  <option value="ramp">{{$t('label.rampmethod')}}</option>
                  <option value="categorical">{{$t('label.categoricalmethod')}}</option>
                </b-select>
              </b-field>
              <div v-if="colorMethod === 'simple'">
                <b-field :label="$t('label.fillcolor')">
                  <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color']"></b-input>
                </b-field>
              </div>
              <div v-if="colorMethod === 'ramp'">
                <b-field :label="$t('label.drivingattribute')">
                  <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.2.1']"></b-input>
                </b-field>
                <b-field grouped>
                  <b-field :label="$t('label.lowvalue')" expanded>
                    <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-color.3']"></b-input>
                  </b-field>
                  <b-field :label="$t('label.color')" expanded>
                    <b-input maxlength="7" v-model="metaEntryFlat['tileInfo.style.paint.fill-color.4']"></b-input>
                  </b-field>
                </b-field>
                <b-field grouped>
                  <b-field :label="$t('label.highvalue')" expanded>
                    <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-color.5']"></b-input>
                  </b-field>
                  <b-field :label="$t('label.color')" expanded>
                    <b-input maxlength="7" v-model="metaEntryFlat['tileInfo.style.paint.fill-color.6']"></b-input>
                  </b-field>
                </b-field>
              </div>
              <div v-if="colorMethod === 'categorical'">
                <b-field :label="$t('label.drivingattribute')">
                  <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.property']"></b-input>
                </b-field>
                <b-field :label="$t('label.defaultcolor')">
                  <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.default']"></b-input>
                </b-field>
                <label class="label">
                  {{$t('label.categoryassignment')}} <a @click="addCategoryColorPair"><font-awesome size="lg" :icon="['far', 'plus-square']"/></a>
                </label>
                <br>
                <div v-for="(key, index) in Object.keys(metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color.stops.'))">
                  <div v-if="(index%2 == 0)" class="columns">
                    <div class="column is-narrow"><a @click="removeCategoryColorPair(key)"><font-awesome size="lg" :icon="['far', 'minus-square']"/></a></div>
                    <div class="column">
                      <b-field :label="$t('label.category')" label-position="on-border" expanded>
                        <b-input expanded v-model.number="metaEntryFlat[key]"></b-input>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field :label="$t('label.color')" label-position="on-border" expanded>
                        <b-input maxlength="7" expanded v-model="metaEntryFlat[key.slice(0, -1) + '1']"></b-input>
                      </b-field>
                    </div>
                  </div>
                </div>
              </div>
              <b-field :label="$t('label.fillopacity')">
                <b-input v-model.number="metaEntryFlat['tileInfo.style.paint.fill-opacity']"></b-input>
              </b-field>
              <b-field :label="$t('label.filloutlinecolor')">
                <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-outline-color']"></b-input>
              </b-field>
            </div>
          </div>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import VueI18n from 'vue-i18n'
import { ValidationObserver, ValidationProvider, extend, configure } from 'vee-validate'
import { required, min, regex } from 'vee-validate/dist/rules'

let flatten = require('flat')
let unflatten = require('flat').unflatten

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

configure({
  defaultMessage: (field, values) => {
    return i18n.t(`validations.${values._rule_}`, values)
  }
})

export default {
  name: 'MetaEntryEditor',
  props: {
    metaEntry: { type: Object, required: true }
  },
  data() {
    return {
      isDirty: false,
      metaEntryFlat: flatten(this.metaEntry)
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  },
  beforeCreate() {
    i18n.locale = this.$i18n.locale.toString().substr(0,2)
  },
  methods: {
    acceptChanges() {
      console.log(this.metaEntryFlat)
      this.$eventBus.$emit('acceptmetachanges', unflatten(this.metaEntryFlat))
      this.$parent.close()
    },
    unflattenTags(lang) {
      let kwds = []
      let i = 0
      while (this.metaEntryFlat['keywords.' + lang + '.' + i]) {
        kwds.push(this.metaEntryFlat['keywords.' + lang + '.' + i++])
      }
      return kwds
    },
    reflattenTags(lang, val) {
      let obj = {}
      obj['keywords.' + lang] = val
      let i = 0
      while (this.metaEntryFlat['keywords.' + lang + '.' + i]) {
        delete (this.metaEntryFlat['keywords.' + lang + '.' + i++])
      }
      let f = flatten(obj)
      Object.keys(f).forEach((key) => {
        this.$set(this.metaEntryFlat, key, f[key])
      })
      this.isDirty = true
    },
    addCategoryColorPair() {
      let nCats = Object.keys(this.metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color.stops.')).length/2
      this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.stops.' + nCats + '.0', '')
      this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.stops.' + nCats + '.1', '')
    },
    removeCategoryColorPair(cKey) {
      // First, delete item
      this.$delete(this.metaEntryFlat, cKey)
      this.$delete(this.metaEntryFlat, cKey.slice(0, -1) + '1')

      // Then compact the list
      let keys = Object.keys(this.metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color.stops.'))
      let i = 0
      keys.forEach((key) => {
        let stop = Math.floor((i++)/2)
        let prefix = key.slice(0, -1)
        let sufix = key.substr(key.length -1)
        if ('tileInfo.style.paint.fill-color.stops.' + stop + '.' != prefix) {
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.stops.' + stop + '.' + sufix, this.metaEntryFlat[prefix + sufix])
          this.$delete(this.metaEntryFlat, prefix + sufix)
        }
      })
    }
  },
  computed: {
    colorMethod: {
      get() {
        if (this.metaEntryFlat['tileInfo.style.paint.fill-color.0']) return 'ramp'
        if (this.metaEntryFlat['tileInfo.style.paint.fill-color.type']) return 'categorical'
        return 'simple'
      },
      set(val) {
        Object.keys(this.metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color')).forEach(match => {
          this.$delete(this.metaEntryFlat, match)
        })
        if (val === 'ramp') {
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.0', 'interpolate')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.1.0', 'linear')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.2.0', 'get')
          return
        }
        if (val === 'categorical') {
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.type', 'categorical')
          return
        }
        this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color', '')
      }
    },
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

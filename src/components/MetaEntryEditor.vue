<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty}">
      <div style="position: sticky; top: 0; z-index: 45; background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          {{metaEntryFlat['file']}}: {{metaEntryFlat['name.' + $i18n.locale.substr(0, 2)]}}
        </p>
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="!dirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
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
          <div class="columns">
            <div class="column">
              <ValidationProvider rules="required|utc" v-slot="{ errors, valid }">
                <b-field :label="$t('label.date')+ ' (UTC)'" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input v-model="metaEntryFlat['date']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field v-model="metaEntryFlat['format']" :label="$t('label.format')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-select value="shapefile">
                    <option value="shapefile">{{$t('label.shapefile')}}</option>
                    <option value="geotiff">{{$t('label.geotiff')}}</option>
                  </b-select>
                </b-field>
              </ValidationProvider>
            </div>
          </div>
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
            <b-field :label="$t('label.descriptionspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['description.es']" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.descriptionenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['description.en']" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <br>
          <p class="is-size-5 has-text-weight-bold">{{$t('label.tiledisplay')}}</p>
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.tilelayername')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['tiles']"></b-input>
            </b-field>
          </ValidationProvider>
          <div class="columns">
            <div class="column is-narrow">
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.tiletype')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-select v-model="metaEntryFlat['tileInfo.type']" value="vector">
                    <option value="raster">{{$t('label.raster')}}</option>
                    <option value="vector">{{$t('label.vector')}}</option>
                  </b-select>
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <ValidationProvider>
                <b-field class="field">
                  <template slot="label">&nbsp;</template>
                  <b-checkbox v-model="metaEntryFlat['tileInfo.skipAutoGen']">{{$t('label.skipautogen')}}</b-checkbox>
                </b-field>
              </ValidationProvider>
            </div>
          </div>
          <div v-if="metaEntryFlat['tileInfo.type'] === 'vector'">
            <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
              <b-field :label="$t('label.mapdisplayattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="metaEntryFlat['tileInfo.displayAttribute']"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors, valid }">
              <b-field :label="$t('label.geometry')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-select v-model="metaEntryFlat['tileInfo.style.type']">
                  <option value="fill">{{$t('label.polygon')}}</option>
                  <option value="line">{{$t('label.line')}}</option>
                </b-select>
              </b-field>
            </ValidationProvider>
            <div v-if="metaEntryFlat['tileInfo.style.type'] === 'line'">
              <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                <b-field :label="$t('label.linecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input v-model="metaEntryFlat['tileInfo.style.paint.line-color']"></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.linewidth')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model="metaEntryFlat['tileInfo.style.paint.line-width']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
            <div v-else>
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.colormethod')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-select v-model="colorMethod">
                    <option value="simple">{{$t('label.simplemethod')}}</option>
                    <option value="ramp">{{$t('label.rampmethod')}}</option>
                    <option value="categorical">{{$t('label.categoricalmethod')}}</option>
                  </b-select>
                </b-field>
              </ValidationProvider>
              <div v-if="colorMethod === 'simple'">
                <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.fillcolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color']"></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div v-if="colorMethod === 'ramp'">
                <ValidationProvider rules="required" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.drivingattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.2.1']"></b-input>
                  </b-field>
                </ValidationProvider>
                <b-field grouped>
                  <ValidationProvider rules="required" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.lowvalue')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-color.3']"></b-input>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.color')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input maxlength="7" v-model="metaEntryFlat['tileInfo.style.paint.fill-color.4']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </b-field>
                <b-field grouped>
                  <ValidationProvider rules="required" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.highvalue')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-color.5']"></b-input>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.color')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input maxlength="7" v-model="metaEntryFlat['tileInfo.style.paint.fill-color.6']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </b-field>
              </div>
              <div v-if="colorMethod === 'categorical'">
                <ValidationProvider rules="required" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.drivingattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.property']"></b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.defaultcolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.default']"></b-input>
                  </b-field>
                </ValidationProvider>
                <label class="label">
                  {{$t('label.categoryassignment')}} <a @click="addCategoryColorPair"><font-awesome size="lg" :icon="['far', 'plus-square']"/></a>
                </label>
                <br>
                <div v-for="(key, index) in Object.keys(metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color.stops.'))">
                  <div v-if="(index%2 == 0)" class="columns">
                    <div class="column is-narrow"><a @click="removeCategoryColorPair(key)"><font-awesome size="lg" :icon="['far', 'minus-square']"/></a></div>
                    <div class="column">
                      <ValidationProvider rules="required" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.category')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input expanded v-model.number="metaEntryFlat[key]"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.color')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input maxlength="7" expanded v-model="metaEntryFlat[key.slice(0, -1) + '1']"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                  </div>
                </div>
              </div>
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.fillopacity')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-opacity']"></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                <b-field :label="$t('label.filloutlinecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-outline-color']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
          </div>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'

let flatten = require('flat')
let unflatten = require('flat').unflatten

export default {
  name: 'MetaEntryEditor',
  props: {
    metaEntry: { type: Object, required: true },
    listOfFiles: { type: Array, required: true }
  },
  data() {
    return {
      metaEntryFlat: flatten(this.metaEntry)
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
    acceptChanges() {
      if (this.metaEntryFlat['tileInfo.type'] === 'vector') {
        this.metaEntryFlat['tileInfo.style.id'] = this.metaEntryFlat['tiles']
        this.metaEntryFlat['tileInfo.style.source'] = this.metaEntryFlat['tiles']
        this.metaEntryFlat['tileInfo.style.source-layer'] = this.metaEntryFlat['tiles']
      }
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
    },
    filteredListOfFiles() {
      if (this.metaEntryFlat['file']) {
        return this.listOfFiles.filter((option) => {
          return option
            .toString()
            .toLowerCase()
            .indexOf(this.metaEntryFlat['file'].toLowerCase()) >= 0
        })
      }
    }
  }
}

</script>

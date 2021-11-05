<template>
  <div>
    <p class="is-size-5 has-text-weight-bold">{{$t('label.tiledisplay')}}</p>
    <ValidationProvider rules="required" v-slot="{ errors, valid }">
      <b-field :label="$t('label.tiletype')" :type="{ 'is-danger': errors[0] }" :message="errors">
        <b-select @input="cleanMeta($event)" v-model="commonMetaFlat['tileInfo.type']" value="vector">
          <option value="raster">{{$t('label.raster')}}</option>
          <option value="vector">{{$t('label.vector')}}</option>
        </b-select>
      </b-field>
    </ValidationProvider>
    <div v-if="commonMetaFlat['tileInfo.type'] === 'vector'">
      <ValidationProvider rules="required|min:2" v-slot="{ errors, valid }">
        <b-field :label="$t('label.mapdisplayattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
          <b-input v-model="commonMetaFlat['tileInfo.displayAttribute']"></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider rules="required" v-slot="{ errors, valid }">
        <b-field :label="$t('label.geometry')" :type="{ 'is-danger': errors[0] }" :message="errors">
          <b-select v-model="commonMetaFlat['tileInfo.style.type']">
            <option value="fill">{{$t('label.polygon')}}</option>
            <option value="line">{{$t('label.line')}}</option>
            <option value="circle">{{$t('label.point')}}</option>
          </b-select>
        </b-field>
      </ValidationProvider>
      <div v-if="commonMetaFlat['tileInfo.style.type'] === 'line'">
        <div class="columns">
          <div class="column">
            <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
              <b-field :label="$t('label.linecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="commonMetaFlat['tileInfo.style.paint.line-color']"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">&nbsp;</template>
              <div class="input-color-container" style="margin-left: 12px;">
                <ValidationProvider>
                  <input v-model="commonMetaFlat['tileInfo.style.paint.line-color']" class="input-color" type="color" />
                </ValidationProvider>
              </div>
            </b-field>
          </div>
        </div>
        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
          <b-field :label="$t('label.linewidth')" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.line-width']"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
      <div v-if="commonMetaFlat['tileInfo.style.type'] === 'circle'">
        <div class="columns">
          <div class="column">
            <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
              <b-field :label="$t('label.circlecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="commonMetaFlat['tileInfo.style.paint.circle-color']"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">&nbsp;</template>
              <div class="input-color-container" style="margin-left: 12px;">
                <ValidationProvider>
                  <input v-model="commonMetaFlat['tileInfo.style.paint.circle-color']" class="input-color" type="color" />
                </ValidationProvider>
              </div>
            </b-field>
          </div>
        </div>
        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
          <b-field :label="$t('label.circleopacity')" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.circle-opacity']"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
          <b-field :label="$t('label.circleradius')" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.circle-radius']"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
          <b-field :label="$t('label.circlestrokewidth')" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.circle-stroke-width']"></b-input>
          </b-field>
        </ValidationProvider>
        <div class="columns">
          <div class="column">
            <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
              <b-field :label="$t('label.circlestrokecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="commonMetaFlat['tileInfo.style.paint.circle-stroke-color']"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">&nbsp;</template>
              <div class="input-color-container" style="margin-left: 12px;">
                <ValidationProvider>
                  <input v-model="commonMetaFlat['tileInfo.style.paint.circle-stroke-color']" class="input-color" type="color" />
                </ValidationProvider>
              </div>
            </b-field>
          </div>
        </div>
      </div>
      <div v-if="commonMetaFlat['tileInfo.style.type'] === 'fill'">
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
          <div class="columns">
            <div class="column">
              <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                <b-field :label="$t('label.fillcolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input v-model="commonMetaFlat['tileInfo.style.paint.fill-color']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <b-field>
                <template slot="label">&nbsp;</template>
                <div class="input-color-container" style="margin-left: 12px;">
                  <ValidationProvider>
                    <input v-model="commonMetaFlat['tileInfo.style.paint.fill-color']" class="input-color" type="color" />
                  </ValidationProvider>
                </div>
              </b-field>
            </div>
          </div>
        </div>
        <div v-if="colorMethod === 'ramp'">
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.drivingattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="commonMetaFlat['tileInfo.style.paint.fill-color.2.1']"></b-input>
            </b-field>
          </ValidationProvider>
          <b-field>
            <div class="columns">
              <div class="column">
                <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.lowvalue')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.fill-color.3']"></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div class="column">
                <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.color')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input maxlength="7" v-model="commonMetaFlat['tileInfo.style.paint.fill-color.4']"></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div class="column">
                <b-field>
                  <template slot="label">&nbsp;</template>
                  <div class="input-color-container" style="margin-left: 12px;">
                    <ValidationProvider>
                      <input v-model="commonMetaFlat['tileInfo.style.paint.fill-color.4']" class="input-color" type="color" />
                    </ValidationProvider>
                  </div>
                </b-field>
              </div>
            </div>
          </b-field>
          <b-field>
            <div class="columns">
              <div class="column">
                <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.highvalue')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.fill-color.5']"></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div class="column">
                <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.color')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input maxlength="7" v-model="commonMetaFlat['tileInfo.style.paint.fill-color.6']"></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div class="column">
                <b-field>
                  <template slot="label">&nbsp;</template>
                  <div class="input-color-container" style="margin-left: 12px;">
                    <ValidationProvider>
                      <input v-model="commonMetaFlat['tileInfo.style.paint.fill-color.6']" class="input-color" type="color" />
                    </ValidationProvider>
                  </div>
                </b-field>
              </div>
            </div>
          </b-field>
        </div>
        <div v-if="colorMethod === 'categorical'">
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.drivingattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="commonMetaFlat['tileInfo.style.paint.fill-color.property']"></b-input>
            </b-field>
          </ValidationProvider>
          <div class="columns">
            <div class="column">
              <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                <b-field :label="$t('label.defaultcolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input v-model="commonMetaFlat['tileInfo.style.paint.fill-color.default']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <b-field>
                <template slot="label">&nbsp;</template>
                <div class="input-color-container" style="margin-left: 12px;">
                  <ValidationProvider>
                    <input v-model="commonMetaFlat['tileInfo.style.paint.fill-color.default']" class="input-color" type="color" />
                  </ValidationProvider>
                </div>
              </b-field>
            </div>
          </div>
          <label class="label">
            {{$t('label.categoryassignment')}} <a @click="addTablePair('tileInfo.style.paint.fill-color.stops.')"><font-awesome size="lg" :icon="['far', 'plus-square']"/></a>
          </label>
          <br>
          <div v-for="(key, index) in Object.keys(commonMetaFlat).filter(k => k.includes('tileInfo.style.paint.fill-color.stops.'))">
            <div v-if="(index%2 == 0)" class="columns">
              <div class="column is-narrow"><a @click="removeTablePair(key,'tileInfo.style.paint.fill-color.stops.')"><font-awesome size="lg" :icon="['far', 'minus-square']"/></a></div>
              <div class="column">
                <ValidationProvider rules="required" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.category')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input expanded v-model.number="commonMetaFlat[key]"></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div class="column">
                <div class="columns">
                  <div class="column">
                    <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                      <b-field :label="$t('label.color')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                        <b-input maxlength="7" expanded v-model="commonMetaFlat[key.slice(0, -1) + '1']"></b-input>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column">
                    <div class="input-color-container" style="margin-left: 12px;">
                      <ValidationProvider>
                        <input v-model="commonMetaFlat[key.slice(0, -1) + '1']" class="input-color" type="color" />
                      </ValidationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
          <b-field :label="$t('label.fillopacity')" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-input type="number" step="any" v-model.number="commonMetaFlat['tileInfo.style.paint.fill-opacity']"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider>
          <b-field class="field">
            <template slot="label">&nbsp;</template>
            <b-checkbox v-model="addFillOutline"><b>{{$t('label.addfilloutline')}}</b></b-checkbox>
          </b-field>
        </ValidationProvider>
        <div v-if="addFillOutline" class="columns">
          <div class="column">
            <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
              <b-field :label="$t('label.filloutlinecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="commonMetaFlat['tileInfo.style.paint.fill-outline-color']"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">&nbsp;</template>
              <div class="input-color-container" style="margin-left: 12px;">
                <ValidationProvider>
                  <input v-model="commonMetaFlat['tileInfo.style.paint.fill-outline-color']" class="input-color" type="color" />
                </ValidationProvider>
              </div>
            </b-field>
          </div>
        </div>
      </div>
    </div>
    <div v-if="commonMetaFlat['tileInfo.type'] === 'raster'">
      <div class="columns">
        <div class="column is-narrow">
          <label class="label">
            {{$t('label.colortable')}} <a @click="addTablePair('tileInfo.colorTable.')"><font-awesome size="lg" :icon="['far', 'plus-square']"/></a>
          </label>
        </div>
        <div class="column is-narrow">
          <ValidationProvider>
            <b-field class="field">
              <b-checkbox v-model="commonMetaFlat['tileInfo.gradient']">{{$t('label.gradient')}}</b-checkbox>
            </b-field>
          </ValidationProvider>
        </div>
        <div class="column">
          <ValidationProvider>
            <b-field class="field">
              <b-checkbox v-model="commonMetaFlat['tileInfo.hideNoData']">{{$t('label.hidenodata')}}</b-checkbox>
            </b-field>
          </ValidationProvider>
        </div>
      </div>
      <div v-for="(key, index) in Object.keys(commonMetaFlat).filter(k => k.includes('tileInfo.colorTable.'))">
        <div v-if="(index%2 == 0)" class="columns">
          <div class="column is-narrow"><a @click="removeTablePair(key,'tileInfo.colorTable.', index/2)"><font-awesome size="lg" :icon="['far', 'minus-square']"/></a></div>
          <div class="column is-2">
            <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
              <b-field :label="$t('label.value')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input type="number" expanded v-model.number="commonMetaFlat[key]"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column">
            <ValidationProvider v-slot="{ errors, valid }">
              <b-field :label="$t('label.label')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="commonMetaFlat['tileLabels.' + index/2]"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column is-2">
            <ValidationProvider rules="required|colorhexa" v-slot="{ errors, valid }">
              <b-field :label="$t('label.color')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input maxlength="9" expanded v-model="commonMetaFlat[key.slice(0, -1) + '1']"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column">
            <div class="columns">
              <div class="column is-narrow input-color-container" style="margin-left: 12px;">
                <ValidationProvider>
                  <input @input="inputColor($event, key.slice(0, -1) + '1')" :value="narrowColorValue(commonMetaFlat[key.slice(0, -1) + '1'])" class="input-color" type="color" id="html5colorpicker" />
                </ValidationProvider>
              </div>
              <div class="column">
                <ValidationProvider>
                  <b-tooltip always type="is-light" :label="getOpacity(commonMetaFlat[key.slice(0, -1) + '1']) + '%'" position="is-right">
                    <input lazy type="range" min="0" max="100" expanded @input="inputOpacity($event, key.slice(0, -1) + '1')" :value="getOpacity(commonMetaFlat[key.slice(0, -1) + '1'])"></input>
                  </b-tooltip>
                </ValidationProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .input-color-container {
    margin: auto;
    position: relative;
    overflow: hidden;
    width: 40px;
    height: 30px;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
  }

  .input-color {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 60px;
    height: 56px;
    border: none;
    cursor: pointer;
  }

  ::v-deep .b-tooltip .tooltip-content {
    box-shadow: none;
  }

</style>

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
      //addFillOutline: false
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
    /*if (this.commonMetaFlat['tileInfo.style.paint.fill-outline-color']) {
      this.addFillOutline = true
    } */
  },
  methods: {
    inputColor(e, item) {
      if (this.commonMetaFlat[item].length === 9)
        this.commonMetaFlat[item] = e.target.value + this.commonMetaFlat[item].substr(7,2)
      else
        this.commonMetaFlat[item] = e.target.value + this.commonMetaFlat[item].substr(4,2)
    },
    getOpacity(v) {
      if (v.length === 9) return Math.round(parseInt(v.slice(7, 9), 16) * 100/255)
      if (v.length === 5) return Math.round(parseInt(v.slice(4, 5), 16) * 100/255)
    },
    inputOpacity(event, item) {
      let o = event.target.value
      let v = this.commonMetaFlat[item]
      let oh = Math.round(o*255/100).toString(16)
      if (v.length === 9) {
        this.commonMetaFlat[item] = v.substr(0,7) + oh.padStart(2, '0')
        return
      }
      if (v.length === 5 && oh.length === 1) {
        this.commonMetaFlat[item] = v.substr(0,4) + oh
        return
      }
      if (v.length === 5 && oh.length === 2) {
        this.commonMetaFlat[item] = '#0' + v.substr(1,1) + '0' + v.substr(2,1) + '0' + v.substr(3,1) + oh
      }
    },
    narrowColorValue(v) {
      if (v.length === 9)
        return v.substr(0,7)
      else
        return '#0' + v.substr(1,1) + '0' + v.substr(2,1) + '0' + v.substr(3,1)
    },
    addTablePair(tablePrefix) {
      let nCats = Object.keys(this.commonMetaFlat).filter(k => k.includes(tablePrefix)).length/2
      this.$set(this.commonMetaFlat, tablePrefix + nCats + '.0', '')
      this.$set(this.commonMetaFlat, tablePrefix + nCats + '.1', '#00000000')
    },
    removeTablePair(cKey, tablePrefix, idx) {
      // First, delete item
      this.$delete(this.commonMetaFlat, cKey)
      this.$delete(this.commonMetaFlat, cKey.slice(0, -1) + '1')

      // Then compact the list
      let keys = Object.keys(this.commonMetaFlat).filter(k => k.includes(tablePrefix))
      let i = 0
      keys.forEach((key) => {
        let stop = Math.floor((i++)/2)
        let prefix = key.slice(0, -1)
        let sufix = key.substr(key.length -1)
        if (tablePrefix + stop + '.' != prefix) {
          this.$set(this.commonMetaFlat, tablePrefix + stop + '.' + sufix, this.commonMetaFlat[prefix + sufix])
          this.$delete(this.commonMetaFlat, prefix + sufix)
        }
      })

      // Finally, remove associated tileLabels entry
      if (idx != undefined) {
        this.$delete(this.commonMetaFlat, 'tileLabels.' + idx)

        // And compact the list
        keys = Object.keys(this.commonMetaFlat).filter(k => k.includes('tileLabels'))
        keys.forEach((key, i) => {
          let sufix = key.split('.').pop()
          if (i != sufix) {
            this.$set(this.commonMetaFlat, 'tileLabels.' + i, this.commonMetaFlat[key])
            this.$delete(this.commonMetaFlat, key)
          }
        })
      }
    },
    cleanMeta(value) {
      Object.keys(this.commonMetaFlat).forEach(key => {
        if (key.startsWith('tileInfo.') && key !== 'tileInfo.type') {
          this.$delete(this.commonMetaFlat, key)
        }
      })
    }
  },
  computed: {
    colorMethod: {
      get() {
        if (this.commonMetaFlat['tileInfo.style.paint.fill-color.0']) return 'ramp'
        if (this.commonMetaFlat['tileInfo.style.paint.fill-color.type']) return 'categorical'
        return 'simple'
      },
      set(val) {
        Object.keys(this.commonMetaFlat).filter(k => k.includes('tileInfo.style.paint.fill-color')).forEach(match => {
          this.$delete(this.commonMetaFlat, match)
        })
        if (val === 'ramp') {
          this.$set(this.commonMetaFlat, 'tileInfo.style.paint.fill-color.0', 'interpolate')
          this.$set(this.commonMetaFlat, 'tileInfo.style.paint.fill-color.1.0', 'linear')
          this.$set(this.commonMetaFlat, 'tileInfo.style.paint.fill-color.2.0', 'get')
          return
        }
        if (val === 'categorical') {
          this.$set(this.commonMetaFlat, 'tileInfo.style.paint.fill-color.type', 'categorical')
          return
        }
        this.$set(this.commonMetaFlat, 'tileInfo.style.paint.fill-color', '')
      }
    },
    addFillOutline: {
      get() {
        return (this.commonMetaFlat['tileInfo.style.paint.fill-outline-color'] !== undefined) ? true : false
      },
      set(val) {
        if (val) this.$set(this.commonMetaFlat, 'tileInfo.style.paint.fill-outline-color', '')
        else this.$delete(this.commonMetaFlat, 'tileInfo.style.paint.fill-outline-color')
      }
    }
  }
}
</script>

<template>
  <div class="card">
    <div style="position: sticky; top: 0; z-index: 45; background-color: white; padding: 12px;" class="card-header">
      <p class="card-header-title is-size-4">
        {{metaEntryFlat['name.' + $i18n.locale.substr(0, 2)]}}
      </p>
      <div class="buttons">
        <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;Cancelar</b-button>
        <b-button @click="acceptChanges()" :disabled="!isDirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;Aceptar</b-button>
      </div>
    </div>
    <div class="card-content">
      <div class="content" @change="isDirty=true">
        <b-field :label="$t('label.titlespanish')">
          <b-input v-model="metaEntryFlat['name.es']"></b-input>
        </b-field>
        <b-field :label="$t('label.titleenglish')">
          <b-input v-model="metaEntryFlat['name.en']"></b-input>
        </b-field>
        <b-field :label="$t('label.file')">
          <b-input v-model="metaEntryFlat['file']"></b-input>
        </b-field>
        <b-field :label="$t('label.date')+ ' (UTC)'">
          <b-input v-model="metaEntryFlat['date']"></b-input>
        </b-field>
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
              </b-select>
            </b-field>
            <div v-if="colorMethod === 'simple'">
              <b-field :label="$t('label.fillcolor')">
                <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color']"></b-input>
              </b-field>
            </div>
            <div v-else>
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
  </div>
</template>

<script>
let flatten = require('flat')
let unflatten = require('flat').unflatten

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
    }
  },
  computed: {
    colorMethod: {
      get() {
        return this.metaEntryFlat['tileInfo.style.paint.fill-color.0'] ? 'ramp' : 'simple'
      },
      set(val) {
        if (val === 'ramp') {
          this.$delete(this.metaEntryFlat, 'tileInfo.style.paint.fill-color')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.0', 'interpolate')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.1.0', 'linear')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.2.0', 'get')
        } else {
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color', '')
          this.$delete(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.0')
          this.$delete(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.1.0')
          this.$delete(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.2.0')
        }
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

<template>
  <div class="card">
    <div class="card-header has-text-centered">
      <p class="card-header-title title" style="display: inline-block;">
        {{metaEntry.name[$i18n.locale.substr(0, 2)]}}
      </p>
    </div>
    <div class="card-content">
      <div class="content">
        <b-field :label="$t('label.titlespanish')">
          <b-input v-model="metaEntry.name.es"></b-input>
        </b-field>
        <b-field :label="$t('label.titleenglish')">
          <b-input v-model="metaEntry.name.en"></b-input>
        </b-field>
        <b-field :label="$t('label.file')">
          <b-input v-model="metaEntry.file"></b-input>
        </b-field>
        <b-field :label="$t('label.date')+ ' (UTC)'">
          <b-input v-model="metaEntry.date"></b-input>
        </b-field>
        <b-field :label="$t('label.tagsspanish')">
          <b-taginput v-model="metaEntry.keywords.es" placeholder="Add a tag"></b-taginput>
        </b-field>
        <b-field :label="$t('label.tagsenglish')">
          <b-taginput v-model="metaEntry.keywords.en" placeholder="Add a tag"></b-taginput>
        </b-field>
        <b-field :label="$t('label.descriptionspanish')">
          <b-input v-model="metaEntry.description.es" type="textarea"></b-input>
        </b-field>
        <b-field :label="$t('label.descriptionenglish')">
          <b-input v-model="metaEntry.description.en" type="textarea"></b-input>
        </b-field>
        <br>
        <p class="is-size-5 has-text-weight-bold">{{$t('label.tiledisplay')}}</p>
        <b-field :label="$t('label.tiletype')">
          <b-select v-model="metaEntry.tileInfo.type">
            <option value="raster">{{$t('label.raster')}}</option>
            <option value="vector">{{$t('label.vector')}}</option>
          </b-select>
        </b-field>
        <div v-if="metaEntry.tileInfo.type === 'vector'">
          <b-field :label="$t('label.mapdisplayattribute')">
            <b-input v-model="metaEntry.tileInfo.displayAttribute"></b-input>
          </b-field>
          <b-field :label="$t('label.geometry')">
            <b-select v-model="metaEntry.tileInfo.style.type">
              <option value="fill">{{$t('label.polygon')}}</option>
              <option value="line">{{$t('label.line')}}</option>
            </b-select>
          </b-field>
          <div v-if="metaEntry.tileInfo.style.type === 'line'">
            <b-field :label="$t('label.linecolor')">
              <b-input v-model="metaEntry.tileInfo.style.paint['line-color']"></b-input>
            </b-field>
            <b-field :label="$t('label.linewidth')">
              <b-input v-model="metaEntry.tileInfo.style.paint['line-width']"></b-input>
            </b-field>
          </div>
          <div v-else>
            <b-field :label="$t('label.fillcolor')">
              <b-input v-model="metaEntry.tileInfo.style.paint['fill-color']"></b-input>
            </b-field>
            <b-field :label="$t('label.fillopacity')">
              <b-input v-model="metaEntry.tileInfo.style.paint['fill-opacity']"></b-input>
            </b-field>
            <b-field :label="$t('label.filloutlinecolor')">
              <b-input v-model="metaEntry.tileInfo.style.paint['fill-outline-color']"></b-input>
            </b-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetaEntryEditor',
  props: {
    metaEntry: { type: Object, required: true }
  },
  data() {
    return {
    }
  }
}

</script>

<template>

  <div class="card">
    <div class="card-header">
      <p class="card-header-title is-size-5">
        {{ $t('label.tilesfor') }}: {{ metaData.name[$i18n.locale.substr(0, 2)] }}
      </p>
    </div>
    <div class="card-content">
      <div class="columns">
        <div class="column is-one-fifth has-text-weight-bold">
          {{ $t('label.tiletype') }}:
        </div>
        <div class="column">
          {{$t('label.' + metaData.tileInfo.type)}}
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth has-text-weight-bold">
          {{ $t('label.tilescheme') }}:
        </div>
        <div class="column">
          <a title="Copiar" class="copy-tile-scheme-to-clipboard" :data-clipboard-text="tileScheme">
            <font-awesome :icon="['far', 'copy']"/>
          </a>
          {{tileScheme}}
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth has-text-weight-bold">
          {{ $t('label.attribution') }}:
        </div>
        <div class="column">
          {{metaData.source}}
        </div>
      </div>
    </div>
  </div>

</template>


<script>
  import {mapConfig} from '~/utils/config'
  import ClipboardJS from 'clipboard'
  let clipboard

  export default {
    name: 'TilesInfo',
    props: {
      metaData: { type: Object, required: true }
    },
    mounted() {
      clipboard = new ClipboardJS('.copy-tile-scheme-to-clipboard')
    },
    beforeDestroy() {
      clipboard.destroy()
    },
    computed: {
      tileScheme() {
        let baseUrl = this.metaData.tileInfo.type === 'vector' ? mapConfig.vectorTilesBaseUrl : mapConfig.rasterTilesBaseUrl
        let urlSuffix = this.metaData.tileInfo.type === 'vector' ? '/{z}/{x}/{y}.pbf' : '/{z}/{x}/{y}.png'
        return baseUrl + this.metaData.tiles + urlSuffix
      }
    }
  }

</script>

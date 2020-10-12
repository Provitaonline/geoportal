<template>
  <div class="legend" v-if="showLegend">
    <span class="menu-label">LEYENDA</span>
    <div class="columns is-multiline">
      <div v-for="item, index in layerMeta" class="column is-one-third" v-if="showLayerLegend(index)">
        <div class="legend-box">
          <div class="legend-item" v-if="isSingleColor(index)">
            <div class="legend-color-box" :style="'background:' + getColor(index)"></div>
            <span class="legend-title">{{item.name[$i18n.locale.substr(0, 2)]}}</span>
          </div>
          <div class="legend-item" v-else-if="isColorGradient(index)">
            <div class="legend-color-box" :style="'background-image: linear-gradient(to right,' + getColorGradient(index) + ');'"></div>
            <span class="legend-title">{{item.name[$i18n.locale.substr(0, 2)]}}</span>
          </div>
          <div v-else>
            <span class="legend-title">{{item.name[$i18n.locale.substr(0, 2)]}}</span>
            <div class="legend-item" v-for="legendItem in getColorList(index)">
              <div class="legend-color-box" :style="'background:' + legendItem[1]"></div>
              <span class="legend-subtitle">{{legendItem[0]}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .legend {
    border: 1px solid #626262;
    padding: 6px;
    margin-bottom: 4px;
  }

  .legend-box {
    display: flex;
    box-sizing: border-box;
    padding: 5px;
  }

  .legend-item {
    display: flex;
    padding: 4px;
  }

  .legend-color-box {
    height: 24px;
    width: 38px;
    display: inline-block;
  }

  .legend-title {
    padding-left: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    align-self: center;
  }

  .legend-subtitle {
    padding-left: 4px;
    font-size: 0.75rem;
    align-self: center;
  }

</style>

<script>
  export default {
    name: 'MapLegend',
    props: {
      layerMeta: { type: Array, required: true }
    },
    data() {
      return {
      }
    },
    methods: {
      showLayerLegend(index) {
        return this.layerMeta[index].layerShow
      },
      isSingleColor(index) {
        if (this.layerMeta[index].tileInfo.style) {
          if (typeof(this.layerMeta[index].tileInfo.style.paint['fill-color']) === 'string') return true
          if (typeof(this.layerMeta[index].tileInfo.style.paint['line-color']) === 'string') return true
        }
        return false
      },
      isColorGradient(index) {
        if (this.layerMeta[index].tileInfo.style) {
          if (this.layerMeta[index].tileInfo.style.paint['fill-color'][0] === 'interpolate') return true
        }
        return false
      },
      getColor(index) {
        if (this.layerMeta[index].tileInfo.style.paint['fill-color']) return this.layerMeta[index].tileInfo.style.paint['fill-color']
        if (this.layerMeta[index].tileInfo.style.paint['line-color']) return this.layerMeta[index].tileInfo.style.paint['line-color']
        return '#FFFFFF'
      },
      getColorList(index) {
        if (this.layerMeta[index].tileInfo.style &&
            this.layerMeta[index].tileInfo.style.paint &&
            this.layerMeta[index].tileInfo.style.paint['fill-color'] &&
            this.layerMeta[index].tileInfo.style.paint['fill-color'].stops) {
          return this.layerMeta[index].tileInfo.style.paint['fill-color'].stops
        } else {
          if (this.layerMeta[index].tileInfo.colorTable) {
            return this.layerMeta[index].tileInfo.colorTable.map(item => [this.$t('label.pixelvalue') + ': ' + item[0], item[1]])
          }
        }
        return []
      },
      getColorGradient(index) {
        if (this.layerMeta[index].tileInfo.style) {
          return this.layerMeta[index].tileInfo.style.paint['fill-color'][4] + ',' + this.layerMeta[index].tileInfo.style.paint['fill-color'][6]
        }
        return '#FFFFFF'
      }
    },
    computed: {
      showLegend() {
        return this.layerMeta.some(item => item.layerShow)
      }
    }
  }
</script>

<template>
  <div class="columns is-multiline">
    <div v-for="item, index in layerMeta" class="column is-one-third" v-if="showLegend(index)">
      <div class="legend-box">
        <div class="legend-item" v-if="isSingleColor(index)" :style="'background:' + getColor(index)">
        </div>
        {{item.name[$i18n.locale.substr(0, 2)]}}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .legend-box {
    display: flex;
    box-sizing: border-box;
    margin-bottom: 6px;
  }

  .legend-symbol {
    box-sizing: border-box;
    padding-right: 10px;
    padding-top: 2px;
  }

  .legend-item {
    height: 24px;
    width: 38px;
    display: inline-block;
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
      showLegend(index) {
        return this.layerMeta[index].layerShow
      },
      isSingleColor(index) {
        //console.log(typeof(this.layerMeta[index].tileInfo.style.paint['fill-color']))
        if (this.layerMeta[index].tileInfo.style) {
          if (typeof(this.layerMeta[index].tileInfo.style.paint['fill-color']) === 'string') return true
          if (typeof(this.layerMeta[index].tileInfo.style.paint['line-color']) === 'string') return true
        }
        return false
      },
      getColor(index) {
        if (this.layerMeta[index].tileInfo.style.paint['fill-color']) return this.layerMeta[index].tileInfo.style.paint['fill-color']
        if (this.layerMeta[index].tileInfo.style.paint['line-color']) return this.layerMeta[index].tileInfo.style.paint['line-color']
        return '#FFFFFF'
      }
    }
  }
</script>

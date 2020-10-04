<template>
  <div class="columns">
    <div class="column">
      {{visibleTileLayers}}
    </div>
    <div class="column">
      Column 2
    </div>
    <div class="column">
      Column 3
    </div>
  </div>
</template>


<script>
  export default {
    name: 'MapLegend',
    props: {
      visibleTileLayers: { type: Object, required: true }
    },
    data() {
      return {
      }
    }
  }
</script>

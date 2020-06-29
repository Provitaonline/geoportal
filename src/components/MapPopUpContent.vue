<template>
  <div style="padding-top: 10px;">
    <div v-for="item in popUpItems">
      <div v-if="item.isHeading" class="popUpItemHeading"><b>{{item.itemText}}</b></div>
      <a v-else @click="displayPopUpModal(item)">{{item.itemText}}</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .popUpItemHeading {
    width: 100%;
    background-color: rgba(85, 107, 47, 0.1);
  }
</style>

<script>
  export default {
    name: 'InteractiveMap',
    props: {
      popUpItems: { type: Array, required: true }
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      displayPopUpModal(item) {
        this.$eventBus.$emit('showpopupmodal', item)
      }
    }
  }

</script>

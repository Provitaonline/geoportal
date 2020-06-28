<template>
  <div>
    <div v-for="item in popUpItems">
      <span v-if="item.isHeading" class="popUpItemHeading">{{item.itemText}}</span>
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

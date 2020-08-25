<template>
  <div class="container" style="max-width: 900px;">
    <div class="buttons" style="justify-content: center;">
      <b-button @click="" style="width: 160px;"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-button @click="" style="width: 160px;"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addnews')}}</b-button>
    </div>

  </div>
  </div>
</template>

<script>
  export default {
    name: 'AdminNewsTab',
    data() {
      return {
        listOfNewsItems: [],
        newsItemListCheckedRows: []
      }
    },
    mounted() {
      console.log('component mounted')
    }
  }
</script>

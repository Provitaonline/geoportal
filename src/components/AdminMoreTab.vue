<template>
  <div class="container" style="max-width: 900px;">
    <!-- <b-loading v-model="isLoading"></b-loading> -->
    <div style="display: flex; flex-direction: column; align-items: center">
  <!-- <div style="display: flex; flex-direction: column; align-items: center"> -->
      <b-button @click="editAbout()" class="more-button"><font-awesome :icon="['far', 'edit']"/>&nbsp;{{$t('label.editabout')}}</b-button>
      <b-button @click="editContact()" class="more-button"><font-awesome :icon="['far', 'edit']"/>&nbsp;{{$t('label.editcontact')}}</b-button>
      <b-button @click="downloadSurveyData()" class="more-button"><font-awesome :icon="['fas', 'download']"/>&nbsp;{{$t('label.downloadsurveydata')}}</b-button>
    </div>
  </div>

</template>

<style lang="scss" scoped>

  .more-button {
    width: 280px;
    margin: 5px;
    justify-content: flex-start;
  }

</style>

<script>
  import AboutEditor from '~/components/AboutEditor'
  import ContactEditor from '~/components/ContactEditor'
  import SurveyDataDownloader from '~/components/SurveyDataDownloader'
  import {getSurveyVersions} from '~/utils/data'

  export default {
    name: 'AdminMoreTab',
    data() {
      return {

      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      editAbout() {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: AboutEditor
        })
      },
      editContact() {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: ContactEditor
        })
      },
      downloadSurveyData() {
        this.$buefy.modal.open({
          parent: this,
          width: 450,
          canCancel: ['escape', 'x'],
          component: SurveyDataDownloader
        })
      }
    }
  }

</script>

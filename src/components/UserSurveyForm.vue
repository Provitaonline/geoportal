<template>
  <div class="card">
    <div style="padding: 12px;" class="card-header">
      <p class="card-header-title is-size-5">
        {{ $t('message.surveyheader') }}
      </p>
      <div class="buttons">
        <b-button @click="$parent.close(); downloadFile()" style="width: 160px; height: 50px;"><span v-html="$t('label.downloadonly')"></span></b-button>
      </div>
    </div>
    <div class="card-content">
      <div class="content">
        <div v-for="item in $static.userSurveyTemplate.fields">
          <b-field v-if="item.type === 'text'" :label="item.label[$i18n.locale.substr(0, 2)]">
            <b-input v-model="surveyData[item.fieldname]" maxlength="1000" type="textarea"></b-input>
          </b-field>
          <div v-if="item.type === 'select'">
            <label class="label">{{item.label[$i18n.locale.substr(0, 2)]}}</label>
            <div class="block">
              <b-radio v-model="surveyData[item.fieldname]" v-for="btn in item.options[$i18n.locale.substr(0, 2)]" v-bind:key="btn" :name="item.fieldname" :native-value="btn">{{btn}}</b-radio>
            </div>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
      <div class="buttons">
        <b-button @click="$parent.close(); downloadFile(true)" type="is-primary" style="width: 160px;"><span v-html="$t('label.sendanddownload')"></span></b-button>
      </div>
    </div>
  </div>
</template>

<static-query>
  query UserSurveyTemplate {
    userSurveyTemplate: userSurveyTemplate (id: "usersurvey") {
      version
      fields {
        fieldname
        type
        options {
          en
          es
        }
        label {
          en
          es
        }
      }
    }
  }
</static-query>

<script>
import {sendSurvey} from '~/utils/data'

export default {
  name: 'UserSurveyForm',
  props: {
    downloadFileIndex: { type: Number, required: true }
  },
  data() {
    return {
      surveyData: {}
    }
  },
  created() {
    this.$static.userSurveyTemplate.fields.forEach(item => {
      this.$set(this.surveyData, item.fieldname, '')
    })
  },
  methods: {
    downloadFile(withSurvey) {
      if (withSurvey) {
        console.log('Submit survey data')
        this.surveyData.version = this.$static.userSurveyTemplate.version
        this.surveyData.languageCode = this.$i18n.locale.substr(0, 2)
        sendSurvey(this.surveyData, this.$static.userSurveyTemplate.version)
      }
      document.getElementById('download-' + this.downloadFileIndex).click()
    }
  }
}

</script>

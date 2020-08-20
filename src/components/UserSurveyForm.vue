<template>
  <div class="card">
    <div style="position: sticky; top: 0; z-index: 45; background-color: white; padding: 12px;" class="card-header">
      <p class="card-header-title is-size-4">
        User survey
      </p>
      <div class="buttons">
        <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
        <b-button style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
      </div>
    </div>
    <div class="card-content">
      <div class="content">
        <div v-for="item in $static.userSurveyTemplate.fields">
          <b-field v-if="item.type === 'text'" :label="item.label[$i18n.locale.substr(0, 2)]">
            <b-input maxlength="1000" type="textarea"></b-input>
          </b-field>
          <div v-if="item.type === 'select'">
            <label class="label">{{item.label[$i18n.locale.substr(0, 2)]}}</label>
            <div class="block">
              <b-radio v-for="btn in item.options[$i18n.locale.substr(0, 2)]" v-bind:key="btn" :name="item.fieldname" :native-value="btn">{{btn}}</b-radio>
            </div>
          </div>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<static-query>
  query {
    userSurveyTemplate (id: "usersurvey") {
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
export default {
  name: 'UserSurveyForm'
}

</script>

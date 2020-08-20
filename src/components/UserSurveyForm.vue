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
        <label class="label">¿Cuanto te gusta este sitio?</label>
        <div class="block">
          <b-radio
              name="name"
              native-value="Flint">
              Mucho
          </b-radio>
          <b-radio
              name="name"
              native-value="Silver">
              Muchísimo
          </b-radio>
          <b-radio
              name="name"
              native-value="Jack">
              Más que muchísimo
          </b-radio>
        </div>
        <b-field label="Cómo lo mejorarías aun más?">
          <b-input maxlength="1000" type="textarea"></b-input>
        </b-field>
      </div>
    </div>
  </div>
</template>

<static-query>
  query {
    userSurveyTemplate (id: "usersurvey") {
			fields
    }
  }
</static-query>

<script>
export default {
  name: 'UserSurveyForm'
}

</script>

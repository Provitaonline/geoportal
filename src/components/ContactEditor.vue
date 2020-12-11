<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty, pristine, failed}">
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          {{$t('label.contact')}}
        </p>
      </div>
      <div v-if="contact" class="card-content">
        <div class="content">
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.organization')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.organization"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.name') + '(1)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.addressname"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.address') + '(1)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.address" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.name') + '(2)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.address2name"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.address') + '(2)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.address2" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="email" v-slot="{ errors, valid }">
            <b-field :label="$t('label.email')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.email"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.phone')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.phone"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="url" v-slot="{ errors, valid }">
            <b-field :label="$t('label.web')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="contact.web"></b-input>
            </b-field>
          </ValidationProvider>
        </div>
      </div>

      <div class="card-footer" style="padding: 24px; justify-content: flex-end;">
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(saveChanges)" :disabled="failed || pristine" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>

    </ValidationObserver>
  </div>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import * as validation from '~/utils/validation'
  import {getContactFromRepo, saveContact} from '~/utils/data'

  export default {
    name: 'ContactEditor',
    props: {
    },
    data() {
      return {
        isLoading: true,
        contact: null
      }
    },
    components: {
      ValidationObserver,
      ValidationProvider
    },
    beforeCreate() {
      validation.localize(this.$i18n.locale.toString().substr(0,2))
    },
    created() {
      console.log('get contact')
      this.getContact()
    },
    methods: {
      getContact() {
        if (!this.about) {
          getContactFromRepo(sessionStorage.githubtoken).then((result) => {
            this.contact = result
            this.isLoading = false
          })
        }
      },
      saveChanges() {
        this.isLoading = true
        saveContact(sessionStorage.githubtoken, JSON.parse(JSON.stringify(this.contact))).then((response) => {
          console.log('saved Contact')
          this.isLoading = false
          this.contact.sha = response.data.content.sha
          this.$store.commit('setPublishIndicator', true)
          this.$parent.close()
        }).catch((e) => {
          console.log('error saving Contact to github ', e)
        })
      }
    }
  }
</script>

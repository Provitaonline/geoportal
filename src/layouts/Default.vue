<template>
  <div>
    <b-navbar class="is-fixed-top">
        <template slot="brand">
            <b-navbar-item>
              <g-link :to="$tp('/')">LOGO</g-link>
            </b-navbar-item>
        </template>
        <template slot="end">
            <b-navbar-item href="#">
                Home
            </b-navbar-item>
            <b-navbar-item href="#">
                Documentation
            </b-navbar-item>
            <b-navbar-dropdown label="Info">
              <b-navbar-item href="#">
                  About
              </b-navbar-item>
              <b-navbar-item href="#">
                  Contact
              </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-dropdown>
              <template slot="label">
                {{ $t('language') }}
              </template>
              <ClientOnly>
                <b-navbar-item v-for="locale in $i18n.availableLocales" :key="locale">
                  <a @click="changeLocale(locale)">
                    {{ $t('language', locale) }}
                  </a>
                </b-navbar-item>
              </ClientOnly>
            </b-navbar-dropdown>
            <b-navbar-item tag="div">
              <a @click="userLogin" class="button is-light">
                  <font-awesome :icon="['far', 'user']"/>
              </a>
            </b-navbar-item>
        </template>
    </b-navbar>
    <div class="layout">
      <slot />
    </div>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.button {
  border-radius: 50%;
  padding-left: .70em;
  padding-right: .70em;
}

</style>

<script>
import {getStateToken} from '~/utils/user'

export default {
  data() {
    return {
    }
  },
  methods: {
    changeLocale: function (locale) {
      if (this.$i18n.locale.toString() != locale) {
        this.$router.push({
          path: this.$tp(this.$route.path, locale, true)
        })
      }
    },
    userLogin: function() {
      sessionStorage.stateToken = this.$i18n.locale.toString().substr(0,2) + getStateToken()
      window.location.href = '/.netlify/functions/auth-start?state=' + sessionStorage.stateToken
    }
  }
}

</script>

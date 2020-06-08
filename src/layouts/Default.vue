<template>
  <div>
    <b-navbar class="is-fixed-top">
        <template slot="brand">
            <b-navbar-item>
              <g-link :to="$tp('/')">LOGO</g-link>
            </b-navbar-item>
        </template>
        <template slot="end">
            <b-navbar-item tag="div">
              <g-link :to="$tp('/about')">
                {{ $t('label.about') }}
              </g-link>
            </b-navbar-item>
            <b-navbar-item tag="div">
              <g-link :to="$tp('/contact')">
                {{ $t('label.contact') }}
              </g-link>
            </b-navbar-item>
            <b-navbar-dropdown arrowless right>
              <template slot="label">
                {{ $t('flag') }}
              </template>
              <ClientOnly>
                <b-navbar-item v-for="locale in availableLocales" :key="locale">
                  <a @click="changeLocale(locale)">
                    {{ $t('flag', locale) }}&nbsp&nbsp&nbsp{{ $t('language', locale) }}
                  </a>
                </b-navbar-item>
              </ClientOnly>
            </b-navbar-dropdown>
            <b-navbar-item v-if="isAdminPage" tag="div">
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

<style lang="scss">
  .layout {
    max-width: 760px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>

<style lang="scss" scoped>
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
      availableLocales: this.$i18n.availableLocales,
      isAdminPage: this.$route.path.includes('/admin')
    }
  },
  mounted() {
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

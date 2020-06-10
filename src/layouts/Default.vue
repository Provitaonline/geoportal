<template>
  <div>
    <b-navbar class="is-fixed-top container is-widescreen">
        <template slot="brand">
          <b-navbar-item class="logo">
            <g-link :to="$tp('/')">
              <g-image style="max-height: 61px;" src="~/assets/images/logo.png" alt="Logo" />
            </g-link>
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
          <b-navbar-dropdown v-if="!is404Page" arrowless right>
            <template slot="label">
              {{ $t('flag') }}
            </template>
            <ClientOnly>
              <b-navbar-item v-for="locale in availableLocales" :key="locale">
                <a @click="changeLocale(locale)">
                  {{ $t('flag', locale) }}&nbsp;&nbsp;&nbsp;{{ $t('language', locale) }}
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
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <slot name="banner" />
        </div>
      </div>
    </section>
    <section class="layout">
      <slot />
    </section>
    <section>
      <footer class="footer">
        <div class="has-text-centered">
          <div>
            <!--<div class="social">
              &nbsp;
              <g-link to="https://www.instagram.com/provita_ong/"><font-awesome size="lg" :icon="['fab', 'instagram']"/></g-link>&nbsp;&nbsp;
              <g-link to="https://www.facebook.com/ProvitaONG/"><font-awesome size="lg" :icon="['fab', 'facebook-f']"/></g-link>&nbsp;&nbsp;
              <g-link to="https://twitter.com/provita_ong"><font-awesome size="lg" :icon="['fab', 'twitter']"/></g-link>
              &nbsp;
            </div> -->
            <span> Derechos reservados, copyright © 2020 Provita</span>
            <span>, licencia </span>
            <g-link href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</g-link>
            <span>. | Versión Prototipo 0.0.1</span>
          </div>
        </div>
      </footer>
    </section>
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
    max-width: 900px;
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

  .logo {
    padding-top: 0px;
    padding-bottom: 0px;
    height: 4rem;
  }

  .hero {
    background-color: rgba(85,107,47, 0.1)
  }

</style>

<script>
import {getStateToken} from '~/utils/user'

export default {
  data() {
    return {
      availableLocales: this.$i18n.availableLocales,
      isAdminPage: this.$route.path.includes('/admin'),
      is404Page: this.$route.name === '*'
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

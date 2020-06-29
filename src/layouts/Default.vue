<template>
  <div>
    <b-navbar :fixed-top="true">
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
          <a @click="userLogin" class="login-button button is-light">
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
    <section>
      <slot />
    </section>
    <section>
      <footer class="footer">
        <div class="has-text-centered">
          <div>
            <div class="social">
              &nbsp;
              <g-link to="https://www.instagram.com/provita_ong/"><font-awesome size="lg" :icon="['fab', 'instagram']"/></g-link>&nbsp;&nbsp;
              <g-link to="https://www.facebook.com/ProvitaONG/"><font-awesome size="lg" :icon="['fab', 'facebook-f']"/></g-link>&nbsp;&nbsp;
              <g-link to="https://twitter.com/provita_ong"><font-awesome size="lg" :icon="['fab', 'twitter']"/></g-link>
              &nbsp;
            </div>
            <span> {{$t('label.copyright')}} </span>
            <g-link href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</g-link>
            <span>. | {{$t('label.version')}} {{version}}</span>
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

</style>

<style lang="scss" scoped>
  .login-button {
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

  @media only screen and (min-width: 1024px) {
    .social {
      display: inline-block;
    }
  }

</style>

<script>
import {version} from '../../package.json'
import {getStateToken} from '~/utils/user'

export default {
  data() {
    return {
      version: version,
      availableLocales: this.$i18n.availableLocales,
      isAdminPage: this.$route.path.includes('/admin'),
      is404Page: this.$route.name === '*'
    }
  },
  mounted() {
    // WORKAROUND: For some reason, Gridsome is generating a double burger menu, here we remove one of them
    let burgerElements = document.getElementsByClassName('navbar-burger')
    if (burgerElements.length > 1) {
      burgerElements[1].remove()
    }
  },
  methods: {
    changeLocale: function (locale) {
      if (this.$i18n.locale.toString() != locale) {
        this.$router.push({
          path: this.$tp(this.$route.path, locale, true)
        })
        this.$eventBus.$emit('localechanged', locale)
      }
    },
    userLogin: function() {
      sessionStorage.stateToken = this.$i18n.locale.toString().substr(0,2) + getStateToken()
      window.location.href = '/.netlify/functions/auth-start?state=' + sessionStorage.stateToken
    }
  }
}

</script>

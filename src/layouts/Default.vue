<template>
  <div>
    <b-navbar :fixed-top="true">
      <template slot="brand">
        <b-navbar-item class="logo" style="background-color: white;">
          <g-link style="margin: auto; max-height: 64px;" :to="$tp('/')">
            <g-image style="max-height: 64px;" src="~/assets/svgs/logo.svg" alt="Logo" />
          </g-link>
        </b-navbar-item>
      </template>
      <template slot="end">
        <ClientOnly>
          <b-navbar-item v-if="isAdminEnabled()" tag="g-link" :to="$tp('/admin')">
            {{ $t('label.adminabr') }}
          </b-navbar-item>
        </ClientOnly>
        <b-navbar-item tag="g-link" :to="$tp('/about')">
          {{ $t('label.about') }}
        </b-navbar-item>
        <b-navbar-item tag="g-link" :to="$tp('/faq')">
          {{ $t('label.faq') }}
        </b-navbar-item>
        <b-navbar-item tag="g-link" :to="$tp('/news')">
          {{ $t('label.news') }}
        </b-navbar-item>
        <b-navbar-item tag="g-link" :to="$tp('/contact')">
          {{ $t('label.contact') }}
        </b-navbar-item>
        <b-navbar-dropdown v-if="!is404Page" arrowless right>
          <template slot="label">
            {{ $t('flag') }}
          </template>
          <b-navbar-item v-for="locale in availableLocales" :key="locale" tag="div" @click.capture="changeLocale(locale)">
            <g-link :to="localeLink(locale)">{{ $t('flag', locale) }}&nbsp;&nbsp;&nbsp;{{ $t('language', locale) }}</g-link>
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item v-if="isAdminPage" tag="div">
          <ClientOnly>
            <a v-if="$store.state.avatar" @click="showLoginInfo = true">
              <figure v-if="$store.state.avatar" class="image is-24x24">
                <img class="is-rounded" :src="$store.state.avatar">
              </figure>
            </a>
            <a v-else @click="showLoginInfo = true" class="login-button button is-light">
              <span><font-awesome :icon="['far', 'user']"/></span>
            </a>
          </ClientOnly>
        </b-navbar-item>
      </template>
    </b-navbar>
    <section v-if="hasBanner" class="hero">
      <g-image v-if="bannerImage" class="hero-bg-img" :src="bannerImage" />
      <div v-if="bannerImage" class="hero-body-outer">
        <div class="hero-body-container">
          <div class="hero-body-with-image title is-size-2">
            <slot name="banner" />
          </div>
        </div>
      </div>
      <div v-else class="hero-body">
        <div class="container">
          <slot name="banner" />
        </div>
      </div>
    </section>
    <b-modal :active.sync="showLoginInfo" :width="400" scroll="keep">
      <div class="card">
        <div class="card-header has-text-centered">
          <p class="card-header-title" style="display: inline-block;">
            {{$t('message.connected')}}
          </p>
        </div>
        <div class="card-content has-text-centered">
          <figure v-if="$store.state.avatar" class="image is-48x48" style="margin: auto;">
            <img class="is-rounded" :src="$store.state.avatar">
          </figure>
          <br>
          <b>{{$t('label.login')}}:</b> {{$store.state.login}}<br>
          <b>{{$t('label.name')}}:</b> {{$store.state.name}}<br><br>
          <a @click="userLogoff" class="button is-primary">
              {{$t('label.disconnect')}}
          </a>
        </div>
      </div>
    </b-modal>
    <transition name="fade" appear>
      <section>
        <slot />
      </section>
    </transition>
    <section>
      <footer class="footer">
        <div class="has-text-centered">
          <div class="footer-text">
            <div class="social">
              &nbsp;
              <g-link to="https://www.instagram.com/provita_ong/"><font-awesome size="lg" :icon="['fab', 'instagram']"/></g-link>&nbsp;&nbsp;
              <g-link to="https://www.facebook.com/ProvitaONG/"><font-awesome size="lg" :icon="['fab', 'facebook-f']"/></g-link>&nbsp;&nbsp;
              <g-link to="https://twitter.com/provita_ong"><font-awesome size="lg" :icon="['fab', 'twitter']"/></g-link>
              &nbsp;
            </div>
            <span> {{$t('label.copyright')}} </span>
            <g-link href="https://www.provita.org.ve/">Provita, </g-link>
            <span> {{$t('label.license')}} </span>
            <g-link href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</g-link>
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

  @import "~/assets/style/_variables";

  .login-button {
    border-radius: 50%;
    padding-left: .70em;
    padding-right: .70em;
  }

  .logo {
    padding-top: 0px;
    padding-bottom: 0px;
    height: 4rem;
    width: 320px;
  }

  @media only screen and (max-width: 375px) {
    .logo {
      width: 265px;
    }
  }

  .logo:hover {
    background-color: #F5F5F5 !important;
  }

  .hero {
    background-color: rgba(85,107,47, 0.1)
  }

  .footer-text {
    color: $white;
  }

  .footer-text a {
    color: $navbar-item-hover-color;
  }

  .footer-text a:hover{
    color: $black;
  }

  @media only screen and (min-width: 1024px) {
    .social {
      display: inline-block;
    }
  }

  .hero-body-outer {
    width: 100%;
  }

  .hero-body-container {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    justify-content: center;
    margin: 0 auto;
    margin-top: -300px;
    height: 300px;
  }

  .hero-body-with-image {
    flex-grow: 0;
    margin: auto;
    color: white;
  }

  .hero-body {
    margin: auto;
  }

  .hero-bg-img {
    height: 300px;
    width: 100%;
    object-fit: cover;
  }

</style>

<script>
import {version} from '../../package.json'

export default {
  props: {
    hasBanner: { type: Boolean, required: false, default: true },
    bannerText: { type: String },
    bannerImage: {type: Object }
  },
  data() {
    return {
      version: version,
      availableLocales: this.$i18n.availableLocales,
      isAdminPage: this.$route.path.includes('/admin'),
      is404Page: this.$route.name === '*',
      showLoginInfo: false,
      userInfo: {}
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
    localeLink: function (locale) {
      return this.$tp(this.$route.path, locale, true)
    },
    changeLocale: function (locale) {
      if (this.$i18n.locale.toString() != locale) {
        this.$eventBus.$emit('localechanged', locale)
      }
    },
    userLogoff: function () {
      this.$eventBus.$emit('userlogoff')
      this.showLoginInfo = false
    },
    isAdminEnabled: function() {
      return process.isClient ? sessionStorage.userInfo != undefined : false
    }
  }
}

</script>

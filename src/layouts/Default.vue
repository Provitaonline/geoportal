<template>
  <div>
    <b-navbar class="is-fixed-top">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
              LOGO
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
import axios from 'axios'
import {getStateToken} from '~/utils/user'

export default {
  methods: {
    userLogin: function() {
      sessionStorage.stateToken = getStateToken()
      window.location.href = '/.netlify/functions/auth-start?state=' + sessionStorage.stateToken
    }
  }
}

</script>

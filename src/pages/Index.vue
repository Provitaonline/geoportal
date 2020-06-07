<template>
  <Layout>

    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
    <g-image alt="Example image" src="~/favicon.png" width="135" />

    <h1>{{ $i18n.locale }} {{ $t('message.hello') }}, world!</h1>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur excepturi labore tempore expedita, et iste tenetur suscipit explicabo! Dolores, aperiam non officia eos quod asperiores
    </p>

    <p class="home-links">
      <a href="https://gridsome.org/docs/" target="_blank" rel="noopener">Gridsome Docs</a>
      <a href="https://github.com/gridsome/gridsome" target="_blank" rel="noopener">GitHub</a>
    </p>

  </Layout>
</template>

<script>
import {getUserInfo} from '~/utils/user'
import * as data from '~/utils/data'

export default {
  metaInfo: {
    title: 'Geoportal Provita'
  },
  mounted () {
    //window.history.replaceState(null, null, window.location.pathname)
    console.log('tokens', this.$route.query.token, sessionStorage.stateToken)
    data.getMetaEntries().then((data) => {
      console.log(data)
    })
    if (this.$route.query.token) {
      if (this.$route.query.state === sessionStorage.stateToken) {
        sessionStorage.githubtoken = this.$route.query.token
        console.log('New login')

        getUserInfo(sessionStorage.githubtoken).then((info) => {
          console.log('User Info ', info.name, info.login)
        })

      } else {
        console.log('Hey, state mismatch')
      }
      this.$router.push('/' + sessionStorage.stateToken.substr(0,2)) // Clean the url, stay with selected locale
    }
  }
}
</script>

<style>
  .home-links a {
    margin-right: 1rem;
  }
</style>

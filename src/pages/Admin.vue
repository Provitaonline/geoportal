<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.admin') }}
      </h1>
    </template>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error doloremque omnis animi, eligendi magni a voluptatum, vitae, consequuntur rerum illum odit fugit assumenda rem dolores inventore iste reprehenderit maxime! Iusto.</p>
  </Layout>
</template>

<script>
import {getUserInfo} from '~/utils/user'
import * as data from '~/utils/data'

export default {
  metaInfo() {
    return {
      title: this.$t('label.admin')
    }
  },
  mounted () {
    console.log('META', this.metaInfo)
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
        }).catch((e) => {
          console.log(e)
        })
      } else {
        console.log('Hey, state mismatch')
      }
      this.$router.push('/' + sessionStorage.stateToken.substr(0,2) + '/admin') // Clean the url, stay with selected locale
    }
  }
}
</script>

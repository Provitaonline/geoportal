<template>
  <Layout :bannerImage="bannerImage">
    <template slot="banner">
      {{$t('label.contact')}}
    </template>
    <section class="section container">
      <div class="tile is-ancestor">
        <div class="tile ">
          <div class="tile is-parent" style="flex-direction: column;">
            <g-image src="~/assets/svgs/location.svg"/>
            <h1 class="is-size-3">{{$page.contactData.organization}}</h1>
            <p v-html="$page.contactData.address"></p>
          </div>
          <div class="tile is-parent" style="flex-direction: column;">
            <g-image src="~/assets/svgs/phone.svg"/>
            <h1 class="is-size-3">{{ $t('label.phone') }}</h1>
            <p v-html="$page.contactData.phone"></p><br>
         </div>
          <div class="tile is-parent" style="flex-direction: column;">
            <g-image src="~/assets/svgs/mail.svg"/>
            <h1 class="is-size-3">Mail</h1>
            <p><a target="_blank" :href="'mailto:' + $page.contactData.email">{{$page.contactData.email}}</a></p><br>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<page-query>
  query Contact {
    contactData: contactData (id: "contact") {
      organization
      address
      phone
      email
      web
    }
  }
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$t('label.contact')
    }
  },
  data() {
    return {
      bannerImage: require('!!assets-loader!~/../data/images/contact.jpg')
    }
  }
}
</script>

<template>
  <Layout :bannerImage="bannerImage">
    <template slot="banner">
      {{$t('label.contact')}}
    </template>
    <section class="section container">
      <div class="tile is-ancestor">
        <div class="tile is-vertical">
          <div class="tile is-parent">
            <div class="link-block tile is-child is-size-5 is-size-6-mobile">
              <g-image src="~/assets/svgs/mail.svg"/>&nbsp;
              <a target="_blank" :href="'mailto:' + $page.contactData.email">{{$page.contactData.email}}</a>
            </div>
            <div class="link-block tile is-child is-size-5 is-size-6-mobile">
              <g-image src="~/assets/svgs/globe.svg"/>&nbsp;
              <a target="_blank" :href="$page.contactData.web">{{$page.contactData.web}}</a>
            </div>
          </div>
          <hr>
          <div class="tile is-parent">
            <div class="address-block tile is-child is-size-5">
              <g-image src="~/assets/svgs/location.svg"/>&nbsp;
              <div class="address-text">
                <p class="is-size-4 has-text-weight-semibold">{{$page.contactData.addressname}}</p>
                <br>
                <p class="is-size-6" v-html="$page.contactData.address"></p>
              </div>
            </div>
            <div class="address-block tile is-child is-size-5">
              <g-image src="~/assets/svgs/location.svg"/>&nbsp;
              <div class="address-text">
                <p class="is-size-4 has-text-weight-semibold">{{$page.contactData.address2name}}</p>
                <br>
                <p class="is-size-6" v-html="$page.contactData.address2"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  .link-block {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .address-block {
    display: flex;
    align-items: flex-start;
    padding: 10px;
  }

  .address-text {
    padding: 10px;
  }

  .icon-color {
    color: $site-icon-color;
  }

</style>

<page-query>
  query Contact {
    contactData: contactData (id: "contact") {
      organization
      address
      addressname
      address2
      address2name
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

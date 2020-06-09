<template>
  <Layout>
    <div class="page-wrapper">
      <section class="hero is-small is-white">
        <div class="hero-body">
          <div class="container is-fullhd has-text-centered">
            <h1 class="title">No encuentro la página...</h1>
            <h1 class="title">Page not found...</h1>
          </div>
        </div>
        <div class="section has-text-centered">
          <g-image src="~/assets/images/404.jpg" alt="404" />
        </div>
      </section>
    </div>
  </Layout>
</template>

<script>
  export default {
    metaInfo: {
      title: '404'
    },
    mounted() {

    }
  }
</script>

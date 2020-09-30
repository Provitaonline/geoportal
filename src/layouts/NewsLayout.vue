<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.news') }}
        <span v-if="yyyymm">
          ({{ new Date(yyyymm).toLocaleString($i18n.locale, { month: 'long' }) + ' ' + yyyymm.substr(0, 4) }})
        </span>
        <a v-else title="RSS feed" :href="'/rss-' + $i18n.locale.substr(0, 2) + '.xml'"><span class="is-size-5"><font-awesome :icon="['fas', 'rss']"/></span></a>
      </h1>
    </template>
    <br>

    <div class="container">
      <div class="columns">
        <div class="column">
          <slot></slot>
        </div>
        <div class="column is-one-fifth">
          <aside class="menu">
            <p class="menu-label">
              News by month
            </p>
            <ul class="menu-list">
              <li>
                2020
                <ul>
                  <li><g-link to="/news/2020-09">January (1)</g-link></li>
                  <li><a>February (4)</a></li>
                  <li><a>March (2)</a></li>
                </ul>
              </li>
              <li>
                2019
                <ul>
                  <li><a>January (1)</a></li>
                  <li><a>February (4)</a></li>
                  <li><a>March (2)</a></li>
                </ul>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>

</page-query>

<script>
export default {
  name: 'NewsLayout',
  props: {
    yyyymm: { type: String, required: false }
  }
}
</script>

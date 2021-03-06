<template>
  <Layout :bannerImage="bannerImage">
    <template slot="banner">
      <div style="display: flex;">
        <div>{{ $t('label.news') }}</div>
        <div v-if="yyyymm">
          ({{ getMonthName(yyyymm) + ' ' + yyyymm.substr(0, 4) }})
        </div>
      </div>
    </template>
    <br>

    <div class="container">
      <div class="columns">
        <div class="column">
          <slot></slot>
        </div>
        <div class="column is-one-fifth">
          <aside class="menu">
            <a class="is-size-5" title="RSS feed" :href="'/rss-' + $i18n.locale.substr(0, 2) + '.xml'">
              <font-awesome :icon="['fas', 'rss']"/>
            </a>
            <p class="menu-label has-text-weight-semibold">
              {{$t('label.newsbymonth')}}
            </p>
            <ul class="menu-list">
              <li v-for="year in sortedYears">
                {{year}}
                <ul>
                  <li v-for="month in sortedMonths(year)" v-if="dateNav[year][month]">
                    <g-link :to="$tp('/news') + '/' + year + '-' + month">{{getMonthName(year + '-' + month)}} ({{dateNav[year][month]}})</g-link>
                  </li>
                </ul>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .menu-label {
    color: $site-color;
  }

</style>

<static-query>
  query {
    allNewsData: allNewsData {
      edges {
        node {
          yyyymm
        }
      }
    }
  }
</static-query>

<script>
export default {
  name: 'NewsLayout',
  props: {
    yyyymm: { type: String, required: false }
  },
  data() {
    return {
      dateNav: null,
      bannerImage: require('!!assets-loader!~/../data/images/news.jpg')
    }
  },
  created() {
    if (!this.dateNav) {
      this.dateNav = {}
      this.$static.allNewsData.edges.forEach(edge => {
        let yyyy = edge.node.yyyymm.substr(0, 4)
        let mm = edge.node.yyyymm.substr(5, 2)

        if (this.dateNav[yyyy]) {
          if (this.dateNav[yyyy][mm]) {
            this.$set(this.dateNav[yyyy], mm, this.dateNav[yyyy][mm] + 1)
          } else {
            this.$set(this.dateNav[yyyy], mm, 1)
          }
        } else {
          this.$set(this.dateNav, yyyy, {})
          this.$set(this.dateNav[yyyy], mm, 1)
        }
      })
    }
  },
  methods: {
    getMonthName(yyyymm) {
      // Ensure we are in the correct month by compensating UTC
      let monthName = new Date(yyyymm + '-02').toLocaleString(this.$i18n.locale, { month: 'long' })
      return monthName.charAt(0).toUpperCase() + monthName.slice(1)
    },
    sortedMonths(yyyy) {
      return Object.keys(this.dateNav[yyyy]).sort()
    }
  },
  computed: {
    sortedYears() {
      return Object.keys(this.dateNav).sort().reverse()
    }
  }
}
</script>

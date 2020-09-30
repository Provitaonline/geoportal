<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase">
        {{ $t('label.news') }}
        <span v-if="yyyymm">
          ({{ getMonthName(yyyymm) + ' ' + yyyymm.substr(0, 4) }})
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
              {{$t('label.newsbymonth')}}
            </p>
            <ul class="menu-list">
              <li v-for="year in sortedYears">
                {{year}}
                <ul>
                  <li v-for="month in sortedMonths(year)" v-if="dateNav[year][month]">
                    <g-link :to="'/news/' + year + '-' + month">{{getMonthName(year + '-' + month)}} ({{dateNav[year][month]}})</g-link>
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
      dateNav: null
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
            //this.dateNav[yyyy][mm]++
            this.$set(this.dateNav[yyyy], mm, this.dateNav[yyyy][mm] + 1)
          } else {
            this.$set(this.dateNav[yyyy], mm, 1)
            //this.dateNav[yyyy][mm] = 1
          }
        } else {
          this.$set(this.dateNav, yyyy, {})
          //this.dateNav[yyyy] = []
          this.$set(this.dateNav[yyyy], mm, 1)
          //this.dateNav[yyyy][mm] = 1
        }
      })
      //console.log(this.dateNav)
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

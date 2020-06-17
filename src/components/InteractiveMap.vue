<template>
  <div id="map"></div>
</template>

<style lang="scss" scoped>

  #map {
    width: 100%;
    height: 70vh;
  }

</style>

<script>
  import Mapbox from "mapbox-gl"
  import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher"


  export default {
    name: 'InteractiveMap',
    data() {
      return {
        accessToken: 'NOT NEEDED',
        mapStyle: null,
        mapCenter: [-66.58, 6.42],
        mapZoom: 5,
        styles: [
          {
              title: 'topo',
              uri:'/mapstyles/topo.json'
          },
          {
              title: 'osm',
              uri:'/mapstyles/osm.json'
          },
          {
              title: 'simplemap',
              uri:'/mapstyles/simple.json'
          },
          {
              title: 'natgeo',
              uri:'/mapstyles/ng.json'
          },
          {
              title: 'imagery',
              uri:'/mapstyles/satellite.json'
          }
        ]
      }
    },
    mounted() {
      if (process.isClient) {
        let styles = this.locStyles()

        this.mapStyle = styles[0].uri // Default map style

        this.map = new Mapbox.Map({
          container: 'map',
          style: this.mapStyle,
          center: this.mapCenter,
          zoom: this.mapZoom
        })
        let mapSwitcher
        this.map.on('load',( () => {
          this.map.addControl(new Mapbox.NavigationControl(), 'top-right')
          mapSwitcher = new MapboxStyleSwitcherControl(styles)
          this.map.addControl(mapSwitcher, 'top-right')
        }))
        this.$eventBus.$on('localechanged', (locale) => {
          this.map.removeControl(mapSwitcher)
          mapSwitcher = new MapboxStyleSwitcherControl(this.locStyles(locale))
          this.map.addControl(mapSwitcher, 'top-right')
        })
      }
    },
    methods: {
      locStyles: function(locale) {
        return this.styles.map(s => {
          return {title: this.$t('label.' + s.title, locale), uri: s.uri}
        })
      }
    }
  }

</script>

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
        mapZoom: 5
      }
    },
    mounted() {
      if (process.isClient) {

        // TODO: Localize style changer labels (propagate localeChanged event, remove and re-add control)
        const styles = [
          {
              title: 'Mapa base topográfico',
              uri:"/mapstyles/topo.json"
          },
          {
              title: "OpenStreetMap",
              uri:"/mapstyles/osm.json"
          },
          {
              title: "Mapa base simple",
              uri:"/mapstyles/simple.json"
          },
          {
              title: "National Geographic",
              uri:"/mapstyles/ng.json"
          },
          {
              title: "Imágenes aéreas/satelitales",
              uri:"/mapstyles/satellite.json"
          }
        ]

        this.mapStyle = styles[0].uri

        this.map = new Mapbox.Map({
          container: 'map',
          style: this.mapStyle,
          center: this.mapCenter,
          zoom: this.mapZoom
        })
        this.map.on('load',( () => {
          this.map.addControl(new Mapbox.NavigationControl(), 'top-right')
          this.map.addControl(new MapboxStyleSwitcherControl(styles), 'top-right')
        }))
      }
    }
  }

</script>

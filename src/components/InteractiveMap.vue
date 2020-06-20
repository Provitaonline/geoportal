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
        maxBounds: [[-82, -3], [-54, 20]],
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
        ],
        visibleTileLayers: {}
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
          zoom: this.mapZoom,
          maxBounds: this.maxBounds
        })
        let mapSwitcher
        this.map.on('load',( () => {
          this.map.addControl(new Mapbox.NavigationControl(), 'top-right')
          mapSwitcher = new MapboxStyleSwitcherControl(styles)
          this.map.addControl(mapSwitcher, 'top-right')
          this.addLayers()
          this.map.on('styledata',() => {
            this.addLayers()
          })
        }))
        this.$eventBus.$on('localechanged', (locale) => {
          this.map.removeControl(mapSwitcher)
          mapSwitcher = new MapboxStyleSwitcherControl(this.locStyles(locale))
          this.map.addControl(mapSwitcher, 'top-right')
        })
        this.$eventBus.$on('addtilelayer', (item) => {
          this.addTileLayer(item)
        })
        this.$eventBus.$on('removetilelayer', (layer) => {
          this.removeTileLayer(layer)
        })
      }
    },
    methods: {
      locStyles: function(locale) {
        return this.styles.map(s => {
          return {title: this.$t('label.' + s.title, locale), uri: s.uri}
        })
      },
      addLayers: function() {
        if (!this.map.getLayer('venezuela')) {
          this.map.addSource('venezuela', {
            type: 'geojson',
            data: '/mapdata/venezuela.geojson'
          })
          this.map.addLayer({
            id: 'venezuela',
            type: 'line',
            source: 'venezuela',
            layout: {},
            paint: {
              'line-color': '#504f54',
              'line-dasharray': [2, 3],
              'line-width': 2
            }
          })
        }

        for (const item in this.visibleTileLayers) {
          if (!this.map.getLayer(item)) {
            this.addTileLayer(this.visibleTileLayers[item])
          }
        }

      },
      addTileLayer: function (item) {
        let layer = item.tiles
        let srcInfo, lInfo
        if (item.tileInfo.type === 'vector') {
          srcInfo = {
            type: 'vector',
            maxzoom: 12,
            tiles: ['https://geoportalp.s3-us-west-2.amazonaws.com/tiles/' + layer + '/{z}/{x}/{y}.pbf']
          }
          lInfo = {
            id: layer,
            type: 'fill',
            source: layer,
            'source-layer': layer,
            paint: {
              'fill-color': item.tileInfo.color,
              'fill-outline-color': 'black',
              'fill-opacity': 0.5
            }
          }
        } else {
          srcInfo = {
            type: 'raster',
            scheme: 'tms',
            tiles: ['https://geoportalp.s3-us-west-2.amazonaws.com/tiles/' + layer + '/{z}/{x}/{y}.png'],
            tileSize: 256
          }
          lInfo = {
            id: layer,
            type: 'raster',
            source: layer,
            paint: {
              'raster-opacity': 0.7
            }
          }
        }

        if (!this.map.getSource(layer)) {
          this.map.addSource(layer, srcInfo)
        }
        this.map.addLayer(lInfo)

        this.map.on('click', layer, (e) => {
          console.log('click ', this.map.queryRenderedFeatures(e.point, { layers: [layer] }))
          new Mapbox.Popup()
            .setLngLat(e.lngLat)
            .setHTML('HOLA')
            .addTo(this.map);
        })
        this.map.on('mouseenter', layer, (e) => {
          this.map.getCanvas().style.cursor = 'pointer'
        })
        this.map.on('mouseleave', layer, (e) => {
          this.map.getCanvas().style.cursor = ''
        })

        if (!this.visibleTileLayers[layer]) {
          this.visibleTileLayers[layer] = item
        }
      },
      removeTileLayer: function (layer) {
        this.map.removeLayer(layer)
        delete this.visibleTileLayers[layer]
      }
    }
  }

</script>

<template>
  <div id="map"></div>
</template>

<style lang="scss" scoped>

  #map {
    width: 100%;
    height: 70vh;
  }

</style>

<style>
  .reset-view-control {
    background-image: url(~@/assets/images/sync-alt.svg);
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>

<script>
  import Vue from 'vue'
  import Mapbox from 'mapbox-gl'
  import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
  import MapPopUpContent from '~/components/MapPopUpContent.vue'

  var MapPopUpContentClass = Vue.extend(MapPopUpContent)

  class ResetViewControl {
    onAdd(map) {
      this.map = map
      this.container = document.createElement('div')
      this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'
      this.button = document.createElement('button')
      this.button.className = 'mapboxgl-ctrl-icon reset-view-control'
      this.container.appendChild(this.button)
      this.button.addEventListener('click', this.repositionMap.bind(this))
      return this.container;
    }
    onRemove() {
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
    repositionMap() {
      this.map.flyTo({center: [-66.58, 6.42], zoom: 5})
    }
  }

  export default {
    name: 'InteractiveMap',
    props: {
      layerMeta: { type: Array, required: true }
    },
    components: {
      MapPopUpContent
    },
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
          const resetView = new ResetViewControl()
          this.map.addControl(resetView, 'top-right')
          mapSwitcher = new MapboxStyleSwitcherControl(styles)
          this.map.addControl(mapSwitcher, 'top-right')
          this.locControls(this.$i18n.locale)
          this.addLayers()
          this.map.on('styledata',() => {
            this.addLayers()
          })
        }))

        this.$eventBus.$on('localechanged', (locale) => {
          this.map.removeControl(mapSwitcher)
          mapSwitcher = new MapboxStyleSwitcherControl(this.locStyles(locale))
          this.map.addControl(mapSwitcher, 'top-right')
          this.locControls(locale)
        })
        this.$eventBus.$on('addtilelayer', (item) => {
          this.addTileLayer(item)
        })
        this.$eventBus.$on('removetilelayer', (layer) => {
          this.removeTileLayer(layer)
        })
        this.map.on('click', this.mapClickHandler)
        this.map.on('mousemove', this.mapMouseMoveHandler)
      }
    },
    methods: {
      locStyles: function(locale) {
        return this.styles.map(s => {
          return {title: this.$t('label.' + s.title, locale), uri: s.uri}
        })
      },
      locControls: function(locale) {
        document.getElementsByClassName('reset-view-control')[0].title = this.$t('label.resetview', locale)
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
            maxzoom: 10,
            tiles: ['https://geoportalp.s3-us-west-2.amazonaws.com/tiles/' + layer + '/{z}/{x}/{y}.pbf']
          }
          lInfo = item.tileInfo.style
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

        if (!this.visibleTileLayers[layer]) {
          this.visibleTileLayers[layer] = item
        }
      },
      removeTileLayer: function (layer) {
        this.map.removeLayer(layer)
        delete this.visibleTileLayers[layer]
      },
      mapClickHandler: function(e) {
        let features = this.map.queryRenderedFeatures(e.point)
        if (features.length) {
          let popUpItems = []
          let currentLayerId
          features.forEach((item) => {
            if (this.visibleTileLayers[item.layer.id]) {
              let lM = this.layerMeta.find(element => element.tiles === item.layer.id)
              let layerName = lM.name[this.$i18n.locale.toString().substr(0,2)]
              if (currentLayerId != item.layer.id) {
                currentLayerId = item.layer.id
                popUpItems.push({itemText: layerName, isHeading: true})
              }
              popUpItems.push({
                itemText: item.properties[lM.tileInfo.displayAttribute],
                isHeading: false,
                itemProperties: item.properties,
                layerName: layerName
              })
            }
          });

          if (popUpItems.length) {
            let mapPopUpContent = (new MapPopUpContentClass({
              propsData: {popUpItems: popUpItems, $i18n: this.$i18n}
            })).$mount()
            new Mapbox.Popup()
              .setLngLat(e.lngLat)
              .setDOMContent(mapPopUpContent.$el)
              .addTo(this.map)
          }
        }
      },
      mapMouseMoveHandler: function(e) {
        // TODO: Do not change cursor to pointer if layer is not in this.visibleTileLayers
        let features = this.map.queryRenderedFeatures(e.point)
        if (features.length) {
          this.map.getCanvas().style.cursor = 'pointer'
        } else {
          this.map.getCanvas().style.cursor = ''
        }
      }
    }
  }

</script>

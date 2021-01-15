<template>
  <div>
    <div v-show="isCapturing">
      <g-image :immediate="true" src="~/assets/images/logo.png" />
    </div>
    <div id="map"></div>
    <MapLegend :layerMeta="layerMeta" />
    <!-- <b-loading  v-model="isCapturing"></b-loading> -->
    <audio id="cameraClick" src="/sound/camera-shutter-click.mp3"></audio>
  </div>
</template>

<style lang="scss" scoped>

  #map {
    width: 100%;
    height: 80vh;
  }

</style>

<script>
  import Vue from 'vue'
  import Mapbox from 'mapbox-gl'
  import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
  import MapPopUpContent from '~/components/MapPopUpContent.vue'
  import MapLegend from '~/components/MapLegend.vue'
  import { ResetViewControl, ScreenshotControl } from '~/utils/map'
  import { stripePattern } from '~/utils/misc'
  import { mapConfig } from '~/utils/config'
  import html2canvas from 'html2canvas'

  var MapPopUpContentClass = Vue.extend(MapPopUpContent)

  export default {
    name: 'InteractiveMap',
    props: {
      layerMeta: { type: Array, required: true }
    },
    data() {
      return {
        visibleTileLayers: {},
        isCapturing: false
      }
    },
    components: {
      MapLegend
    },
    mounted() {
      if (process.isClient) {
        this.visibleTileLayers = this.$store.state.visibleTileLayers

        let styles = this.locStyles()

        // Default map style
        if (!this.$store.state.mapStyleUri) {
          this.$store.commit('setMapStyleUri', styles[0].uri)
        }

        this.map = new Mapbox.Map({
          container: 'map',
          style: this.$store.state.mapStyleUri,
          center: this.$store.state.mapView.center || mapConfig.mapCenter,
          zoom: this.$store.state.mapView.zoom || mapConfig.mapZoom,
          bearing: this.$store.state.mapView.bearing ||  mapConfig.mapBearing,
          pitch: this.$store.state.mapView.pitch ||  mapConfig.mapPitch,
          maxBounds: mapConfig.maxBounds,
          maxZoom: mapConfig.maxZoom,
          preserveDrawingBuffer: true // So that we can take screen shots (performance issues?)
        })
        let mapSwitcher
        this.map.on('load',( () => {
          this.map.addControl(new Mapbox.NavigationControl(), 'top-right')
          const resetView = new ResetViewControl({
            center: mapConfig.mapCenter,
            zoom: mapConfig.mapZoom,
            bearing: mapConfig.mapBearing,
            pitch: mapConfig.mapPitch
          })
          this.map.addControl(resetView, 'top-right')
          const screenshot = new ScreenshotControl(this.screenShot)
          this.map.addControl(screenshot, 'top-right')
          mapSwitcher = new MapboxStyleSwitcherControl(styles)
          this.map.addControl(mapSwitcher, 'top-right')
          this.locControls(this.$i18n.locale)
          this.addLayers()
          this.map.on('styledata',() => {
            this.addLayers()
          })
        }))

        this.$eventBus.$on('localechanged', (locale) => {
          if (document.getElementById('map')) { // Only if there is a map in the DOM
            this.map.removeControl(mapSwitcher)
            mapSwitcher = new MapboxStyleSwitcherControl(this.locStyles(locale))
            this.map.addControl(mapSwitcher, 'top-right')
            this.locControls(locale)
          }
        })
        this.$eventBus.$on('addtilelayer', (item) => {
          this.addTileLayer(item)
        })
        this.$eventBus.$on('removetilelayer', (layer) => {
          this.removeTileLayer(layer)
        })
        this.map.on('click', this.mapClickHandler)
        this.map.on('mousemove', this.mapMouseMoveHandler)

        this.map.on('sourcedata', (e) => {
          if (e.sourceDataType === 'metadata') {
            let foundStyle = mapConfig.styles.find(s => s.title === e.sourceId)
            if (foundStyle) {
              if (foundStyle.uri != this.$store.state.mapStyleUri) {
                this.$store.commit('setMapStyleUri', foundStyle.uri)
              }
            }
          }
        })
      }
    },
    methods: {
      locStyles: function(locale) {
        return mapConfig.styles.map(s => {
          return {title: this.$t('label.' + s.title, locale), uri: s.uri}
        })
      },
      locControls: function(locale) {
        // Since Mapbox does not support localization of controls, we do it this way
        document.getElementsByClassName('reset-view-control')[0].title = this.$t('label.resetview', locale)
        document.getElementsByClassName('mapboxgl-style-switcher')[0].title = this.$t('label.selectbasemap', locale)
        document.getElementsByClassName('mapboxgl-ctrl-zoom-in')[0].title = this.$t('label.zoomin', locale)
        document.getElementsByClassName('mapboxgl-ctrl-zoom-out')[0].title = this.$t('label.zoomout', locale)
        document.getElementsByClassName('mapboxgl-ctrl-compass')[0].title = this.$t('label.resetbearing', locale)
        document.getElementsByClassName('screenshot-control')[0].title = this.$t('label.screenshot', locale)
      },
      addLayers: function() {
        if (!this.map.getLayer('venezuela')) {
          this.map.addSource('venezuela', {
            type: 'vector',
            maxzoom: 10,
            tiles: [mapConfig.vectorTilesBaseUrl + 'venezuela' + '/{z}/{x}/{y}.pbf'],
            attribution: 'IGVSB'
          })
          this.map.addLayer({
            id: 'venezuela',
            type: 'line',
            source: 'venezuela',
            'source-layer': 'venezuela',
            layout: {},
            paint: {
              'line-color': '#504f54',
              'line-dasharray': [2, 3],
              'line-width': 2
            }
          })
          stripePattern('black').then((image) => {
            if (!this.map.hasImage('pattern')) this.map.addImage('pattern', image)
            this.map.addLayer({
              id: 'esequibo-layer',
              type: 'fill',
              source: 'venezuela',
              'source-layer': 'venezuela',
              layout: {},
              filter: ['==', 'NAME', 'Territorio Esequibo'],
              paint: {
                'fill-pattern': 'pattern',
                'fill-opacity': 0.3
              }
            })
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
            tiles: [mapConfig.vectorTilesBaseUrl + layer + '/{z}/{x}/{y}.pbf']
          }
          lInfo = item.tileInfo.style
        } else {
          srcInfo = {
            type: 'raster',
            scheme: 'tms',
            tiles: [mapConfig.rasterTilesBaseUrl + layer + '/{z}/{x}/{y}.png'],
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
        srcInfo.attribution=item.source ? item.source : ''

        if (!this.map.getSource(layer)) {
          this.map.addSource(layer, srcInfo)
        }
        this.map.addLayer(lInfo)

        if (!this.visibleTileLayers[layer]) {
          this.$set(this.visibleTileLayers, layer, item)
          this.$store.commit('setVisibleTileLayers', this.visibleTileLayers)
        }
      },
      removeTileLayer: function (layer) {
        this.map.removeLayer(layer)
        this.$delete(this.visibleTileLayers, layer)
        this.$store.commit('setVisibleTileLayers', this.visibleTileLayers)
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
      },
      screenShot: function() {
        this.isCapturing = true
        this.$nextTick(() => {
          document.getElementById('cameraClick').play()
          let mbControls = document.getElementsByClassName('mapboxgl-ctrl-top-right')
          mbControls[0].style.display = 'none'
          html2canvas(document.getElementById('mapColumn')).then((canvas) => {
            let link = document.createElement('a')
            link.setAttribute('download', 'map.png')
            link.href = canvas.toDataURL()
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            mbControls[0].style.display = 'block'
            this.isCapturing = false
          })
        })
      }
    },
    beforeDestroy () {
      // Save map view before leaving
      this.$store.commit('setMapView', {
        center: this.map.getCenter(),
        zoom: this.map.getZoom(),
        bearing: this.map.getBearing(),
        pitch: this.map.getPitch()
      })
    }
  }

</script>

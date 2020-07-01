// Import main css
import '~/assets/style/index.scss'

import Buefy from 'buefy'
import Vuex from 'vuex'

import DefaultLayout from '~/layouts/Default.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import {
  faFileDownload, faDownload, faMapMarkedAlt, faTimes, faBars, faAngleDown,
  faAngleUp, faSearch
} from '@fortawesome/free-solid-svg-icons'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
library.add(
  faUser, faFileDownload, faDownload, faMapMarkedAlt, faFacebookF, faTwitter,
  faInstagram, faTimes, faBars, faAngleDown, faAngleUp, faSearch
)

export default function (Vue, { router, head, isClient, appOptions }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  Vue.component('font-awesome', FontAwesomeIcon)

  appOptions.i18n.setLocaleMessage('es-ve', require('./messages/messages.json').es)
  appOptions.i18n.setLocaleMessage('en-us', require('./messages/messages.json').en)

  Vue.use(Buefy)

  Vue.prototype.$eventBus = new Vue({})

  Vue.use(Vuex)

  appOptions.store = new Vuex.Store({
    state: {
      visibleTileLayers: {},
      fileList: [],
      mapStyleUri: null,
      mapView: {}
    },
    mutations: {
      setVisibleTileLayers (state, visibleTileLayers) {
        state.visibleTileLayers = visibleTileLayers
      },
      setFileList (state, fileList) {
        state.fileList = fileList
      },
      setMapStyleUri (state, mapStyleUri) {
        state.mapStyleUri = mapStyleUri
      },
      setMapView (state, mapView) {
        state.mapView = mapView
      }
    }
  })
}

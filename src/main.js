// Import main css
import '~/assets/style/index.scss'

import Buefy from 'buefy'

import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  Vue.use(Buefy)
}

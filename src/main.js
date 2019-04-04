// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import '@/styles/index.scss' // global css

import './icons' // svg icons
import $http from './utils/request.js'
import moment from 'moment'

// import './permission.js' // 权限判断

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = $http
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

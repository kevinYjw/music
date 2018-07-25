import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// 基础样式
import 'common/stylus/reset.css'
import 'common/stylus/border.css'
import 'common/stylus/index.styl'

fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(VueLazyLoad,{
	loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})

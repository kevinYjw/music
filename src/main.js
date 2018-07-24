import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
<<<<<<< HEAD
// import router from './router'
=======
import router from './router'
import fastclick from 'fastclick'
>>>>>>> origin/header

// 基础样式
import 'common/stylus/reset.css'
import 'common/stylus/border.css'
import 'common/stylus/index.styl'

fastclick.attach(document.body)
Vue.config.productionTip = false
import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

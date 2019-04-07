import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store

//配置全局请求地址
// Vue.prototype.websiteUrl = "http://127.0.0.1:8080/"
Vue.prototype.websiteUrl = "http://134.175.1.174:8888/"

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()

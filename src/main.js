import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import 'boxicons'

// 导入字体图标
// import 'https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css'

import axios from 'axios'
// 配置请求的root路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
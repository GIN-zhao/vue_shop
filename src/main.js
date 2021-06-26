import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import echarts from 'echarts'

import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import 'boxicons'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入字体图标
// import 'https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css'

import axios from 'axios'
// const axios = require('axios')
// 配置请求的root路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1'
    // axios.defaults.baseURL = 'http://127.0.0.1:8002/backend'
    //先拦截登录的命令,将token记录到Authorization中
axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
})
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

//注册TreeTable控件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originalValue) {
    const dt = new Date(originalValue)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getUTCSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
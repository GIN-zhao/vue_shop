import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import home from './components/Home.vue'
Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/Login',
            component: Login
        }, {
            path: '/Login',
            component: Login
        },
        {
            path: '/home',
            component: home
        }

    ],
    mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const temptoken = window.sessionStorage.getItem('token')
    if (!temptoken)
        return next('/login')
    next()
})

export default router
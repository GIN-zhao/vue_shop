import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import users from './components/user/users.vue'
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
            component: home,
            redirect: '/Welcome',
            children: [{
                    path: '/Welcome',
                    component: Welcome
                }, {
                    path: '/users',
                    component: users
                }


            ]
        },


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
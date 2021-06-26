import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import users from './components/user/users.vue'
import Rights from './components/power/Rights.vue'
import roles from './components/power/roles.vue'
import categories from './components/goods/categories.vue'
import Gparams from './components/goods/Gparams.vue'
import goodslist from './components/goods/goodslist.vue'
import AddGoods from './components/goods/Add.vue'
import order from './components/order/order.vue'
import report from './components/report/report.vue'
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
                },
                {
                    path: '/rights',
                    component: Rights
                }, {
                    path: '/roles',
                    component: roles
                },
                {
                    path: '/categories',
                    component: categories
                },
                {
                    path: '/params',
                    component: Gparams
                },
                {
                    path: '/goods',
                    component: goodslist
                },
                {
                    path: '/add',
                    component: AddGoods
                }, {
                    path: '/orders',
                    component: order
                },
                {
                    path: '/reports',
                    component: report
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
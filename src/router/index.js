import {
    ElMessage
} from 'element-plus';
import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

//注册路由
const routes = [{
        path: '/login',
        name: 'login',
        component: () => import('@/layout/Login.vue')
    },
    {
        path: '/',
        name: 'layout',
        component: () => import('@/layout/Layout.vue'),
        redirect: "/ChatView",
        children: [{
            path: '/ChatView',
            name: 'ChatView',
            component: () => import('@/views/ChatView.vue'),
        }, ]
    }
];

const router = createRouter({
    mode: 'hash',
    history: createWebHashHistory(process.env.BASE_URL),
    routes
});

export function resetRouter() {
    const newRouter = createRouter({
        mode: 'hash',
        history: createWebHashHistory(process.env.BASE_URL),
        routes
    })
    router.matcher = newRouter.matcher
}

function isAuthenticated() {
    return sessionStorage.getItem('token');
}

router.beforeEach((to, from, next) => {
    if (to.path === '/login' && isAuthenticated()) {
        next({
            path: '/'
        });
    } else if (!isAuthenticated() && to.path !== '/login') {
        ElMessage.error('请先登录');
        next({
            path: '/login'
        });
    } else {
        next();
    }
});

export default router;
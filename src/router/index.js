import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        }, {
            path: '/login',
            component: resolve => require(['../components/Login.vue'], resolve)
        }, {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    path: 'index',
                    name: "首页",
                    component: resolve => require(['../components/index.vue'], resolve)
                },
                {
                    path: 'fundefficient',
                    name: "资金效率",
                    component: resolve => require(['../components/UserBasedSetting/fundefficient.vue'], resolve)
                },
                {
                    path: 'kunpeng',
                    name: "坤鹏业务统计",
                    component: resolve => require(['../components/UserBasedSetting/kunpeng.vue'], resolve)
                },
                {
                    path: 'dingsheng',
                    name: "鼎盛业务统计",
                    component: resolve => require(['../components/UserBasedSetting/dingsheng.vue'], resolve)
                },
                {
                    path: 'zhide',
                    name: "植德电子合同下载",
                    component: resolve => require(['../components/UserBasedSetting/zhide.vue'], resolve)
                },
                {
                    path: 'bussstat',
                    name: "业务执行统计",
                    component: resolve => require(['../components/UserBasedSetting/bussstat.vue'], resolve)
                },
                {
                    path: 'usermanage',
                    name: "成员管理",
                    component: resolve => require(['../components/UserBasedSetting/usermanage.vue'], resolve)
                },
            ]
        }

    ]
})
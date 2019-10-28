import Vue from 'vue'
import Main from '@/views/Main.vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)
    // 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    meta: {
        requireAuth: true,
    },
    component: Main,
    children: [{
            path: 'home',
            title:'首页',
            name: 'home_index',
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () =>
                import ('@/views/own-space/own-space.vue')
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () =>
                import ('@/views/message/message.vue')
        },
        {
            path: 'updata_log',
            title: '更新日志',
            name: 'updata_log',
            component: () =>
                import ('@/views/message/updataLog.vue')
        }
    ]
};

    // 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/user-manage',
        name: 'user-manage',
        title: '系统管理',
        meta: {
            requireAuth: true,
        },
        component: Main,
        children: [
            {
                path: "user-management",
                title: "用户管理",
                meta: {
                    requireAuth: true,
                },
                name: "user-management",
                component: () =>
                    import ('@/views/user-manage/basic-function/user-management/user-management.vue')
            },
            {
                path: "menu-manage",
                title: "菜单管理",
                meta: {
                    requireAuth: true,
                },
                name: "menu-manage",
                component: () =>
                    import ('@/views/user-manage/basic-function/menu-manage/menu-manage.vue')
            },
            {
                path: "menu-poewrnew",
                title: "业务权限",
                meta: {
                    requireAuth: true,
                },
                name: "menu-poewrnew",
                component: () =>
                    import ('@/views/user-manage/basic-function/menu-power/menu-poewrnew.vue')
            },
            {
                path: "user-poewrnew",
                title: "权限查询",
                meta: {
                    requireAuth: true,
                },
                name: "user-poewrnew",
                component: () =>
                    import ('@/views/user-manage/basic-function/menu-power/user-poewrnew.vue')
            },
            {
                path: "resource-powernew",
                meta: {
                    requireAuth: true,
                },
                title: "资源权限",
                name: "resource-powernew",
                component: () =>
                    import ('@/views/user-manage/basic-function/resource-power/resource-powernew.vue')
            },

            {
                path: "system-parameter",
                title: "参数设置",
                meta: {
                    requireAuth: true,
                },
                name: "system-parameter",
                component: () =>
                    import ('@/views/user-manage/basic-function/system-parameter/system-parameter.vue')
            },
            {
                path: "log-query",
                title: "日志查询",
                meta: {
                    requireAuth: true,
                },
                name: "log-query",
                component: () =>
                    import ('@/views/user-manage/basic-function/log-query/log-query.vue')
            },
            {
                path: "redisSynchro",
                title: "系统代码同步",
                meta: {
                    requireAuth: false,
                },
                name: "redisSynchro",
                component: () =>
                    import ('@/views/user-manage/basic-function/data-synchro/redisSynchro.vue')
            },
            {
                path: "syncPk",
                title: "主键同步",
                meta: {
                    requireAuth: false,
                },
                name: "syncPk",
                component: () =>
                    import ('@/views/user-manage/basic-function/data-synchro/syncPk.vue')
            }
        ]
    },
    {
        path: '/dictionary-management',
        name: 'dictionary-management',
        title: '字典管理',
        meta: {
            requireAuth: true,
        },
        component: Main,
        children: [{
                path: "department",
                title: "科室字典",
                meta: {
                    requireAuth: true,
                },
                name: "department",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/department/department.vue')
            },
            {
                path: "price-list",
                title: "收费项目",
                meta: {
                    requireAuth: true,
                },
                name: "price-list",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/price-list/price-list.vue')
            },
            {
                path: "clinical-project",
                title: "临床项目",
                meta: {
                    requireAuth: true,
                },
                name: "clinical-project",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/clinical-project/clinical-project.vue')
            },

            {
                path: "disease-diagnosis",
                title: "疾病诊断",
                meta: {
                    requireAuth: true,
                },
                name: "disease-diagnosis",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/disease-diagnosis/disease-diagnosis.vue')
            },
     
            {
                path: "hospital-basic-data",
                title: "术语字典",
                meta: {
                    requireAuth: true,
                },
                name: "hospital-basic-data",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/hospital-basic-data/hospital-basic-data.vue')
            },
            {
                path: "medical-institutions",
                title: "医疗卫生机构",
                meta: {
                    requireAuth: true,
                },
                name: "medical-institutions",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/medical-institutions/medical-institutions.vue')
            },
            {
                path: "medical-staff",
                title: "卫生服务人员",
                meta: {
                    requireAuth: true,
                },
                name: "medical-staff",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/medical-staff/medical-staff.vue')
            },
            {
                path: "master-data",
                title: "主数据管理",
                meta: {
                    requireAuth: true,
                },
                name: "master-data",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/master-data/master-data.vue')
            },
            {
                path: "identification-data",
                title: "标识数据管理",
                meta: {
                    requireAuth: true,
                },
                name: "identification-data",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/identification-data/identification-data.vue')
            },
            {
                path: "basic-info",
                title: "病人基本信息",
                meta: {
                    requireAuth: true,
                },
                name: "basic-info",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/basic-info/basic-info.vue')
            },
            {
                path: "report-management",
                title: "报表管理",
                meta: {
                    requireAuth: true,
                },
                name: "report-management",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/report-management/report-management.vue')
            },
            {
                path: "report-query",
                title: "报表查询",
                meta: {
                    requireAuth: true,
                },
                name: "report-query",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/report-query/report-query.vue')
            },
            {
                path: "credit-management",
                title: "信用管理",
                meta: {
                    requireAuth: true,
                },
                name: "credit-management",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/credit-management/credit-management.vue')
            },
            {
                path: "item-category",
                meta: {
                    requireAuth: true,
                },
                title: "项目类别",
                name: "item-category",
                component: () =>
                    import ('@/views/dictionary-management/dictionary-basic-function/item-category/item-category.vue')
            },
        ]
        
    },
    {
        path:'/newMange',
        title: '测试页面',
        meta: {
            requireAuth: true,
        },
        component: Main, //这项是必须的  组件指向Main.vue
        children:[
            {
                path: "newMange",
                title: "测试页面(右侧页面)",
                meta: {
                    requireAuth: true,
                },
                name: "newMange",
                component: () =>
                    import ('@/views/newMange/newMange.vue')
            },
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
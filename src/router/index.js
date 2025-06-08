import { createRouter, createWebHashHistory } from "vue-router";

import Layout from '@/layout/index';
import { ADMIN } from "@/constants/general";

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'Compass' }
        }]
    },
    {
        path: "/oauth2/callback",
        component: () => import("@/views/oauth2/callback"),
        hidden: true
    },
    {
        path: "/register",
        component: () => import("@/views/register"),
        hidden: true
    },
    {
        path: '/account',
        component: Layout,
        value: "account",
        redirect: '/account',
        alwaysShow: true, // will always show the root menu
        meta: {
            title: '账户设置',
            icon: 'UserFilled'
        },
        temporary: true,
        children: [
            {
                path: '',
                component: () => import('@/views/account/index'),
                meta: {
                    title: '个人信息'
                }
            },
            {
                path: '/password',
                component: () => import('@/views/account/password'),
                meta: {
                    title: '更换密码'
                }
            }
        ]
    }
];

export const NOT_FOUND = { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true };

export const asyncRoutes = [
    {
        path: '/article',
        component: Layout,
        value: "article",
        alwaysShow: true, // will always show the root menu
        meta: {
            title: '文章',
            icon: 'FolderOpened'
        },
        temporary: true,
        children: [
            {
                path: 'all',
                component: () => import('@/views/article/all'),
                meta: {
                    title: '全部文章',
                    cached: true,
                    settingActiveMenu: true
                }
            },
            {
                path: '',
                component: () => import('@/views/article/my-article'),
                meta: {
                    title: '我的文章',
                    cached: true,
                    settingActiveMenu: true
                }
            },
            {
                path: '/category',
                component: () => import('@/views/article/category'),
                meta: {
                    title: '分类管理'
                }
            },
            {
                path: '/article/editor',
                component: () => import('@/views/article/editor2'),
                meta: {
                    title: '编辑',
                    activeMenu: "/article"
                },
                hidden: true,
                beforeEnter: (to, from, next) => {
                    // 在进入路由前执行的逻辑
                    // 注意：这里没有 this，因为守卫执行时组件实例还没创建
                    // 根据路由规则或者状态决定是否进入路由
                    if (from.meta.settingActiveMenu) {
                        to.meta.activeMenu = from.path;
                    }
                        // 在编辑页面刷新时，from为/article，因此只能根据query中的参数进行判断；
                        // 但这样也会存在问题，如果用户（管理员）把query删除，并刷新页面的话，将会导致高亮错误的页面（不过应该没人这么闲吧）；
                    // 而且也还有一个默认普通用户设置的兜底，所以这种情况应该没那么糟糕
                    else if (to.query.type === ADMIN) {
                        to.meta.activeMenu = "/article/all";
                    }
                    next(); // 必须调用该方法来resolve这个钩子
                }
            },
        ]
    },
    {
        path: '/site-asset',
        component: Layout,
        value: "site-asset",
        redirect: '/site-asset',
        alwaysShow: true, // will always show the root menu
        meta: {
            title: '站点资源',
            icon: 'Files'
        },
        temporary: true,
        children: [
            {
                name: "SiteAssetIndex",
                path: '',
                component: () => import('@/views/site-asset/index'),
                meta: {
                    title: '站点资源管理',
                    cached: true,
                }
            },
            {
                path: '/site-asset/editor',
                component: () => import('@/views/site-asset/editor'),
                meta: {
                    title: '编辑',
                    activeMenu: "/site-asset"
                },
                hidden: true
            },
        ]
    },
    {
        path: '/sys',
        component: Layout,
        value: "sys",
        redirect: '/sys/user',
        alwaysShow: true, // will always show the root menu
        meta: {
            title: '系统设置',
            icon: 'Setting'
        },
        temporary: true,
        children: [
            {
                path: 'app-setting',
                component: () => import('@/views/sys/app-setting'),
                meta: {
                    title: '网站设置'
                }
            },
            {
                path: 'user',
                component: () => import('@/views/sys/user'),
                value: "sys:user",
                name: 'User',
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: 'permission',
                component: () => import('@/views/sys/permission'),
                value: "sys:permission",
                name: 'Permission',
                meta: {
                    title: '权限管理'
                }
            },
            {
                path: 'role',
                component: () => import('@/views/sys/role'),
                value: "sys:role",
                name: 'Role',
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: 'test1',
                component: () => import('@/views/sys/test1'),
                value: "sys:test1",
                name: 'Test1',
                meta: {
                    title: '测试菜单1'
                }
            }
        ]
    },
];

const _createRouter = () => createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
});

export function resetRouter() {
    const newRouter = _createRouter();
    router.matcher = newRouter.matcher; // reset router
}

const router = _createRouter();

export default router;

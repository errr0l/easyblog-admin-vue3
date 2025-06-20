import router from './router';
import NProgress from 'nprogress';
import getPageTitle from '@/utils/get-page-title';

import { useAppStore } from "./store/app";

import 'nprogress/nprogress.css';

const pathsWithoutRoutes = ['/login', '/oauth2/callback', '/404', '/register', '/error'];
let appStore;

// NProgress Configuration
NProgress.configure({ showSpinner: false });

const configUrl = "/easyblog/config.json";

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title = getPageTitle(to.meta.title);
    if (to.query.skipGuard) {
        next();
        return;
    }
    if (!appStore) {
        appStore = useAppStore();
    }
    // 获取配置信息，并初始化【用户相关】
    // 以当前项目的逻辑来说，由于只会加载当前用户拥有的菜单，所以不会存在【无权限访问某个页面】的情况（即存在404，而不存在403），因此此处不需要添加权限判断逻辑；
    if (!appStore.config) {
        try {
            const resp = await fetch(configUrl)
                .then(res => res.json());
            appStore.setConfig({ config: resp });
            appStore.userStore.init({ prefix: resp.PREFIX });
        } catch (error) {
            next({
                path: '/error',
                query: { message: '获取配置文件失败', code: 500, skipGuard: true }
            });
            return;
        }
    }

    if (!appStore.permissionStore.queried && !pathsWithoutRoutes.includes(to.path)) {
        await appStore.permissionStore.getRoutes();
        if (appStore.permissionStore.queried) {
            next({ ...to, replace: true });
        }
        else {
            next();
        }
    }
    else {
        next();
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
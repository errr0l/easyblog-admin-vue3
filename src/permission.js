import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import getPageTitle from '@/utils/get-page-title';
import { useAppStore } from "@/store/app";
import router from './router';
const whiteList = ['/login', '/404', '/error'];

// NProgress Configuration
NProgress.configure({ showSpinner: false });
const configErrorQuery = { message: '获取配置文件失败', code: 500, skipGuard: true };
router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title = getPageTitle(to.meta.title);
    if (to.query.skipGuard) {
        next();
        return;
    }
    const appStore = useAppStore();
    // 获取配置信息，并初始化【用户相关】
    // 以当前项目的逻辑来说，由于只会加载当前用户拥有的菜单，所以不会存在【无权限访问某个页面】的情况（即存在404，而不存在403），因此此处不需要添加权限判断逻辑；
    if (!appStore.getConfig()) {
        if (!(await appStore.loadConfig())) {
            next({
                path: '/error',
                query: { ...configErrorQuery }
            });
            return;
        }
        else {
            appStore.auth.init();
        }
    }
    if (!appStore.isAuthenticated && !whiteList.includes(to.path)) {
        await appStore.auth.checkAuth();
        if (appStore.isAuthenticated) {
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
import { reactive, ref } from "vue";
import { defineStore } from "pinia";

import { authenticate as authenticateApi, refresh as refreshApi } from "../api/auth";
import { useAppStore } from "@/store/app";
import { getPermissions } from "@/api/permission";
import { PERMISSION_MENU } from "@/constants/general";
import router, { asyncRoutes, constantRoutes, NOT_FOUND, resetRouter } from "@/router";
import { getPrefixForStorage, isPrimitive, makeUserRoutes } from "@/utils/common";

const AUTH_TOKENS = "auth_tokens";

const defaultAuthTokens = {
    refreshToken: "",
    accessToken: "",
    baseInfo: null,
    authorities: null
};

function setItem(key, value) {
    localStorage.setItem(key, isPrimitive(value) ? value : JSON.stringify(value));
}

export const useAuth = defineStore('auth', () => {
    const authTokens = reactive({
        ...defaultAuthTokens
    });
    const userRoutes = ref([]);
    const routes = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const isAuthenticated = ref(false);
    async function authenticate(credentials) {
        try {
            loading.value = true;
            error.value = null;
            const resp = await authenticateApi(credentials);
            if (resp?.code === 0) {
                setAuthTokens(resp.data);
            }
            else {
                error.value = resp;
            }
        }
        catch (err) {
            console.log(err);
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    function getKey(id) {
        const appStore = useAppStore();
        const appPrefix = appStore.config.PREFIX;
        const prefix = getPrefixForStorage(appPrefix);
        return `${prefix}${id}`;
    }

    function logout() {
        const key = getKey(AUTH_TOKENS);
        localStorage.removeItem(key);
        Object.assign(authTokens, defaultAuthTokens);
        isAuthenticated.value = false;
        setRoutes([]);
    }
    // 目前没有专门用于校验的方式，因此使用该接口来代替，基本逻辑：运行checkAuth方法后，accessToken应该不为空，否则就是未认证，需要登录；
    // 正常应该要提供一个接口来验证令牌；
    // 所以这里尽量处理逻辑，"只是"用于校验；
    async function checkAuth() {
        if (!authTokens.accessToken && !authTokens.refreshToken) {
            // 补一个404页面；其实也无关紧要
            setDynamicRoutes([]);
            return;
        }
        try {
            const resp = await getPermissions();
            const code = resp?.code;
            if (code === 0) {
                isAuthenticated.value = true;
                setDynamicRoutes(resp.data || []);
            }
            // accessToken过期
            // else if (code === 40101) {
            //     clearAccessToken();
            // }
            // 刷新令牌过期
            // else if (code >= 40198) {
            //     clearRefreshToken();
            // }
        }
        catch (err) {
            console.log(err);
        }
    }
    // 设置凭证，并存储于浏览器
    function setAuthTokens(respData, saveToLocal = true) {
        if (saveToLocal) {
            const key = getKey(AUTH_TOKENS);
            setItem(key, respData);
        }
        Object.assign(authTokens, respData);
    }
    // 更新凭证，如头像等；
    // 注，只能整个对象进行更新，比如，baseInfo，那么，value也应该是一个baseInfo
    function updateAuthToken(key, value) {
        if (key in authTokens) {
            const authToken = authTokens[key];
            // 简单校验
            if (Object.keys(authToken).join() === Object.keys(value).join()) {
                authTokens[key] = value;
                setItem(getKey(AUTH_TOKENS), authTokens);
            }
        }
    }

    function getRefreshToken() {
        return authTokens.refreshToken;
    }

    function getAccessToken() {
        return authTokens.accessToken;
    }

    // 刷新凭证
    async function refresh(token) {
        try {
            const resp = await refreshApi(token);
            if (resp?.code === 0) {
                setAuthTokens(resp.data);
                return true;
            }
        }
        catch (err) {
            console.log("刷新失败，请尝试刷新页面");
            console.log(err);
        }
        return false;
    }

    // 这个应该只在收到接口响应为401+时调用，clearRefreshToken同理；
    function clearAccessToken() {
        if (authTokens.accessToken) {
            authTokens.accessToken = "";
        }
    }

    function clearRefreshToken() {
        if (authTokens.refreshToken) {
            authTokens.refreshToken = "";
        }
    }

    // 动态路由
    function setDynamicRoutes(routes) {
        const menus = routes.length ? routes.filter(item => item.type === PERMISSION_MENU) : [];
        let userRoutes = [];
        resetRouter();
        if (menus.length) {
            userRoutes = makeUserRoutes(asyncRoutes, menus);
            for (let route of userRoutes) {
                router.addRoute(route);
            }
        }
        router.addRoute(NOT_FOUND);
        setRoutes(userRoutes);
    }

    // 初始化登录凭证
    function init() {
        const authTokensJson = localStorage.getItem(getKey(AUTH_TOKENS));
        if (authTokensJson) {
            setAuthTokens(JSON.parse(authTokensJson), false);
        }
    }

    function setRoutes(_routes) {
        routes.value = [...constantRoutes, ..._routes];
        userRoutes.value = _routes;
    }

    return {
        loading, authenticate, logout, isAuthenticated, checkAuth,
        refresh, clearAccessToken, clearRefreshToken, getRefreshToken, getAccessToken, updateAuthToken,
        init,
        userRoutes,
        routes,
        authTokens,
        error
    };
});
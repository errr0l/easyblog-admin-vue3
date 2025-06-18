import axios from "axios";
import { refresh } from "@/api/account";
// import { Message, MessageBox } from "element-ui";
import { ElMessage as Message, ElMessageBox as MessageBox } from "element-plus";
import router from "@/router";
import { useAppStore } from "@/store/app";

const maxRetryingCount = 3;
const service = axios.create({
    // baseURL: "http://localhost", // 以在nginx中可以更好的匹配
    timeout: 5000,
    retryingCount: maxRetryingCount // 事实上只是刷新令牌的次数
});

let retrying = false;
const queue = [];

/**
 * 登陆弹窗
 * @summary 如果当前路径不是/login，则调整至/login，并取当前路径作为重定向路径，以登陆成功后跳转回当前路径
 * @param {string} message - 提示文本
 * @param {Object} $route - 路由实例
 */
function gotoLoginPage(message, $route) {
    let redirectPath = $route.fullPath;
    MessageBox.confirm(message, "提示", {
        confirmButtonText: "确定"
    }).then(() => {
        if (!redirectPath.includes("/login")) {
            router.push(`/login?redirect=${redirectPath}`);
        }
    });
}

/**
 * 释放请求队列
 * @summary 如果标识为true，则重新发起请求，否则直接reject
 * @param {boolean} ok - 是否重新发起请求的标识
 */
function release(ok) {
    if (queue.length) {
        for (const handler of queue) {
            handler(ok);
        }
        // 释放队列
        queue.length = 0;
    }
}

/**
 * 通知方法
 * @param {Number} type - 通知类型；1=gotoLoginPage，2=Message.error
 * @param {Object} resp - 响应对象
 * @returns
 */
const notice = (type, resp) => {
    if (resp.config && resp.config.silence) {
        return;
    }
    const data = resp.data;
    // 目前只有两种通知类型：1=前往登陆提示，2=默认提示
    if (type === 1) {
        gotoLoginPage(data.message, router.currentRoute.value);
    } else if (type === 2) {
        Message({
            message: data.message || "系统发生异常",
            type: 'error'
        });
    }
};

// 若url不是一http开头时，补充baseUrl；
// 修改请求路径，以命中nginx中的配置；
// 关于store，可以在每次使用时调用对应的方法（如useAppStore），但因为觉得比较繁琐，所以在这里调用了；
export const baseUrlInterceptor = config => {
    const store = useAppStore();
    if (config.url.startsWith("/")) {
        const _config = store.config;
        // config.url = `${_config.HOST}/0${_config.PREFIX}${config.url}`;
        config.url = `/0${_config.PREFIX}${config.url}`;
    }
    return config;
};

export const tokenInterceptor = config => {
    const store = useAppStore();
    const accessToken = store.accessToken;
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
};

// 静默拦截器；
// 此处使用localStorage、vuex（vue）作为代替也是可以的；
const silenceInterceptor = config => {
    if (!config.silence) {
        const silence = sessionStorage.getItem("silence");
        if (silence) {
            config.silence = true;
        }
    }
    return config;
};

async function respHandler(resp) {
    const store = useAppStore();
    const data = resp.data || {};
    switch (data.code) {
        case 0:
            return data;
        // 未登录或accessToken过期
        case 40101:
            const refreshToken = store.refreshToken;
            // 如果没有刷新token，就提示
            if (!refreshToken) {
                notice(1, resp);
                break;
            }
            if (!retrying) {
                retrying = true;
                try {
                    const refreshResp = await refresh({ refreshToken });
                    // 防止循环请求
                    if (!refreshResp || refreshResp.code !== 0) {
                        throw new Error(refreshResp?.message ?? "刷新失败");
                    }
                    const { accessToken, refreshToken: _new } = refreshResp.data;
                    const payload = {
                        data: { accessToken }
                    };
                    if (_new != refreshToken) {
                        payload.data["refreshToken"] = refreshToken;
                    }
                    // store.dispatch("user/cache", payload);
                    store.userStore.cache(payload);
                    release(true);
                    return service(resp.config);
                } catch (error) {
                    console.info("刷新失败：", error);
                } finally {
                    retrying = false;
                }
            }
            // 将后续的请求加入队列
            else {
                return new Promise((resolve, reject) => {
                    queue.push((ok) => {
                        // 请求成功
                        if (ok) {
                            resolve(service(resp.config));
                        } else {
                            reject("refreshing failure.");
                        }
                    });
                });
            }
            break;
        case 40198:
            notice(1, resp);
            // store.dispatch("user/cache", { data: { refreshToken: "" } });
            store.userStore.cache({ data: { refreshToken: "" } });
            break;
        default:
            notice(2, resp);
    }
    release(false);
    return data;
}

// request interceptor
service.interceptors.request.use(baseUrlInterceptor);
service.interceptors.request.use(silenceInterceptor);
service.interceptors.request.use(tokenInterceptor);

// response interceptor
service.interceptors.response.use(
    async response => {
        return respHandler(response) || {};
    },
    error => {
        console.log(error);
        if (error.response) {
            return respHandler(error.response);
        }

        const code = error.code;
        const message = error.message;
        // 可以拓展更多的需要重发请求的情况
        if (error.config.enableRetrying && (code === "ECONNABORTED" || message.includes("timeout of"))) {
            if (error.config.retryingCount > 0) {
                error.config.retryingCount--;
                let current = Math.abs(error.config.retryingCount - maxRetryingCount);
                console.warn("第" + current + "次重发中...");
                if (error.config.configHandler && typeof error.config.configHandler === "function") {
                    error.config.configHandler();
                }
                return service(error.config);
            }
            console.info("[" + error.config.url + "] 请求失败，总次数为：" + maxRetryingCount);
            release(false);
        }
        else if (message === 'Network Error') {
            router.push('/error');
        }
        else {
            console.warn("错误处理失败.");
            console.error(error);
            Message({
                message: error.statusText || "系统发生异常",
                type: "error",
                duration: 5 * 1000
            });
        }

        return Promise.reject(error);
    }
);

export default service;

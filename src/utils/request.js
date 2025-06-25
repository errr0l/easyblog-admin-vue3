import axios from "axios";
import { refresh } from "@/api/account";
import { ElMessage as Message, ElMessageBox as MessageBox } from "element-plus";
import router from "@/router";
import { useAppStore } from "@/store/app";
import { getLogger } from "@/utils/logger";

const loggerOptions = {
    name: "request.js"
};
const logger = getLogger(loggerOptions);
const maxRetryingCount = 3;
const config = {
    timeout: 5000,
    retryingCount: maxRetryingCount, // 事实上只是刷新令牌的次数
    enableRetrying: false
};
const service = axios.create(config);
const axiosRequestConfigMessages = ["axios请求配置：", config];
if (!config.enableRetrying) {
    axiosRequestConfigMessages.push("；未启用重试机制.");
}
getLogger({ ...loggerOptions, delay: 1100 })(axiosRequestConfigMessages);

let retrying = false;
const queue = [];
let appStore;

function getAppStore() {
    if (appStore) {
        return appStore;
    }
    appStore = useAppStore();
    return appStore;
}

/**
 * 登陆弹窗
 * @summary 跳转至/login，并取当前路径作为重定向路径，以登陆成功后返回
 * @param {string} message - 提示文本
 * @param {Object} $route - 路由实例
 */
function toLogin(message, $route) {
    if (toLogin.noticed) {
        return;
    }
    toLogin.noticed = true;
    MessageBox.confirm(message, "提示", {
        confirmButtonText: "确定"
    }).then(() => {
        let redirectPath = $route.fullPath;
        logger("跳转登录：" + redirectPath);
        if (!redirectPath.includes("/login")) {
            router.replace(`/login?redirect=${redirectPath}`);
        }
        else {
            router.replace(redirectPath);
        }
    }).catch(() => {
        logger("用户取消跳转登录.");
    }).finally(() => {
        toLogin.noticed = false;
    });
}

/**
 * 释放请求队列
 * @summary 如果标识为true，则重新发起请求，否则直接reject
 * @param {boolean} ok - 是否重新发起请求的标识
 */
function release(ok) {
    if (queue.length) {
        logger(`释放请求队列： ${queue.length}；flag: ${ok}`);
        let handler;
        while ((handler = queue.pop())) {
            handler(ok);
        }
    }
}

/**
 * 通知方法
 * @param {Number} type - 通知类型；1=toLogin，2=Message.error
 * @param {Object} resp - 响应对象
 * @returns
 */
const notice = (type, resp) => {
    logger(`调用通知方法；通知类型：${type}`);
    if (resp.config && resp.config.silence) {
        return;
    }
    const data = resp.data;
    // 目前只有两种通知类型：1=前往登陆提示，2=默认提示
    if (type === 1) {
        toLogin(data.message, router.currentRoute.value);
    }
    else if (type === 2) {
        Message({
            message: data.message || "系统发生异常",
            type: 'error',
        });
    }
};

export const loggerInterceptor = (config) => {
    logger(['config -', 'url：', config.url, '；method：', config.method, '；header：', config.headers, '；query：', config.query, "；params：", config.params]);
    return config;
};

// 修改请求路径，以命中nginx中的配置；
// 若url不是"/0"开头时，补充；
// 关于store，可以在每次使用时调用对应的方法（如useAppStore），但因为觉得比较繁琐，所以在这里调用了；
export const baseUrlInterceptor = config => {
    const store = getAppStore();
    const _config = store.config;
    if (!config.url.includes("/0")) {
        config.url = `/0${_config.PREFIX}${config.url}`;
    }
    return config;
};

export const tokenInterceptor = config => {
    const store = getAppStore();
    const accessToken = store.accessToken;
    if (accessToken) {
        accessToken && (config.headers["Authorization"] = `Bearer ${accessToken}`);
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
    const data = resp.data || {};
    switch (data.code) {
        case 0:
            return data;
        // 未登录或accessToken过期
        case 40101:
            const store = getAppStore();
            const refreshToken = store.refreshToken;
            // 如果没有刷新token，就提示
            if (!refreshToken) {
                logger("刷新令牌不存在，需重新登录.");
                notice(1, resp);
                break;
            }
            // 若处于刷新状态下，将后续的请求加入队列；
            // 关于重放请求的方式，有两种实现方式：
            //  1）依赖于服务器，将返回401的请求加入队列；
            //  2）前端自行标注需要认证的接口，在发起请求之前加入队列，好处是不会出现一排401的情况，比方说并发需认证的请求时；坏处是麻烦，首先得判断令牌是否过期，其次还要单独标注接口；
            // 因为不想过于复杂，所以这里选用了第一种；
            if (!retrying) {
                retrying = true;
                logger("访问令牌已过期，尝试刷新令牌.");
                try {
                    const refreshResp = await refresh({ refreshToken });
                    if (refreshResp?.code === 0) {
                        logger("刷新成功，将重新发起请求.");
                        const payload = {
                            data: { ...refreshResp.data }
                        };
                        store.userStore.cache(payload);
                        release(true);
                        return service(resp.config);
                    }
                    else {
                        logger("刷新失败：" + (refreshResp.message || ""), 'error');
                    }
                }
                catch (error) {
                    logger(["刷新失败：", error], 'error');
                }
                finally {
                    retrying = false;
                }
            }
            else {
                logger("等待刷新令牌：" + resp.config.url);
                return new Promise((resolve, reject) => {
                    queue.push((ok) => {
                        // 请求成功
                        if (ok) {
                            resolve(service(resp.config));
                        }
                        else {
                            reject("refreshing failure.");
                        }
                    });
                });
            }
            break;
        case 40198:
        case 40199:
            notice(1, resp);
            logger("刷新令牌已过期，需重新登录：" + getAppStore().refreshToken);
            getAppStore().userStore.cache({ data: { refreshToken: "" } });
            break;
        default:
            logger("未知处理的错误：" + (data.message || ""), 'error');
            notice(2, resp);
    }
    release(false);
    return data;
}

// request interceptor
service.interceptors.request.use(baseUrlInterceptor);
service.interceptors.request.use(silenceInterceptor);
service.interceptors.request.use(tokenInterceptor);
service.interceptors.request.use(loggerInterceptor);

// response interceptor
service.interceptors.response.use(
    response => {
        return respHandler(response) || {};
    },
    error => {
        logger(['请求错误：', error], 'error');
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
                logger("第" + current + "次重发中...");
                typeof error.config.configHandler === "function" && error.config.configHandler();
                return service(error.config);
            }
            logger("[" + error.config.url + "] 请求失败，总次数为：" + maxRetryingCount);
            release(false);
        }
        else if (message === 'Network Error') {
            logger("网络错误，请检查网络设置.");
            router.push('/error');
        }
        else {
            logger(["错误处理失败：", error]);
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

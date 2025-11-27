// import { CustomException } from "@/exception/CustomException";
import { IDENTITY, PERMISSION_MENU } from "@/constants/general";

// 获取俩数字列表的差集
export function getDifference(c1, c2) {
    // const result = [];
    // for (const c1Item of c1) {
    //     const index = c2.findIndex(c2Item => c2Item === c1Item);
    //     if (index === -1) {
    //         result.push(c1Item);
    //     }
    // }
    return c1.filter(item => !c2.includes(item));
    // return result;
}

export function isPrimitive(value) {
    return (value === null || typeof value !== 'object' && typeof value !== 'function');
}

export const emailRule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;

// 复制属性
export function copyProperties(source, target) {
    for (const key in target) {
        const value = source[key];
        if (!value) {
            continue;
        }
        const type = typeof value;
        switch (type) {
            case "number":
            case "string":
            case "boolean":
                target[key] = value;
                break;
            case "object":
                target[key] = JSON.parse(JSON.stringify(value));
                break;
            default:
                target[key] = value;
        }
    }
    return target;
}

/**
 * 延迟函数
 * @param delay 延迟时间(s)
 */
export function timeout(delay) {
    return new Promise(resolve => {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            resolve()
        }, delay * 1000)
    })
}

// 生成驼峰前缀：'/easyblog/admin' -> EasyblogAdmin_
// 用于区分应用
export function getPrefixForStorage(prefix) {
    if (!prefix) {
        return "";
    }

    let _prefix = "";
    for (const item of prefix.split('/')) {
        if (!item) {
            continue;
        }
        _prefix += item.charAt(0).toUpperCase() + item.slice(1);
    }
    return _prefix + "_";
}

/**
 * 执行拦截器链【_run2同理】
 * @param {Array} interceptors 拦截器列表
 * @param {Array} args 被拦截方法的参数列表
 * @param {Object} _this 绑定的this
 * @param {Array} errors 错误信息列表
 * @returns {Number}
 */
//  const _run = async (interceptors, args, _this, errors) => {
//     let continued;
//     for (const interceptor of interceptors) {
//         if (!interceptor.isPreHandleFunction) {
//             continue;
//         }
//         continued = await interceptor.preHandle({ args, _this, interceptor, errors });
//         if (continued === 0) {
//             break;
//         }
//     }
//     return continued;
// }

// const _run2 = (interceptors, args, _this) => {
//     for (let i = interceptors.length - 1; i >= 0; i--) {
//         const interceptor = interceptors[i];
//         if (!interceptor.isPostHandleFunction) {
//             continue;
//         }
//         interceptor.postHandle({ args, _this, interceptor });
//     }
// }

// 出现异常时，进行'回滚'；
// 如在preHandle修改了某些状态之后，发生错误时，在rollback进行'回滚'；
// const _run3 = (interceptors, args, _this) => {
//     for (const interceptor of interceptors) {
//         if (!interceptor.isRollbackFunction) {
//             continue;
//         }
//         interceptor.rollback({ args, _this, interceptor });
//     }
// }

/**
 * 为指定的方法/函数应用拦截器；
 * 需要注意的是，如果要读取this的属性，则需要自行绑定this；
 * 此方法会对所有的方法做异步处理；
 * 拦截器的preHandle()如果返回了0，不再继续往下执行；
 * @param {Function} fn 被包装的方法/函数
 * @param {Array.<{preHandle: Function, postHandle: Function, rollback: Function, group: Number}>} interceptors - 拦截器数组
 * @param {Object} options 其他
 * @param {Function} options.isPass 判断执行结果是否通过
 * @returns {Function}
 */
// export const applyingInterceptors = (fn, interceptors = [], options = {}) => {
//     const { isPass } = options;
//     const group1 = [];
//     const group2 = [];
//     const isPassFunction = typeof isPass == 'function';
//     // 对所有的拦截器进行初始化
//     for (const interceptor of interceptors) {
//         if (!interceptor.group || interceptor.group === 1) {
//             group1.push(interceptor);
//         }
//         else if (interceptor.group === 2) {
//             group2.push(interceptor);
//         }
//         interceptor.isPreHandleFunction = typeof interceptor.preHandle == 'function';
//         interceptor.isPostHandleFunction = typeof interceptor.postHandle == 'function';
//         interceptor.isRollbackFunction = typeof interceptor.rollback == 'function';
//     }
//     return async function (...args) {
//         const errors = [];
//         let _this = this;
//         // 执行_run()时，如果返回了0，则表示不再继续往下执行；
//         let continued = await _run(group1, args, _this, errors);
//         if (errors.length) {
//             throw new CustomException('执行过程出现错误', errors);
//         }
//         let result;
//         try {
//             if (continued === 0) {
//                 return;
//             }
//             continued = await _run(group2, args, _this, errors);
//             if (continued === 0) {
//                 return;
//             }
//             result = await fn.apply(_this, args);
//             // 如果调用fn()没有出现异常，或者isPass()返回true，则调用_run2，即postHandle；
//             if (isPassFunction && result && !isPass(result)) {
//                 throw new Error('执行结果校验不通过；result=' + (JSON.stringify(result)));
//             }
//             else {
//                 _run2(group2, args, _this);
//                 _run2(group1, args, _this);
//             }
//
//         } catch (e) {
//             console.log(e);
//             console.log("[applyingInterceptors]执行方法/函数出现异常：" + e.message);
//             // 如果调用fn()出现异常，则调用_run3，即rollback；
//             _run3(group1, args, _this);
//             _run3(group2, args, _this);
//         }
//         return result;
//     }
// }

/**
 * [在url参数处]为图片添加项目标识
 * @param {String} path 
 */
export function addIdentityForImagePath(path) {
    if (path.includes(IDENTITY)) {
        return path;
    }
    if (path.lastIndexOf('?') === -1) {
        return `${path}?${IDENTITY}`;
    }
    return `${path}&${IDENTITY}`;
}

/**
 * 创建基于用户的菜单【404页面需要在最后添加】
 * 关于【菜单】的一个注意点：项目采用【若某个用户拥有某个页面的权限，则说明其同时拥有获取该页面下所有数据的权限】，以此来减少分配角色权限时的繁杂度
 * @param {Array} routes 动态路由
 * @param {Array} menuList 用户菜单权限
 * @returns {*[]}
 */
export function makeUserRoutes(routes, menuList) {
    const _routes = [];
    for (const route of routes) {
        // 用于前端开发新页面时，没有分配权限的情况
        // if (route.temporary) {
        //     _routes.push(route);
        //     continue;
        // }
        let menu = null;
        // 如果未标注value属性，则将其看作是常规路由
        if (route.value && !(menu = menuList.find((item) => item.value === route.value))) {
            continue;
        }

        // 目前只用到了【name这个属性】，如有需要，可继续使用其他属性，或者拓展「extra属性」
        if (menu) {
            route.meta.title = menu.name;
            route.value = menu.value;
        }

        // 若存在子路由，则继续匹配；
        if (route.children && route.children.length > 0) {
            route.children = makeUserRoutes(
                route.children,
                menuList
            );
        }
        _routes.push(route);
    }
    return _routes;
}

/**
 * 生成权限树结构
 * @param {Array<Object>} permissionList
 * @returns {Array<Object>}
 */
export function generateTree(permissionList) {
    const tree = [];
    if (!permissionList.length) {
        return tree;
    }
    for (let item of permissionList) {
        if (item.type !== PERMISSION_MENU) {
            continue;
        }
        // 截止目前为止，权限数据里只有一个引用类型，其他均基本类型
        const { children, ...rest } = item;
        if (children && children.length) {
            rest.children = generateTree(children);
        }
        tree.push(rest);
    }
    return tree;
}

export function readFileContent(file, type = 'text') {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const result = e.target.result;
            resolve(result);
        };
        
        reader.onerror = function() {
            reject(new Error(`无法读取文件: ${file.name}`));
        };
        
        switch (type) {
            case 'text':
                reader.readAsText(file);
                break;
            case 'dataURL':
                reader.readAsDataURL(file);
                break;
            case 'binary':
                reader.readAsBinaryString(file);
                break;
            case 'arrayBuffer':
                reader.readAsArrayBuffer(file);
                break;
        }
    });
}

// 去除markdown标签
export function removeMarkdownTags(content) {
    if (!content) return '';
    let result = content;
    // 专门处理图片标记
    const imagePatterns = [
        /!\[[^\]]*\]\([^)]*\)/g,  // ![alt](url)
        /!\[[^\]]*\]/g,           // ![alt]（没有URL）
        /!\[\]\([^)]*\)/g,        // ![](url)（没有alt文本）
        /!\[\]/g,                 // ![]（空的）
    ];
    imagePatterns.forEach(pattern => {
        result = result.replace(pattern, '');
    });
    // 其他处理保持不变
    return result
        .replace(/^#+\s+/gm, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*>\s+/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1')
        .replace(/~~~[\s\S]*?\n([\s\S]*?)~~~/g, '$1')
        .replace(/^\s*[*\-_]{3,}\s*$/gm, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// 如果内容不是以#开头时，跳过
export function extractMarkdownTitle(content) {
    if (!content) return null;
    
    const lines = content.trim().split('\n');
    const title = lines[0].trim();
    
    // 只检查第一行是否以 # 开头
    const titleRegex = /^#{1,3}\s+(.+)$/;
    const match = title.match(titleRegex);
    return match ? {
        raw: match[0],
        pure: match[1]
    } : null;
}
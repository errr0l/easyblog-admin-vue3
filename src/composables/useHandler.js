/**
 * 函数(方法)增强处理模块；函数(方法)增强处理模块；默认将函数当做异步函数处理
 * @param {Function} func
 * @param {Array<Function>} preHandlers 前置处理器（默认同步函数，有需要时再进行拓展）
 * @param {Array<Function>} postHandlers 后置处理器
 * @returns {(function(...[*]))|*}
 */
export function useHandler({ func, preHandlers = [], postHandlers = [] }) {
    return async (...args) => {
        for (let handler of preHandlers) {
            handler.apply(this, args);
        }
        const result = await func.apply(this, args);
        for (let handler of postHandlers) {
            handler.apply(this, result);
        }
        return result;
    }
}
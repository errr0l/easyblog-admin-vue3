/**
 * 函数(方法)增强处理模块；函数(方法)增强处理模块；默认将函数当做异步函数处理
 * @param {Function} func
 * @param {Array<Function>} preHandlers 前置处理器
 * @param {Array<Function>} postHandlers 后置处理器
 * @returns {(function(...[*]))|*}
 */
export const INTERRUPTED = 1;
export function useHandler({ func, preHandlers = [], postHandlers = [] }) {
    return async (...args) => {
        for (let handler of preHandlers) {
            // 可为处理器添加_async属性，以异步运行
            const result = handler._async ? await handler.apply(this, args) : handler.apply(this, args);
            if (result === INTERRUPTED) {
                return { code: INTERRUPTED, message: handler.message || '已中断执行' };
            }
        }
        const result = await func.apply(this, args);
        for (let handler of postHandlers) {
            handler._async ? await handler.apply(this, result) : handler.apply(this, result);
        }
        return result;
    }
}
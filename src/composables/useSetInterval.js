import { ref } from "vue";

/**
 * 定时器处理模块；
 * @returns {{timer: Ref<UnwrapRef<number>, UnwrapRef<number> | number>, start: Function, clear: Function}}
 */
export function useSetInterval() {
    const timer = ref(0);
    /**
     * 运行
     * @param {Function} callback 回调
     * @param {Number} delay 间隔
     */
    function start(callback, delay = 1000) {
        timer.value = setInterval(callback, delay);
    }

    function clear() {
        clearInterval(timer.value);
    }

    return { timer, start, clear };
}
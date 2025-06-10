import { ref } from "vue";

/**
 * 定时器处理模块；
 * @param callback
 * @param delay
 * @returns {{timer: [null] extends [Ref] ? IfAny<null, Ref<null>, null> : Ref<UnwrapRef<null>, UnwrapRef<null> | null>, clear: clear}}
 */
export function useSetInterval() {
    const timer = ref(null);

    function start(callback, delay = 1000) {
        timer.value = setInterval(callback, delay);
    }

    function clear() {
        clearInterval(timer.value);
    }

    return { timer, start, clear };
}
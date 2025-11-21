import { onMounted, onUnmounted, ref, isRef } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { ElMessageBox } from "element-plus";
import { isPrimitive } from "@/utils/common";

// 表单提示处理模块；
export function useReminder(o1, o2, keysChecked = []) {
    const skipComparison = ref(false);
    const message = "内容尚未保存，改动部分将会被丢弃，是否继续？";
    /**
     * 比较对象属性
     * @param {Object} o1
     * @param {Object|Reactive<Object>|Ref<Object>} o2
     * @returns {number}
     */
    function compare(o1, o2) {
        if (isRef(o2)) {
            o2 = o2.value;
        }
        const equal = 0;
        const notEqual = -1;
        // 跳过比较；比如，已经提交保存了的情况下
        if (skipComparison.value) {
            return equal;
        }
        for (let key of keysChecked.length ? keysChecked : Object.keys(o1)) {
            const val = o1[key];
            if (isPrimitive(val)) {
                if (val !== (o2[key] || "")) {
                    return notEqual;
                }
            }
            else if (JSON.stringify(val) !== JSON.stringify(o2[key])) {
                return notEqual;
            }
        }
        return equal;
    }

    function hasChanged() {
        return compare(o1, o2) === -1;
    }

    function beforeUnloadHandler(e) {
        // const r = compare(o1, o2);
        if (hasChanged()) {
            e.preventDefault();
            e.returnValue = message;
            return e.returnValue;
        }
    }

    function alert(next) {
        ElMessageBox.confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            next();
        }).catch(() => {
            next(false);
        });
    }

    onMounted(() => {
        window.addEventListener('beforeunload', beforeUnloadHandler);
    });

    onUnmounted(() => {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
    });

    onBeforeRouteLeave((to, from, next) => {
        // const r = compare(o1, o2);
        if (!hasChanged()) {
            next();
        }
        else {
            alert(next);
        }
    });

    return { compare, skipComparison, hasChanged };
}
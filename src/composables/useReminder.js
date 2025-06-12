// 表单提示处理模块；
import { onMounted, onUnmounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { ElMessageBox } from "element-plus";

export function useReminder({ keysChecked = [], original, formData }) {
    const skipComparison = ref(false);
    const message = "内容尚未保存，改动部分将会被丢弃，是否继续？";
    // 判断是否为基本类型
    function isPrimitive(value) {
        return (value === null || typeof value !== 'object' && typeof value !== 'function');
    }
    function compare(o1, o2) {
        const equal = 0;
        const notEqual = -1;
        // 跳过比较；比如，已经提交保存了的情况下
        if (skipComparison.value) {
            return equal;
        }
        for (let key of keysChecked) {
            const val = o1[key];
            if (isPrimitive(val)) {
                if (val !== o2[key]) {
                    return notEqual;
                }
            }
            else if (JSON.stringify(val) !== JSON.stringify(o2[key])) {
                return notEqual;
            }
        }
        return equal;
    }

    function beforeUnloadHandler(e) {
        const r = compare(formData, original);
        if (r === 0) {
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
        const r = compare(formData, original);
        if (r === 0) {
            next();
        }
        else {
            alert(next);
        }
    });

    return { compare, skipComparison };
}
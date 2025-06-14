import { INTERRUPTED, useHandler } from "@/composables/useHandler";
import { sendEmailCode as _ } from "@/api/auth";
import { ElMessage } from "element-plus";
import { ref } from "vue";

export function useSendEmailCode({ formData, preHandlers = [] }) {
    const BTN_TEXT = "获取验证码";
    const CD = 30;
    const btnText = ref(BTN_TEXT);
    const cd = ref(CD);
    async function sendEmailCode() {
        preHandlers.push(limit);
        const resp = await useHandler({ func: _, preHandlers })(formData);
        if (resp?.code === 0) {
            ElMessage.success("发送成功，请注意查收.");
        }
    }

    // 限制按钮；在倒计时结束前不可用
    function limit() {
        if (cd.value !== CD) {
            limit.message = "请稍后重试."; // 有点那啥
            return INTERRUPTED;
        }
        let timer = setInterval(() => {
            cd.value = cd.value - 1;
            btnText.value = `${cd.value}秒后重试`;
            if (cd.value === 0) {
                cd.value = CD;
                btnText.value = BTN_TEXT;
                clearInterval(timer);
            }
        }, 1000);
    }

    return { sendEmailCode, btnText };
}
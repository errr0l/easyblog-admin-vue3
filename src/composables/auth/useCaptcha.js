import { getCaptcha as _ } from "@/api/captcha";
import { reactive } from "vue";

export function useCaptcha() {
    const captcha = reactive({});
    async function getCaptcha() {
        const resp = await _();
        if (resp?.code === 0) {
            Object.assign(captcha, resp.data);
        }
    }

    function refresh() {
        getCaptcha();
    }

    return { getCaptcha, refresh, captcha };
}
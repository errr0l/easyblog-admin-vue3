import { reactive, ref } from "vue";
import { getCaptcha as getCaptchaApi } from "@/api/account";

export function useCaptcha() {

    const captcha = reactive({
        uuid: "",
        image: ""
    });
    const loading = ref(false);
    async function getCaptcha() {
        try {
            loading.value = true;
            const resp = await getCaptchaApi();
            if (resp?.code === 0) {
                Object.assign(captcha, resp.data);
            }
        }
        finally {
            loading.value = false;
        }
    }

    function refresh() {
        getCaptcha();
    }

    return { getCaptcha, refresh, captcha, loading };
}
import { oauth2Register as _ } from "@/api/auth"
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useHandler } from "@/composables/useHandler";

// 目前只有这种方式（且也不打算添加）
export function useOauth2Register({ formData, preHandlers }) {
    const router = useRouter();
    async function register() {
        const resp = useHandler({ func: _, preHandlers })(formData);
        // const resp = await _(formData);
        if (resp?.code === 0) {
            ElMessage.success("注册成功，请等待审核");
            toLogin();
        }
        else {
            ElMessage.error(resp?.message || "注册失败.");
        }
    }

    function toLogin() {
        router.push("/login");
    }

    return { register, toLogin };
}
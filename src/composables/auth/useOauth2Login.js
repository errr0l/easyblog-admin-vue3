import { oauth2Login as _ } from "@/api/auth";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app";

export function useOauth2Login() {
    const router = useRouter();
    const route = useRoute();
    const appStore = useAppStore();
    const dialogVisible = ref(false);
    const error = ref("");
    const description = ref("");
    const type = ref("error");
    const redirect = ref("");
    // 这个接口会比较花时间：前端请求接口后，接口服务器需要再请求接口
    async function login(code) {
        const resp = await _({ code });
        if (resp?.code === 0) {
            // 如果没有返回令牌，表示该用户未注册
            const respData = resp.data;
            if (!respData.accessToken) {
                sessionStorage.setItem('userinfo', JSON.stringify(respData.baseInfo));
                return router.replace("/register?from=oauth&code=" + code);
            }
            // 登陆成功
            else {
                ElMessage.success("登陆成功");
                router.push({ path: redirect.value || '/' });
                const { baseInfo: user, ...rest } = resp.data;
                appStore.userStore.cache({ data: { ...rest, user } });
                return;
            }
        }
        if (resp?.code === 40102) {
            type.value = "warning";
        }
        error.value = resp.message || "服务器开了小差。。";
        dialogVisible.value = true;
    }

    onMounted(() => {
        const { error: _error, error_description: _description, code, redirect: _redirect } = route.query;
        redirect.value = _redirect;
        if (_error) {
            dialogVisible.value = true;
            error.value = _error;
            description.value = _description;
        }
        else if (code) {
            login(code);
        }
        else {
            dialogVisible.value = true;
            error.value = "授权码不能为空";
        }
    });

    return { login, error, description, type, dialogVisible };
}
import { login as _ } from "@/api/account";
import { ElMessage } from "element-plus";
import { useAppStore } from "@/store/app";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

export function useLogin({ formData = {} } = {}) {
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);

    async function login() {
        if (!formData.username || !formData.password) {
            return ElMessage.error("账号或密码不能空");
        }
        if (!formData.captcha) {
            return ElMessage.error("验证码不能空");
        }
        loading.value = true;
        const resp = await _(formData).finally(() => {
            loading.value = false;
        });
        if (resp?.code === 0) {
            ElMessage.success("登陆成功");
            router.push({ path: route.query.redirect || '/' });
            const { baseInfo: user, ...rest } = resp.data;
            appStore.userStore.cache({ data: { ...rest, user } });
        }
    }

    function toLogin() {
        const redirect = route.fullPath;
        router.replace(`/login?redirect=${redirect}`);
    }

    return { loading, login, toLogin };
}
import { logout as _ } from "@/api/account";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";

export function useLogout() {
    const userStore = useUserStore();
    const router = useRouter();
    function logout() {
        ElMessageBox.confirm("确认登出系统？", "提示")
            .then(async () => {
                await _();
                userStore.logout();
                router.push(`/login`);
            }).catch(() => {
            });
    }

    return { logout };
}
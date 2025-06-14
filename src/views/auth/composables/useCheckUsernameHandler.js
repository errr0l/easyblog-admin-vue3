import { ElMessage } from "element-plus";
import { INTERRUPTED } from "@/composables/useHandler";
import { useCheckUsername } from "@/composables/auth";

export function useCheckUsernameHandler() {
    const { checkUsername: _ } = useCheckUsername();
    async function checkUsername({ username }) {
        const existed = await _(username);
        if (existed) {
            ElMessage.warning("用户名已经存在");
            return INTERRUPTED;
        }
    }
    checkUsername._async = true;

    return { checkUsername };
}
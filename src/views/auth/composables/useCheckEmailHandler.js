import { emailRule } from "@/utils/common";
import { ElMessage } from "element-plus";
import { INTERRUPTED } from "@/composables/useHandler";
import { useCheckEmail } from "@/composables/auth";

export function useCheckEmailHandler() {
    const { checkEmail: _ } = useCheckEmail();
    async function checkEmail(formData) {
        const { email } = formData;
        let message = "";
        if (!email) {
            message += "邮箱不能为空；";
        }
        else {
            if (!emailRule.test(email)) {
                message += "邮箱格式不正确；";
            }
        }
        if (message) {
            ElMessage.warning(message);
            return INTERRUPTED;
        }
        const existed = await _(email);
        if (existed) {
            ElMessage.warning("邮箱已经被使用.");
            return INTERRUPTED;
        }
    }
    checkEmail._async = true;

    return { checkEmail };
}
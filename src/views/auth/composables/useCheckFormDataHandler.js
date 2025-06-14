import { emailRule } from "@/utils/common";
import { ElMessage } from "element-plus";
import { INTERRUPTED } from "@/composables/useHandler";

export function useCheckFormDataHandler() {
    function checkFormData(formData) {
        let message = "";
        const { username, password, password2, captcha, email } = formData;
        if (!username) {
            message += "账号不能为空；";
        }
        if (!password || !password2) {
            message += "（二次）密码不能为空；";
        }
        else {
            if (password && password2 && (password !== password2)) {
                message += "二次密码输入不正确；";
            }
        }
        if (!email) {
            message += "邮箱不能为空；";
        }
        else {
            if (!emailRule.test(email)) {
                message += "邮箱格式不正确；";
            }
        }
        if (!captcha) {
            message += "验证码不能为空；";
        }
        if (message) {
            ElMessage.warning(message);
            return INTERRUPTED;
        }
    }

    return { checkFormData };
}
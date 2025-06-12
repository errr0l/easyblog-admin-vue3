import { updatePassword as _ } from "@/api/user";
import { ElMessage } from "element-plus";
import { useHandler } from "@/composables/useHandler";

export function useUpdatePassword({ formData, preHandlers, postHandlers }) {

    const sameValidator = (rule, value, callback) => {
        if (value !== formData.password) {
            callback(new Error('两次输入密码不一致!'));
        }
        else {
            callback();
        }
    };
    const rules = {
        password: [
            { required: true, message: '密码不能为空', trigger: '' },
        ],
        confirmation: [
            { required: true, message: '确认密码不能为空', trigger: '' },
            { validator: sameValidator, trigger: 'blur' }
        ],
    };

    async function updatePassword() {
        const resp = await useHandler({ func: _, preHandlers, postHandlers })(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
        }
    }

    return { updatePassword, rules };
}
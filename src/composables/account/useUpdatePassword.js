import { updatePassword as _ } from "@/api/account";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";

export function useUpdatePassword() {
    const defaultFormData = {
        original: "",
        password: "",
        confirmation: ""
    };
    const formData = reactive({ ...defaultFormData });
    const sameValidator = (rule, value, callback) => {
        if (value !== formData.password) {
            callback(new Error('两次输入密码不一致!'));
        }
        else {
            callback();
        }
    }
    const rules = {
        original: [
            { required: true, message: '初始密码不能为空', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        confirmation: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: sameValidator, trigger: 'blur' }
        ],
    };

    const formRef = ref(null);

    async function updatePassword() {
        formRef.value?.validate(async (valid) => {
            if (!valid) {
                return false;
            }
            const resp = await _(formData);
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                Object.assign(formData, { ...defaultFormData });
            }
        });
    }

    return { updatePassword, formData, rules, formRef };
}
<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <el-form ref="formRef" :model="passwordFormData" :rules="rules" label-width="80px" size="small" style="width: 40%;">
                <el-form-item label="原始密码" required prop="original">
                    <el-input v-model="passwordFormData.original" placeholder="请输入" type="password" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="新密码" required prop="password">
                    <el-input v-model="passwordFormData.password" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item label="确认密码" required prop="confirmation">
                    <el-input v-model="passwordFormData.confirmation" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="updatePassword">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script setup>
// import { useUpdatePassword } from "@/composables/account";
// import { useAccount } from "../../composables/useAccount";
import { reactive, ref } from "vue";
import * as accountApi from "@/api/account";
import { ElMessage } from "element-plus";

const sameValidator = (rule, value, callback) => {
    if (value !== passwordFormData.password) {
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

const defaultPasswordFormData = {
    original: "",
    password: "",
    confirmation: ""
};
const passwordFormData = reactive({ ...defaultPasswordFormData });
const passwordFormRef = ref(null);
async function updatePassword() {
    passwordFormRef.value?.validate(async (valid) => {
        if (!valid) {
            return false;
        }
        const resp = await accountApi.updatePassword(passwordFormData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            // 重置
            Object.assign(passwordFormData, { ...defaultPasswordFormData });
        }
    });
}
</script>
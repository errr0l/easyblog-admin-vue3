<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" size="small" style="width: 40%;">
                <el-form-item label="原始密码" required prop="original">
                    <el-input v-model="formData.original" placeholder="请输入" type="password" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="新密码" required prop="password">
                    <el-input v-model="formData.password" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item label="确认密码" required prop="confirmation">
                    <el-input v-model="formData.confirmation" placeholder="请输入" type="password" />
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
import { useAccount } from "../../composables/useAccount";

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
const { updatePassword, passwordFormData: formData, passwordFormRef: formRef } = useAccount();
// const { updatePassword, formData, rules, formRef } = useUpdatePassword();
</script>
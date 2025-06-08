<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <el-form ref="elForm" :model="formData" :rules="rules" label-width="80px" size="mini" style="width: 40%;">
                <el-form-item label="原始密码" required prop="original">
                    <el-input v-model="formData.original" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item label="密码" required prop="password">
                    <el-input v-model="formData.password" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item label="确认密码" required prop="confirmation">
                    <el-input v-model="formData.confirmation" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="updatePassword">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import { updatePassword } from "@/api/account";

const defaultFormData = {
    original: "",
    password: "",
    confirmation: ""
};

export default {
    data() {
        const sameValidator = (rule, value, callback) => {
            if (value !== this.formData.password) {
                callback(new Error('两次输入密码不一致!'));
            }
            else {
                callback();
            }
        }
        return {
            formData: { ...defaultFormData },
            rules: {
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
            }
        }
    },
    methods: {
        updatePassword() {
            this.$refs.elForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const resp = await updatePassword(this.formData);
                if (resp.code === 0) {
                    this.formData = { ...defaultFormData };
                    this.$message.success("操作成功");
                }
            });
        }
    }
}
</script>

<style lang="scss">
</style>
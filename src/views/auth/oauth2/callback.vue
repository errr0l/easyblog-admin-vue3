<template>
    <div class="app-container my-app-container" style="height: 100vh;">
        <el-dialog v-model="dialogVisible" title="授权失败" width="40%" class="x-el-dialog styl-1" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
            <div style="margin-bottom: 20px;">
                <el-alert
                    :title="error"
                    :description="description" show-icon :closable="false"
                    :type="type">
                </el-alert>
            </div>
            <div style="text-align: right;">
                <el-button type="primary" size="small" @click="back2Login">返回登录</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { useOauth2Login } from "@/composables/auth";
import { useRouter } from "vue-router";

const { dialogVisible, error, description, type } = useOauth2Login();

const router = useRouter();

function back2Login() {
    router.replace('/login');
}
</script>

<style lang="scss" scoped>
    .ul {
        li {
            margin-bottom: 20px;
        }
    }
</style>
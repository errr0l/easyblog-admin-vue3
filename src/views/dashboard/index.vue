<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-3" style="position: relative;">
            <div slot="header" style="font-size: 20px; color: #606266;">
                <span v-if="userDetails.username">
                    {{ `欢迎回来，${userDetails.username}，现在要开始码文章了吗？` }}
                </span>
                <span v-else @click="handleLogin" style="cursor: pointer;">
                    {{ '请先登录' }}
                </span>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { useAccount } from "@/composables/useAccount";
import { toLogin } from "@/utils/request";
const { userDetails } = useAccount();

const handleLogin = () => {
    toLogin("/");
};
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>

<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-3" style="position: relative;">
            <div slot="header" style="font-size: 20px; color: #606266;">
                {{ message }}
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const message = computed(() => {
    return userStore.user.username ? `欢迎回来，${userStore.user.username}，现在要开始码文章了吗？` : '请先登录';
});
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

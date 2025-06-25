<template>
    <div style="padding: 20px;">
        <div class="title" style="margin-bottom: 10px;">系统开了小差，可尝试刷新页面</div>
        <div style="margin-bottom: 10px" v-if="code">{{ code }}</div>
        <div style="margin-bottom: 10px" v-if="message">{{ message }}</div>
        <div style="cursor: pointer;" @click="back">返回</div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const { code, message } = route.query;

function back() {
    router.replace("/");
}
</script>

<style scoped>
.title {
    color: var(--el-color-primary);
    font-size: 18px;
}
</style>


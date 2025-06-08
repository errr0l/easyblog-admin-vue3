<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-3" style="position: relative;">
            <div slot="header" style="font-size: 20px; color: #606266;">
                欢迎回来，{{user.username}}，现在要开始码文章了吗？
            </div>
        </el-card>
    </div>
</template>

<script>

import { defineComponent } from "vue";
import { useUserStore } from "../../store/user";

export default defineComponent({
    name: "Dashboard",
    data() {
        return {
            userStore: useUserStore()
        }
    },
    created() {
        this.user = this.userStore.user;
    },
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

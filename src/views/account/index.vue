<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-1">
            <template #header>
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input value="编辑信息" class="x-el-input-b-none" readonly>
                            <i class="el-icon-edit el-input__icon" style="color: #606266;" slot="prefix"></i>
                        </el-input>
                    </div>
                    <div class="acts">
                        <el-button type="primary" size="small" @click="updateAccountInfo">保存</el-button>
                    </div>
                </div>
            </template>
            <div style="overflow-y: auto;">
                <el-form :model="formData" label-width="80px" size="small">
                    <el-form-item label="头像">
                        <el-upload
                            action=""
                            class="avatar-uploader"
                            :http-request="updateAvatar"
                            :show-file-list="false"
                            :on-success="onSuccess">
                            <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                    </el-form-item>
                    <el-form-item label="用户名" style="width: 40%;">
                        <el-input v-model="formData.username" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="邮箱" style="width: 40%;">
                        <el-input v-model="formData.email" disabled />
                    </el-form-item>
                    <el-form-item label="个人介绍">
                        <MdEditor v-model="formData.introduction" style="flex: 1;" @onUploadImg="onUploadImg" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { useAccountInfo, useUpdateAvatar, useUpdateAccountInfo } from "@/composables/account";
import { useReminder } from "@/composables/useReminder";
import { onMounted, reactive, ref } from "vue";
import { MdEditor } from 'md-editor-v3';
import "md-editor-v3/lib/style.css";
import { useMarkdownEditor } from "@/composables/useMarkdownEditor";
import { addIdentityForImagePath } from "@/utils/common";

const defaultFormData = {
    username: "",
    email: "",
    introduction: "",
    avatar: ""
};
const formData = reactive({ ...defaultFormData });
const { queryAccountInfo, original } = useAccountInfo({ formData });

const { compare } = useReminder({ original: original, formData, keysChecked: Object.keys(defaultFormData) });
const { updateAvatar, onSuccess } = useUpdateAvatar({ formData, original });

const image = ref("");
const { createOnUploadImg } = useMarkdownEditor();
const onUploadImg = createOnUploadImg({
    path: image,
    pathHandler: addIdentityForImagePath,
    type: 2
});
const { updateAccountInfo } = useUpdateAccountInfo({
    formData, refresh: queryAccountInfo, compare, original
});

onMounted(() => {
    queryAccountInfo();
});
</script>

<style lang="scss" scoped>
.x-el-card-table {
    .el-card__body {
        padding-top: 40px;
        padding-left: 0;
    }
}
</style>
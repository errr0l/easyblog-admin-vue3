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
                <el-form :model="accountFormData" label-width="80px" size="small">
                    <el-form-item label="头像">
                        <el-upload
                            action=""
                            class="avatar-uploader"
                            :http-request="updateAvatar"
                            :show-file-list="false"
                            :on-success="onSuccess">
                            <img v-if="accountFormData.avatar" :src="accountFormData.avatar" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="用户名" style="width: 40%;">
                        <el-input v-model="accountFormData.username" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="邮箱" style="width: 40%;">
                        <el-input v-model="accountFormData.email" disabled />
                    </el-form-item>
                    <el-form-item label="个人介绍">
                        <MdEditor v-model="accountFormData.introduction" style="flex: 1;" @onUploadImg="onUploadImg" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { useAccount } from "@/composables/useAccount";
import { onMounted, reactive, ref } from "vue";
import { MdEditor } from 'md-editor-v3';
import "md-editor-v3/lib/style.css";
import { useMarkdownEditor } from "@/composables/useMarkdownEditor";
import { addIdentityForImagePath } from "@/utils/common";
import { getAccountInfo as getAccountInfoApi } from "@/api/account";
import { ElMessage } from "element-plus";
import * as accountApi from "@/api/account";
import { useElUpload } from "@/composables/useElUpload";
import { useReminder } from "@/composables/useReminder";

const { updateUserDetailFromAccountFormData, userDetails } = useAccount();

const defaultAccountFormData = {
    username: "",
    email: "",
    introduction: "",
    avatar: ""
};
const accountFormData = reactive({ ...defaultAccountFormData });
const originalAccountFormData = ref({});

const image = ref("");
const { createOnUploadImg } = useMarkdownEditor();
const onUploadImg = createOnUploadImg({
    path: image,
    pathHandler: addIdentityForImagePath,
    type: 2
});

onMounted(() => {
    queryAccountInfo();
});

async function queryAccountInfo() {
    const resp = await getAccountInfoApi();
    if (resp?.code === 0) {
        // 使用缓存中的头像；更新头像不会清除服务器缓存
        if (resp.data.avatar !== userDetails.value.avatar) {
            resp.data.avatar = userDetails.value.avatar;
        }
        originalAccountFormData.value = resp.data;
        Object.assign(accountFormData, resp.data);
    }
}

const { hasChanged } = useReminder({
    keysChecked: Object.keys(defaultAccountFormData),
    o1: accountFormData,
    o2: originalAccountFormData
});
async function updateAccountInfo() {
    if (!accountFormData.username || !accountFormData.introduction || !accountFormData.email) {
        ElMessage.warning("username、email、introduction不能为空");
        return;
    }
    if (!hasChanged()) {
        ElMessage.success("操作成功")
        return;
    }
    const resp = await accountApi.updateAccountInfo(accountFormData);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        // 因为调用接口后，服务器的数据与当前显示的数据可能不一致（图片路径），所以重新调用接口获取最新数据
        await queryAccountInfo();
        updateUserDetailFromAccountFormData(accountFormData);
    }
}

const { createHttpRequest, onSuccess } = useElUpload();
async function updateAvatar(ctx) {
    const avatar = ref("");
    const httpRequest = createHttpRequest({
        path: avatar,
        postHandler: addIdentityForImagePath,
        type: 2,
    });
    await httpRequest(ctx);
    const resp = await accountApi.updateAvatar({ avatar: avatar.value });
    if (resp?.code === 0) {
        const _imagePath = resp.data.avatar;
        accountFormData.avatar = _imagePath;
        originalAccountFormData.value.avatar = _imagePath;
        // 这个可以使用缓存
        updateUserDetailFromAccountFormData(accountFormData);
    }
}
</script>

<style lang="scss" scoped>
.x-el-card-table {
    .el-card__body {
        padding-top: 40px;
        padding-left: 0;
    }
}
</style>
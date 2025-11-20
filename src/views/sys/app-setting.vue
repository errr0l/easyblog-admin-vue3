<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="auto" size="small" style="width: 40%;">
                <el-form-item label="开启评论" prop="commentable">
                    <el-radio v-model="formData.commentable" :label="0">是</el-radio>
                    <el-radio v-model="formData.commentable" :label="1">否</el-radio>
                </el-form-item>
                <template v-if="formData.commentable === 0">
                    <el-form-item label="客户端id" required>
                        <el-input v-model="formData.gittalk.clientID" placeholder="请输入Github Application clientID" />
                    </el-form-item>
                    <el-form-item label="客户端密钥" required>
                        <el-input v-model="formData.gittalk.clientSecret" placeholder="请输入Github Application clientSecret" />
                    </el-form-item>
                    <el-form-item label="仓库" required>
                        <el-input v-model="formData.gittalk.repo" placeholder="请输入repo" />
                    </el-form-item>
                    <el-form-item label="owner" required>
                        <el-input v-model="formData.gittalk.owner" placeholder="请输入owner" />
                    </el-form-item>
                </template>
                <el-form-item label="显示备案信息" prop="archiveEnabled">
                    <el-radio v-model="formData.archiveEnabled" :label="0">是</el-radio>
                    <el-radio v-model="formData.archiveEnabled" :label="1">否</el-radio>
                </el-form-item>
                <template v-if="formData.archiveEnabled === 0">
                    <el-form-item label="ICP备案号" required>
                        <el-input v-model="formData.icpNo" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="ICP备案域名" required>
                        <el-input v-model="formData.icpDomain" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="ICP备案省份" required>
                        <el-input v-model="formData.icpProvince" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="公安备案号" required>
                        <el-input v-model="formData.psbNo" placeholder="请输入" />
                    </el-form-item>
                </template>
                <el-form-item label="版权信息">
                    <el-input v-model="formData.copyright" placeholder="请输入" />
                </el-form-item>

                <el-form-item label="静态页面">
                    <el-button link size="small" @click="downloadWebsiteZip" :disabled="btnDisabled">下载</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="saveWebSetting">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script setup>
import { useDownloadWebsiteZip, useSaveWebSettings } from "@/composables/app";
import { onMounted, reactive, ref } from "vue";
import request from "@/utils/request";

const defaultFormData = {
    commentable: 0,
    archiveEnabled: 0,
    icpNo: "",
    icpDomain: "",
    icpProvince: "",
    psbNo: "",
    copyright: "",
    gittalk: {
        clientID: "", // 应用id
        clientSecret: "", // 应用密钥
        repo: "", // 仓库
        owner: ""
    }
};

const formData = reactive(JSON.parse(JSON.stringify(defaultFormData)));
const formRef = ref(null);

async function formDataValidator() {
    const valid = await new Promise(resolve => {
        formRef.value?.validate((valid) => {
            resolve(valid);
            if (!valid) {
                return false;
            }
        });
    });
    if (!valid) {
        throw new Error('表单校验未通过');
    }
}
formDataValidator._async = true;

const { rules, saveWebSetting } = useSaveWebSettings({ formData, preHandlers: [formDataValidator] });
const { downloadWebsiteZip, btnDisabled } = useDownloadWebsiteZip();

onMounted(() => {
    queryWebSettings();
});

async function queryWebSettings() {
    const resp = await request({
        url: "/app/webSetting",
        method: "get"
    });
    if (resp?.code === 0) {
        Object.assign(formData, resp.data);
    }
}
</script>
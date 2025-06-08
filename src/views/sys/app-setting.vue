<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <el-form ref="elForm" :model="formData" :rules="rules" label-width="auto" size="mini" style="width: 40%;">
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
                    <el-button type="text" size="mini" @click="downloadWebsiteZip" :disabled="dispabled">下载</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="saveWebSetting">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import request, { tokenInterceptor } from '@/utils/request';
import { copyProperties } from "@/utils/common";
import axios from 'axios';

// 默认情况下，springboot只会按照驼峰接收数据，如果传如'ICPNo'过去，则无法接收到
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

export default {
    data() {
        const archiveValidator = (rule, value, callback) => {
            if (value === 1) {
                return callback();
            }
            const { psbNo, icpProvince, icpDomain, icpNo } = this.formData;

            if (!icpNo || !icpDomain || !icpProvince || !icpNo || !psbNo) {
                return callback(new Error('备案信息不完整'));
            }
            callback();
        }
        const commentableOptsValidator = (rule, value, callback) => {
            if (value === 1) {
                return callback();
            }
            const { clientID, clientSecret, repo, owner } = this.formData.gittalk;
            if (!clientID || !clientSecret || !repo || !owner) {
                return callback(new Error('gittalk配置信息不完整'));
            }
            callback();
        }
        return {
            formData: copyProperties(defaultFormData, {}),
            rules: {
                archiveEnabled: [
                    { validator: archiveValidator, trigger: 'blur' }
                ],
                commentable: [
                    { validator: commentableOptsValidator, trigger: 'blur' }
                ],
            },
            dispabled: false
        }
    },
    created() {
        this.getWebSetting();
    },
    methods: {
        async getWebSetting() {
            const resp = await request({
                url: "/app/webSetting",
                method: "get"
            });
            if (resp.code === 0 && resp.data) {
                this.formData = { ...resp.data };
                if (!this.formData.gittalk) {
                    this.formData.gittalk = { ...defaultFormData.gittalk };
                }
            }
        },
        // 保存网站设置
        saveWebSetting() {
            this.$refs.elForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const resp = await request({
                    url: "/app/webSetting/save",
                    method: "post",
                    data: this.formData
                });
                if (resp.code === 0) {
                    this.$message.success("操作成功");
                }
            });
        },
        // 下载静态页面
        async downloadWebsiteZip() {
            this.dispabled = true;
            const instance = axios.create();
            instance.interceptors.request.use(tokenInterceptor);
            const resp = await instance({
                url: "/app/websiteZip/download",
                method: "get",
                headers: {
                    'Content-Type': "application/json;application/octet-stream",
                },
                responseType: "blob"
            });
            // 如果下载过程中出现错误，将会返回json格式的错误信息
            if (!resp || resp.status !== 200 || resp.headers['content-type'] === 'application/json') {
                this.$message.error('下载失败');
                this.dispabled = false;
                return;
            }

            const blob = new Blob([resp.data], { type: "application/zip" });
            let fileName = "website.zip";
            for (const str of resp.headers['content-disposition'].split(';')) {
                if (str.indexOf('fileName') != -1) {
                    fileName = str.split("=")[1];
                }
            }
            const url = URL.createObjectURL(blob);;
            const a = document.createElement("a");
            a.href = url;
            a.style.display = "none";
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // 移除对象
            a.parentNode.removeChild(a);
            URL.revokeObjectURL(url);

            let timer = setTimeout(() => {
                this.dispabled = false;
                clearTimeout(timer);
            }, 5000);
        }
    }
}
</script>

<style lang="scss">
</style>
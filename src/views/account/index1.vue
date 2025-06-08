<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-1">
            <div slot="header" class="clearfix">
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input value="编辑信息" class="x-el-input-b-none" readonly>
                            <i class="el-icon-edit el-input__icon" style="color: #606266;" slot="prefix"></i>
                        </el-input>
                    </div>
                    <div class="acts">
                        <el-button type="primary" size="mini" @click="updateAccountInfo">保存</el-button>
                    </div>
                </div>
            </div>
            <div style="overflow-y: auto;">
                <el-form :model="formData" label-width="80px" size="mini">
                    <el-form-item label="头像">
                        <el-upload
                            action=""
                            class="avatar-uploader"
                            :http-request="updateAvatar"
                            :show-file-list="false"
                            :on-success="successHandler">
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
                        <Editor
                            :initialValue="formData.introduction"
                            :options="editorOptions"
                            :initialEditType="initialEditType"
                            previewStyle="vertical"
                            ref="tuiEditor"
                            style="border: none;"
                        />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import { uploadMixin } from "@/mixins/upload";
import { uploadImage } from "@/api/file";
import { getAccountInfo, updateAccountInfo, updateAvatar } from "@/api/account";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import { formDataReminder } from "@/mixins/formDataReminder";
import { addIdentityForImagePath } from "@/utils/common";
import { useUserStore } from "../../store/user";

const defaultOptions = {
    minHeight: "500px",
    language: "en-US",
    useCommandShortcut: true,
    usageStatistics: false,
    hideModeSwitch: false,
    toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image", "link"],
        ["code", "codeblock"],
        ["scrollSync"],
    ],
};

const defaultFormData = {
    username: "",
    email: "",
    introduction: "",
    avatar: ""
};

export default {
    mixins: [
        uploadMixin, 
        formDataReminder
    ],
    components: {
        Editor,
    },
    data() {
        return {
            formData: {
                ...defaultFormData
            },
            original: null,
            keysChecked: Object.keys(defaultFormData).filter(item => item !== 'avatar' && item !== 'introduction'),
            // imageParams: {
            //     type: "11"
            // },
            initialEditType: "markdown", // wysiwyg or markdown
            editorOptions: {
                ...defaultOptions
            },
            contentField: 'introduction',
            editorVisible: false, // 防止editor复用组件
            userStore: useUserStore()
        }
    },
    created() {
        this.getAccountInfo();
    },
    methods: {
        async getAccountInfo() {
            const resp = await getAccountInfo();
            if (resp.code === 0) {
                this.formData = { ...resp.data };
                this.original = { ...resp.data };
                this.$refs.tuiEditor.invoke('setMarkdown', this.formData.introduction);
            }
        },
        async imageBlobHook(file, callback) {
            const formData = new FormData();
            formData.append('file', file);
            const resp = await uploadImage(formData, { type: "2" });
            if (resp.code === 0) {
                callback(addIdentityForImagePath(resp.data.path), 'image');
                return;
            }
            return callback('上传失败', 'error');
        },
        async updateAccountInfo() {
            let r = {};
            this.beforeUnloadHandler(r);
            if (!r.returnValue) {
                return this.$message.success("操作成功");
            }
            this.formData.introduction = this.$refs.tuiEditor.invoke('getMarkdown');
            const resp = await updateAccountInfo(this.formData);
            if (resp.code === 0) {
                this.$message.success("操作成功");
                // 因为调用接口后，服务器的数据与当前显示的数据可能不一致（图片路径），所以重新调用接口获取最新数据
                await this.getAccountInfo();
                // this.$store.dispatch('user/cache', { data: { user: this.formData } });
                this.userStore.cache({ data: { user: this.formData } });
            }
        },
        async updateAvatar(ctx) {
            const imagePath = await this.requstHandler(ctx);
            if (imagePath) {
                const resp = await updateAvatar({ avatar: imagePath });
                const _imagePath = resp.data.avatar;
                if (resp.code === 0) {
                    this.formData.avatar = _imagePath;
                    // const user = this.$store.state.user.user;
                    const user = this.userStore.user;
                    user.avatar = _imagePath;
                    // this.$store.dispatch('user/cache', { data: { user } });
                    this.userStore.cache({ data: { user } });
                    this.$message.success("操作成功");
                }
            }
        }
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
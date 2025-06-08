<template>
    <div class="app-container my-app-container article-editor">
        <el-card class="x-el-card-table el-card__body-pd-0 el-card__header-sty-1">
            <div slot="header" class="clearfix">
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input v-model="formData.title" class="x-el-input-b-none" placeholder="请输入标题">
                            <i class="el-icon-edit el-input__icon" style="color: #606266;" slot="prefix"></i>
                        </el-input>
                    </div>
                    <div class="acts">
                        <el-button size="mini" @click="goback">返回</el-button>
                        <template v-if="type === USER">
                            <el-button type="primary" size="mini" @click="dialogVisible = true">保存</el-button>
                            <el-button type="primary" plain size="mini" @click="saveDraft">草稿</el-button>
                        </template>
                        <template v-else-if="type === ADMIN">
                            <el-button type="primary" size="mini" @click="auditingDialogVisible = true">审核</el-button>
                        </template>
                    </div>
                </div>
            </div>
            <Editor
                :initialValue="formData.content"
                :options="editorOptions"
                :height="height"
                :initialEditType="initialEditType"
                previewStyle="vertical"
                ref="tuiEditor"
                style="border: none;"
            />
        </el-card>
        <el-dialog :visible.sync="dialogVisible" title="文章设置" width="40%" class="x-el-dialog styl-1">
            <el-form :model="formData" label-width="80px" size="mini">
                <el-form-item label="分类">
                    <el-select v-model="formData.categoryId" placeholder="请选择">
                        <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio v-model="formData.creationType" :label="0">原创</el-radio>
                    <el-radio v-model="formData.creationType" :label="1">转载</el-radio>
                </el-form-item>
                <el-form-item label="转载地址" v-if="isReprint">
                    <el-input v-model="formData.reprintUrl" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="允许评论">
                    <el-radio v-model="formData.commentable" :label="0">是</el-radio>
                    <el-radio v-model="formData.commentable" :label="1">否</el-radio>
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload
                        action=""
                        class="avatar-uploader"
                        :http-request="requstHandler"
                        :show-file-list="false"
                        :on-success="successHandler">
                        <img v-if="formData.cover" :src="formData.cover" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input v-model="formData.summary" placeholder="请输入（上限为200字符）" :rows="3" type="textarea" :maxlength="200" resize="none" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="formData.sort" style="width: 172px;" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="标签">
                    <el-tag
                        :key="i + '-' + item" size="medium"
                        v-for="(item, i) in tags"
                        :disable-transitions="false"
                        closable
                        @close="removeTagHandler(i)">
                        {{ item }}
                    </el-tag>
                    <el-input
                        v-if="tagInputVisible"
                        v-model="tagInputValue"
                        style="width: 90px;"
                        ref="tagInput"
                        placeholder="请输入(控制在5个以内，标签会作为html的关键词)"
                        @keyup.enter.native="tagHandler"
                        @blur="tagHandler" />
                    <el-button v-else size="mini" @click="showTagInput" icon="el-icon-plus" circle></el-button>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="dialogVisible = false" size="mini">取消</el-button>
                <el-button type="primary" size="mini" @click="saveOrUpdate" v-if="type === USER">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="videoDialogVisible" title="文章设置" width="40%" class="x-el-dialog styl-1">
            <el-form :model="videoFormData" label-width="80px" size="mini">
                <el-form-item label="视频地址">
                    <el-input v-model="videoFormData.url" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="videoDialogVisible = false" size="mini">取消</el-button>
                <el-button type="primary" size="mini" @click="delegation('execAddVideoTag')">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="auditingDialogVisible" title="审核" width="40%" class="x-el-dialog styl-1">
            <el-form :model="auditingFormData" label-width="80px" size="mini">
                <el-form-item label="文章设置">
                    <el-button @click="dialogVisible = true" size="mini" plain type="primary">查看</el-button>
                </el-form-item>
                <el-form-item label="意见">
                    <el-radio v-model="auditingFormData.opinion" :label="OPTION_APPROVAL">通过</el-radio>
                    <el-radio v-model="auditingFormData.opinion" :label="OPTION_REJECTION">不通过</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="auditingFormData.remarks" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="videoDialogVisible = false" size="mini">取消</el-button>
                <el-button type="primary" size="mini" @click="delegation('audit')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import { uploadImage } from "@/api/file";
import * as adminService from "@/api/article";
import * as accountService from '@/api/accountArticle';
import { formDataReminder } from "@/mixins/formDataReminder";
import { USER, ADMIN, OPTION_APPROVAL, OPTION_REJECTION } from "@/constants/general";
import { addIdentityForImagePath } from "@/utils/common";

let save = null;
let update = null;
let getDetail = null;
let saveDraft = null;

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
        ["scrollSync"]
    ],
};

const REPRINT = 1;

const defaultFormData = {
    id: "",
    title: "",
    content: "",
    categoryId: "",
    cover: "",
    summary: "",
    tag: "",
    creationType: 0,
    reprintUrl: "",
    commentable: 0,
    sort: ""
};

const defaultVideoFormData = { url: "" };
const defaultAuditingFormData = { id: "", remarks: "", opinion: OPTION_APPROVAL };
const MARKDOWN = "markdown";
const WYSIWYG = "wysiwyg";

// 由于'account'和'admin'两种不同的用户存在差异，此处将当前组件拆分为对应用户的两个子组件（只是某些调用接口不同）；
// 以[获取文章详情]为例，普通用户可以获取自己的文章，管理员可以获取所有人的文章；
export default {
    mixins: [formDataReminder],
    components: {
        Editor,
    },
    data() {
        return {
            initialEditType: MARKDOWN, // wysiwyg or markdown
            height: "98%",
            editorOptions: {
                ...defaultOptions
            },
            formData: { ...defaultFormData }, original: null,
            dialogVisible: false, categoryList: [],
            tagInputVisible: false, tagInputValue: "",
            tags: [],
            keysChecked: Object.keys(defaultFormData).filter(item => item !== 'content'),
            skipComparison: false, videoDialogVisible: false,
            videoFormData: { ...defaultVideoFormData },
            type: "", USER, ADMIN, auditingFormData: { ...defaultAuditingFormData }, auditingDialogVisible: false,
            OPTION_APPROVAL, OPTION_REJECTION
        }
    },
    computed: {
        isReprint() {
            return this.formData.creationType === REPRINT;
        }
    },
    mounted() {
        if (this.$refs.tuiEditor) {
            const createBtn = () => {
                const button = document.createElement('button');
                button.className = 'toastui-editor-toolbar-icons last';
                button.style.backgroundImage = 'none';
                button.style.margin = '0';
                button.innerHTML = `<i class='el-icon-video-camera' style='font-size: 20px;'></span>`;
                button.addEventListener('click', () => {
                    this.videoDialogVisible = true;
                    this.videoFormData = { ...defaultFormData };
                });
                return button;
            }
            this.$refs.tuiEditor.invoke("insertToolbarItem", { groupIndex: 6, itemIndex: 0 }, {
                tooltip: 'Custom Button',
                el: createBtn()
            });
            
            this.$refs.tuiEditor.editor.addCommand('markdown', 'addVideoTag', (payload) => {
                const { url, height = '100%', width = '100%' } = payload;
                let str = "<video controls autoplay height='" + height + "' width='" + width + "' src='" + url + "'></video>"
                this.$refs.tuiEditor.editor.insertText(str);
                return true;
            });
        }
    },
    created() {
        const { id, type } = this.$route.query;
        this.init(type);
        if (id) {
            this.getDetail(id);
        }
        this.getCategoryList();
    },
    methods: {
        init(type) {
            const service = type === ADMIN ? adminService : accountService;
            save = service.save;
            update = service.update;
            getDetail = service.getDetail;
            saveDraft = service.saveDraft;
            if (type === ADMIN) {
                this.initialEditType = WYSIWYG;
            }
            this.type = type;
        },
        delegation(methodName) {
            this[methodName]();
        },
        async audit() {
            this.auditingFormData.id = this.formData.id;
            const resp = await adminService.audit(this.auditingFormData);
            if (resp.code === 0) {
                this.$message.success("操作成功");
                this.auditingDialogVisible = false;
                this.goback();
            }
        },
        execAddVideoTag() {
            this.$refs.tuiEditor.editor.exec('addVideoTag', this.videoFormData);
            this.videoDialogVisible = false;
        },
        // 调用this.$router.go(-1)时，beforeRouteLeave勾子不正常运行
        goback() {
            const meta = this.$route.meta;
            const activeMenu = meta.activeMenu;
            this.$router.replace(activeMenu ? activeMenu : '/article');
        },
        async requstHandler(ctx) {
            const formData = new FormData();
            formData.append([ctx.filename], ctx.file);
            const resp = await uploadImage(formData, { type: 2 });
            if (resp.code === 0) {
                this.formData.cover = addIdentityForImagePath(resp.data.path);
            }
        },
        successHandler() {
            this.$message.success("上传成功");
        },
        async getCategoryList() {
            const resp = await adminService.getCategoryList();
            if (resp.code === 0) {
                this.categoryList = resp.data;
            }
        },
        async getDetail(id) {
            const resp = await getDetail(id);
            if (resp.code === 0) {
                if (resp.data.creationType) {
                    resp.data.creationType = +resp.data.creationType;
                }
                if (resp.data.commentable) {
                    resp.data.commentable = +resp.data.commentable;
                }
                this.formData = { ...resp.data };
                this.original = resp.data;
                this.$refs.tuiEditor.invoke('setMarkdown', this.formData.content);
                if (this.formData.tag) {
                    this.tags = this.formData.tag.split(',');
                }
            }
        },
        async imageBlobHook(file, callback) {
            const formData = new FormData();
            formData.append('file', file);
            const resp = await uploadImage(formData, { type:  2 });
            if (resp.code === 0) {
                callback(addIdentityForImagePath(resp.data.path), 'image');
                return;
            }
            return callback('上传失败', 'error');
        },
        saveOrUpdate() {
            this.formData.tag = this.tags.join(',');
            this.formData.content = this.$refs.tuiEditor.invoke('getMarkdown');
            if (this.formData.id) {
                this.update();
            }
            else {
                this.save();
            }
        },
        async save() {
            const resp = await save(this.formData);
            if (resp.code === 0) {
                this.$message.success('操作成功');
                this.skipComparison = true;
                this.goback();
            }
        },
        async update() {
            const resp = await update(this.formData);
            if (resp.code === 0) {
                this.$message.success('操作成功');
                // 改变这个变量为true后，不可再停留再当前页面，否则再次改动后，不会进行检测
                this.skipComparison = true;
                this.goback();
            }
        },
        async saveDraft() {
            this.formData.content = this.$refs.tuiEditor.invoke('getMarkdown');
            const resp = await saveDraft(this.formData);
            if (resp.code === 0) {
                this.$message.success('操作成功');
                this.skipComparison = true;
                this.goback();
            }
        },
        removeTagHandler(idx) {
            this.tags.splice(idx, 1);
        },
        tagHandler() {
            let value = this.tagInputValue;
            if (value) {
                this.tags.push(value);
            }
            this.tagInputVisible = false;
            this.tagInputValue = '';
        },
        showTagInput() {
            this.tagInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.tagInput.$refs.input.focus();
            });
        },
    },
};
</script>

<style lang="scss">
.el-tag {
    margin-right: 6px;
}
.article-editor {
    .toastui-editor-defaultUI {
        border: none;
    }
}
</style>

<style lang="scss" scoped>
.article-editor {
    .x-el-input-b-none {
        font-size: 16px;
    }
}
</style>
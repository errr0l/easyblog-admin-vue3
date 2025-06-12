<template>
    <div class="app-container my-app-container article-editor">
        <el-card class="x-el-card-table el-card__body-pd-0 el-card__header-sty-1">
            <template #header>
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input v-model="formData.title" class="x-el-input-b-none x-el-input-padding-left-0" placeholder="请输入标题">
                            <i class="el-icon-edit el-input__icon" style="color: #606266;" slot="prefix"></i>
                        </el-input>
                    </div>
                    <div class="acts">
                        <el-button size="small" @click="back">返回</el-button>
                        <template v-if="type === USER">
                            <el-button type="primary" size="small" @click="settingsDialogVisible = true">保存</el-button>
                            <el-button type="primary" plain size="small" @click="saveDraft">草稿</el-button>
                        </template>
                        <template v-else-if="type === ADMIN">
                            <el-button type="primary" size="small" @click="auditingDialogVisible = true">审核</el-button>
                        </template>
                    </div>
                </div>
            </template>
            <MdEditor v-if="isUser" v-model="formData.content" style="flex: 1;" @onUploadImg="onUploadImg" />
            <MdPreview v-else id="preview-only" :modelValue="formData.content" style="flex: 1; overflow: auto;" />
        </el-card>
        <el-dialog v-model="settingsDialogVisible" title="文章设置" width="40%" class="x-el-dialog styl-1">
            <el-form :model="formData" label-width="80px" size="small">
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
                    <el-radio v-model="formData.creationType" v-for="(value, key) in CREATION_TYPE_CONFIG" :label="+key" :key="key">{{ value.text }}</el-radio>
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
                        :http-request="coverHttpRequest"
                        :show-file-list="false"
                        :on-success="onSuccess">
                        <img v-if="formData.cover" :src="formData.cover" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
                        :key="i + '-' + item"
                        v-for="(item, i) in tags"
                        :disable-transitions="false"
                        closable
                        @close="removeTag(i)" style="margin-right: 5px;">
                        {{ item }}
                    </el-tag>
                    <el-input
                        v-if="tagInputVisible"
                        v-model="tag"
                        style="width: 90px;"
                        ref="tagInput"
                        placeholder="请输入(控制在5个以内，标签会作为html的关键词)"
                        @keyup.enter.native="addTag"
                        @blur="addTag" />
                    <el-button v-else size="small" @click="showTagInput" icon="Plus" circle />
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="settingsDialogVisible = false" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="saveOrUpdate" v-if="type === USER">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="auditingDialogVisible" title="审核" width="40%" class="x-el-dialog styl-1">
            <el-form :model="auditFormData" label-width="80px" size="small">
                <el-form-item label="文章设置">
                    <el-button @click="settingsDialogVisible = true" size="small" plain type="primary">查看</el-button>
                </el-form-item>
                <el-form-item label="意见">
                    <el-radio v-model="auditFormData.opinion" v-for="(value, key) in OPINION_CONFIG" :label="value">{{ key }}</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="auditFormData.remarks" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="auditingDialogVisible = false" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="audit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import { OPINION_CONFIG, CREATION_TYPE_CONFIG, REPRINT, ORIGINAL } from "./constants";
import { USER, ADMIN } from "@/constants/general";
import { useTag } from "./composables/useTag";
import { useElUpload } from "@/composables/useElUpload";
import { addIdentityForImagePath } from "@/utils/common";
import { MdEditor, MdPreview } from 'md-editor-v3';
import { useMarkdownEditor } from "@/composables/useMarkdownEditor";
import { useDetail, useAudit, useSaveDraft, useSave, useUpdate, useDialog, useRouter as useArticleRouter } from "@/composables/article";
import { useList } from "@/composables/category";
import { useImportMdStyle } from "./composables/useImportMdStyle";

const route = useRoute();

const defaultFormData = {
    id: "",
    title: "",
    content: "",
    categoryId: "",
    cover: "",
    summary: "",
    tag: "",
    creationType: ORIGINAL,
    reprintUrl: "",
    commentable: 0,
    sort: ""
};

const { id, type = USER } = route.query;
const isUser = type === USER;
const skipComparison = ref(false);
const formData = reactive({ ...defaultFormData });
const { original } = useDetail({ formData, id, type });
const { auditingDialogVisible, settingsDialogVisible } = useDialog();
const { audit, auditFormData } = useAudit({ dialogVisible: auditingDialogVisible, id });
const { saveDraft } = useSaveDraft({ formData, skipComparison });
const { save } = useSave({ formData, skipComparison });
const { update } = useUpdate({ formData, skipComparison });
const { back } = useArticleRouter();
const { list: categoryList } = useList();
const { tags, tag, tagInput, tagInputVisible, showTagInput, addTag, removeTag } = useTag({ formData });

const cover = ref("");
const { createHttpRequest, onSuccess } = useElUpload();
const coverHttpRequest = createHttpRequest({
    path: cover,
    postHandler: addIdentityForImagePath,
    type: 2
});

const image = ref("");
const { createOnUploadImg } = useMarkdownEditor();
const onUploadImg = createOnUploadImg({
    path: image,
    pathHandler: addIdentityForImagePath,
    type: 2
});
const isReprint = computed(() => formData.creationType === REPRINT);

function saveOrUpdate() {
    formData.id ? update() : save();
}
useImportMdStyle(type);
// 同步cover
watch(cover, () => {
    formData.cover = cover.value;
});
</script>

<style scoped>
:deep(#preview-only-preview) {
    padding: 15px 20px;
}
:deep(.md-editor-preview-wrapper) {
    overflow: visible;
}
</style>
<template>
    <div class="app-container my-app-container article-editor">
        <el-card class="x-el-card-table el-card__body-pd-0 el-card__header-sty-1">
            <template #header>
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input v-model="formData.title" class="x-el-input-b-none" placeholder="请输入标题">
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
            <MdEditor v-model="formData.content" />
        </el-card>
        <el-dialog :visible.sync="settingsDialogVisible" title="文章设置" width="40%" class="x-el-dialog styl-1">
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
                    <el-radio v-model="formData.creationType" v-for="(value, key) in CREATION_TYPE_CONFIG" :label="value">{{ key }}</el-radio>
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
                        :key="i + '-' + item" size="medium"
                        v-for="(item, i) in tags"
                        :disable-transitions="false"
                        closable
                        @close="removeTagHandler(i)">
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
                    <el-button v-else size="small" @click="showTagInput" icon="el-icon-plus" circle></el-button>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="settingsDialogVisible = false" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="saveOrUpdate" v-if="type === USER">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="auditingDialogVisible" title="审核" width="40%" class="x-el-dialog styl-1">
            <el-form :model="auditingFormData" label-width="80px" size="small">
                <el-form-item label="文章设置">
                    <el-button @click="settingsDialogVisible = true" size="small" plain type="primary">查看</el-button>
                </el-form-item>
                <el-form-item label="意见">
                    <el-radio v-model="auditingFormData.opinion" v-for="(value, key) in OPINION_CONFIG" :label="value">{{ key }}</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="auditingFormData.remarks" placeholder="请输入" />
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
import { onMounted, ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { USER, ADMIN } from "@/constants/general";
import { OPINION_CONFIG, CREATION_TYPE_CONFIG } from "./articleConstants";
import * as adminService from "@/api/article";
import * as accountService from '@/api/accountArticle';
import { useTag } from "./useTag";
import { useArticleDetail } from "./useArticleDetail";
import { useElUpload } from "../../composables/useElUpload";
import { addIdentityForImagePath } from "@/utils/common";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const route = useRoute();
const services = {
    [USER]: accountService,
    [ADMIN]: adminService
};
const { id, type } = route.query;
const { skipComparison, formData, auditingFormData,
    auditingDialogVisible, save, update, saveOrUpdate, settingsDialogVisible,
    saveDraft, getDetail, audit, back } = useArticleDetail({ service: services[type] });
const { tags, tag, tagInput, tagInputVisible, showTagInput, addTag, removeTag } = useTag({ formData });

const cover = ref("");
const { createHttpRequest, onSuccess } = useElUpload();
const coverHttpRequest = createHttpRequest({
    path: cover,
    pathHandler: addIdentityForImagePath,
    type: 2
});

// 同步cover
watchEffect(() => {
    formData.cover = cover.value;
});

computed(() => c)

onMounted(() => {
   getDetail(id)
});
</script>
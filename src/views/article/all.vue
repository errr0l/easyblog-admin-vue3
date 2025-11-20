<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <template #header>
                <div style="margin-bottom: 20px;">
                    <el-badge v-for="(value, key) of ARTICLE_STATE_CONFIG" :key="key" :value="statistic[key] || 0" style="margin-right: 15px;">
                        <el-tag @click="searchByState(key)" size="small" style="cursor: pointer;" :type="value.type || ''" :effect="value.effect">{{ value.text }}</el-tag>
                    </el-badge>
                    <span style="font-size: 12px; color: #ccc; float: right;">注意，当前统计数据取自缓存，因此可能出现不对板的情况，请以实际查询数据为主</span>
                </div>
                <el-form :inline="true" :model="query" size="small" class="x-el-form">
                    <el-form-item label="标题">
                        <el-input v-model="query.title" placeholder="请输入" clearable style="width: 172px"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="query.categoryId" placeholder="请选择" clearable style="width: 172px">
                            <el-option
                                v-for="item in categories"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.states" placeholder="请选择" clearable multiple collapse-tags style="width: 172px">
                            <el-option
                                v-for="item in articleStates"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="query.creationType" placeholder="请选择" clearable style="width: 172px">
                            <el-option
                                v-for="item in creationTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="search">查询</el-button>
                        <el-button type="primary" size="small" @click="publishDialogVisible = true">发布</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table :data="list" style="width: 100%;" border size="small">
                <el-table-column align="center" label="序号" type="index" width="50" fixed="left"></el-table-column>
                <el-table-column align="center" label="ID" prop="id" width="80"></el-table-column>
                <el-table-column align="center" label="封面" width="120" prop="cover">
                    <template #="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.cover ? row.cover : getDefaultImage()" lazy
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标题" prop="title" width="220"></el-table-column>
                <el-table-column align="center" label="分类" prop="categoryName" width="120">
                    <template #="{ row }">
                        <span>{{ row.categoryName || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="作者" prop="authorId" width="120">
                    <template #="{ row }">
                        <span>{{ row.authorName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" prop="state" width="120">
                    <template #="{ row }">
                        <span v-if="!row.state">-</span>
                        <el-tag v-else size="small" :effect="ARTICLE_STATE_CONFIG[row.state].effect" :type="ARTICLE_STATE_CONFIG[row.state].type">{{ ARTICLE_STATE_CONFIG[row.state].text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" prop="creationType" width="120">
                    <template #="{ row }">
                        <span>{{ CREATION_TYPE_CONFIG[row.creationType] ? CREATION_TYPE_CONFIG[row.creationType].text : "-" }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" width="180">
                    <template #="{ row }">
                        <span>{{ row.createdAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="最后更新于" width="180">
                    <template #="{ row }">
                        <span>{{ row.lastUpdatedAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="180">
                    <template #="{ row }">
                        <el-button link size="small" @click="audit(row)">编辑</el-button>
                        <!-- <el-button link v-if="row.state !== DELETED" size="small" @click="del(row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 10px;">
                <el-pagination
                    @current-change="currentChange"
                    background
                    :page-size="query.size"
                    layout="total, prev, pager, next"
                    :total="total" style="float: right;">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog v-model="progressDialogVisible" title="发布进度" width="30%" class="x-el-dialog styl-1" :show-close="false">
            <div class="t-c">
                <el-progress type="circle" :percentage="progress.percentage" :status="progress.status"></el-progress>
                <p v-if="progress.message">{{ progress.message }}</p>
            </div>
            <div class="t-r" style="margin-top: 20px;">
                <el-button type="primary" size="small" @click="closeDialog">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="publishDialogVisible" title="发布文章" width="40%" class="x-el-dialog styl-1">
            <el-form :model="publishFormData" label-width="auto" size="small">
                <el-form-item label="上传至Github">
                    <el-radio v-model="publishFormData.toRemote" :label="1">是</el-radio>
                    <el-radio v-model="publishFormData.toRemote" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="创建html规则">
                    <el-radio v-model="publishFormData.force" :label="0">自动</el-radio>
                    <el-radio v-model="publishFormData.force" :label="1">强制</el-radio>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button @click="publishDialogVisible = false" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="publish">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { WAITING_FOR_AUDITING, CREATION_TYPE_CONFIG, ARTICLE_STATE_CONFIG, articleStates, creationTypes } from "@/views/article/constants";
import { inject, onActivated, onMounted, ref } from "vue";

import { useStatistic } from "@/composables/article/useStatistic";
import { usePublish } from "@/composables/app/usePublish";
import { useCategory } from "@/composables/useCategory";
import { useArticlePagination } from "@/composables/article/useArticlePagination";
import { useArticleNavigator } from "@/views/article/composables/useArticleNavigator";
const getDefaultImage = inject('getDefaultImage');

const publishDialogVisible = ref(false);
const progressDialogVisible = ref(false);

const { list: categories, listAll } = useCategory();
const { fetchData, list, total, search, currentChange, searchByState, query } = useArticlePagination();
const { statistic, getStatistic } = useStatistic();
const { publish, formData: publishFormData, progress, resetProgress } = usePublish({ progressDialogVisible, dialogVisible: publishDialogVisible });
const { audit } = useArticleNavigator();

// 修改查询条件，以管理员角度请求
function setQuery() {
    query['scope'] = 'all';
    query['withAuthorName'] = true;
}
setQuery();
onMounted(() => {
    fetchData();
    getStatistic();
});

onActivated(() => {
    listAll();
});

function closeDialog() {
    progressDialogVisible.value = false;
    resetProgress();
    listAll();
}
</script>

<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <template #header>
                <el-form :inline="true" :model="query" size="small">
                    <el-form-item label="标题">
                        <el-input v-model="query.keyword" placeholder="请输入" clearable style="width: 162px"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="query.categoryId" placeholder="请选择" clearable style="width: 162px">
                            <el-option
                                v-for="item in categories"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="query.creationType" placeholder="请选择" clearable style="width: 162px">
                            <el-option
                                v-for="item in creationTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.states" placeholder="请选择" clearable multiple collapse-tags style="width: 162px">
                            <el-option
                                v-for="item in articleStates"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="search">查询</el-button>
                        <el-button type="primary" size="small" @click="add">新增</el-button>
                        <el-button type="primary" size="small" @click="importDialogVisible = true">导入</el-button>
                    </el-form-item>
                    <el-form-item label="可见性">
                        <el-select v-model="query.visibility" placeholder="请选择" clearable style="width: 162px">
                            <el-option :value="VISIBLE" label="正常"></el-option>
                            <el-option :value="HIDDEN" label="已隐藏"></el-option>
                        </el-select>
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
                        <span>{{ row.categoryName || "-" }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" prop="state" width="120">
                    <template #="{ row }">
                        <span v-if="row.state < 0">-</span>
                        <el-tag v-else size="small" :effect="ARTICLE_STATE_CONFIG[row.state].effect" :type="ARTICLE_STATE_CONFIG[row.state].type">{{ ARTICLE_STATE_CONFIG[row.state].text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="可见性" prop="visibility" width="120">
                    <template #="{ row }">
                        <el-tag size="small" effect="dark" type="info" v-if="row.visibility === HIDDEN">{{ '已隐藏' }}</el-tag>
                        <el-tag size="small" v-else>{{ '正常' }}</el-tag>
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
                <el-table-column align="center" label="最后发布于" width="180">
                    <template #="{ row }">
                        <span>{{ row.lastPublishedAt || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="240">
                    <template #="{ row }">
                        <el-button link size="small" v-if="row.state === PENDING" @click="submit(row)">提交审核</el-button>
                        <el-button link size="small" v-else-if="row.state === WAITING_FOR_AUDITING" @click="cancel(row)" type="warning">撤销</el-button>
                        <el-button link size="small" v-else-if="row.state === WAITING_FOR_CONFIRMATION" type="primary" @click="confirm(row)">确认</el-button>
                        <el-button link size="small" v-else-if="row.state === DELETED" @click="recover(row)">恢复</el-button>
                        <el-button link size="small" @click="edit(row)">编辑</el-button>
                        <el-button link class="x-el-button-text" type="danger" size="small" @click="del(row)">删除</el-button>
                        <el-button link class="x-el-button-text" type="danger" size="small" v-if="!!row.lastPublishedAt && row.state !== DELETED && row.visibility !== HIDDEN" @click="hideArticle(row)">隐藏</el-button>
                        <el-button link size="small" v-if="row.visibility === HIDDEN" @click="showArticle(row)">显示</el-button>
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

        <el-dialog v-model="importDialogVisible" title="导入文章" width="40%" class="x-el-dialog styl-2">
            <el-upload
                v-model:file-list="uploadFiles"
                multiple
                :on-change="handleUploadChange"
                accept=".md"
                :on-remove="handleRemove"
                :auto-upload="false">
                <el-button type="primary" size="small">选择文件</el-button>
                <template #tip>
                    <div class="el-upload__tip">
                        仅限markdown文件；选择完成后，点击[确定]按钮，以将数据上传至服务器
                    </div>
                </template>
            </el-upload>
            <div style="text-align: right;">
                <el-button @click="importDialogVisible = false" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="importArticles">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { onActivated, inject, ref } from "vue";
import { useArticleNavigator } from "./composables/useArticleNavigator";
import {
    creationTypes,
    articleStates,
    DELETED,
    ARTICLE_STATE_CONFIG,
    CREATION_TYPE_CONFIG,
    PENDING,
    WAITING_FOR_AUDITING,
    WAITING_FOR_CONFIRMATION,
    WAITING_FOR_PUBLICATION, HIDDEN, VISIBLE
} from "./constants";
import { useCategory } from "@/composables/useCategory";
import * as articleApi from "@/api/article";
import { ElMessage, ElMessageBox } from "element-plus";
import { useArticlePagination } from "@/composables/article/useArticlePagination";
import { defaultFormData as defaultArticleExample } from "./dto";
import { useArticleHelper } from "../../composables/article/useArticleHelper";

const { list, total, fetchData, currentChange, search, query } = useArticlePagination();
const { edit, add } = useArticleNavigator();
const { listAll, list: categories } = useCategory();
const { extractMarkdownTitle, createSummary, removeMarkdownTags, readFileContent } = useArticleHelper();
const getDefaultImage = inject('getDefaultImage');
const importDialogVisible = ref(false);
const articles = [];
const uploadFiles = ref([]);

onActivated(() => {
    fetchData();
    listAll();
});

// 提交审核
async function submit(row) {
    const resp = await articleApi.submit(row.id);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        row.state = WAITING_FOR_AUDITING;
    }
}

async function confirm(row) {
    const resp = await articleApi.confirm(row.id);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        row.state = WAITING_FOR_PUBLICATION;
    }
}

function del(row) {
    ElMessageBox.confirm("确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then(async () => {
        const resp = await articleApi.del(row.id);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = DELETED;
        }
    });
}

function cancel(row) {
    ElMessageBox.confirm(`文章[${ARTICLE_STATE_CONFIG[row.state].text}]，确认撤销吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then(async () => {
        const resp = await articleApi.cancel(row.id);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = PENDING;
        }
    });
}

function importArticles() {
    const count = articles.length;
    if (count === 0) {
        return;
    }
    let titles = articles.slice(0, 3).map(item => item.title).join();
    if (count > 3) {
        titles += ',...等';
    }
    ElMessageBox.confirm(`确认导入[${titles}]文章`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then(async () => {
        const resp = await articleApi.importArticles({
            articles: articles
        });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            articles.length = 0;
            uploadFiles.value.length = 0;
            importDialogVisible.value = false;
            fetchData();
        }
    });
}

// 这个上传组件，只是当做一个文件读取器，并未真正上传数据，要调用importArticles方法来完成；
// 导入文件时，仅处理文本内容，即不包括里面的图片链接(链接需要进一步处理，手动转移图片，或修改为网络链接等)，文件名为标题，其他为文件内容；
// 导入的数据，为草稿状态；
async function handleUploadChange(file, files) {
    // 如果可能，在文件内容中提取标题，并修改
    let content = await readFileContent(file.raw);
    // 如果可能，在文件内容中提取标题
    const title = extractMarkdownTitle(content);
    if (title) {
        // 若是以换行符开头，删除
        content = content.slice(title.raw.length).trim().replace(/^[\n]+/, '');
        // 修改显示
        uploadFiles.value = files.map(item => {
            if (item.uid === file.uid) {
                return {
                    ...item,
                    name: `${file.name} (${title.pure})`
                };
            }
            return item;
        });
    }
    const articleExample = { ...defaultArticleExample };
    articleExample.title = title.pure || file.name;
    articleExample.summary = createSummary(content);
    articleExample.content = content;
    articleExample.uid = file.uid;
    articles.push(articleExample);
}

// 移除文章数据
const handleRemove = (file, files) => {
    const index = articles.findIndex(item => item.uid == file.uid);
    articles.splice(index, 1);
};

const hideArticle = (row) => {
    ElMessageBox.confirm(`确认隐藏[${row.title}], 并于下次发布删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then(async () => {
        const resp = await articleApi.hideArticle(row.id);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.visibility = HIDDEN;
        }
    });
};

const showArticle = async (row) => {
    const resp = await articleApi.showArticle(row.id);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        row.state = PENDING;
    }
};
</script>

<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <template #header>
                <el-form :inline="true" :model="query" size="small">
                    <el-form-item label="标题">
                        <el-input v-model="query.keyword" placeholder="请输入" clearable style="width: 172px"></el-input>
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
                        <el-button type="primary" size="small" @click="add">新增</el-button>
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
                        <el-button link size="small" v-if="row.state === PENDING" @click="submit(row)">提交审核</el-button>
                        <el-button link size="small" v-else-if="row.state === WAITING_FOR_AUDITING" @click="cancel(row)" type="warning">撤销</el-button>
                        <el-button link size="small" v-else-if="row.state === WAITING_FOR_CONFIRMATION" type="primary" @click="confirm(row)">确认</el-button>
                        <el-button link size="small" v-else-if="row.state === DELETED" @click="recover(row)">恢复</el-button>
                        <el-button link size="small" @click="edit(row)">编辑</el-button>
                        <el-button link class="x-el-button-text" type="danger" size="small" @click="del(row)">删除</el-button>
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
    </div>
</template>

<script setup>
import { onActivated, inject } from "vue";
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
    WAITING_FOR_PUBLICATION
} from "./constants";
import { useCategory } from "@/composables/useCategory";
import * as articleApi from "@/api/article";
import { ElMessage, ElMessageBox } from "element-plus";
import { useArticlePagination } from "@/composables/article/useArticlePagination";

const { list, total, fetchData, currentChange, search, query } = useArticlePagination();
const { edit, add } = useArticleNavigator();
const { listAll, list: categories } = useCategory();
const getDefaultImage = inject('getDefaultImage');

onActivated(() => {
    fetchData();
    listAll();
});

// 提交审核
async function submit(row) {
    const resp = await articleApi.submit({ id: row.id });
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        row.state = WAITING_FOR_AUDITING;
    }
}

async function confirm(row) {
    const resp = await articleApi.confirm({ id: row.id });
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
        const resp = await articleApi.del({ id: row.id });
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
        const resp = await articleApi.cancel({ id: row.id });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = PENDING;
        }
    });
}
</script>

<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <template #header>
                <el-form :inline="true" :model="query">
                    <el-form-item label="标题">
                        <el-input v-model="query.title" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="query.categoryId" placeholder="请选择" clearable style="width: 172px">
                            <el-option
                                v-for="item in categoryList"
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
                        <el-tag size="small" :effect="ARTICLE_STATE_CONFIG[row.state].effect || 'plain'" :type="ARTICLE_STATE_CONFIG[row.state].type || 'info'">{{ ARTICLE_STATE_CONFIG[row.state].text || "-" }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" prop="creationType" width="120">
                    <template #="{ row }">
                        <span>{{ CREATION_TYPE_CONFIG[row.creationType].text || "-" }}</span>
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
                        <el-button link size="small" v-else-if="row.state === WAITING_FOR_CONFIRMATION" type="success" @click="confirm(row)">确认</el-button>
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
import { onMounted, onActivated, inject, reactive, watch } from "vue";

import { getPagination } from "@/api/accountArticle";

import { usePagination } from "../../composables/usePagination";
import { useArticleList } from "./useArticleList";
import { creationTypes, articleStates, DELETED, ARTICLE_STATE_CONFIG, CREATION_TYPE_CONFIG, PENDING, WAITING_FOR_AUDITING, WAITING_FOR_CONFIRMATION } from "./articleConstants";
import { useCategory } from "./useCategory";
// 查询参数
const query = reactive({
    size: 10,
    current: 1,
    categoryId: "",
    states: [],
    creationType: "",
    title: "",
    excludedState: DELETED
});

function setStatesIfNecessary(_query) {
    if (_query && _query.states) {
        _query.states = _query.states.join(",");
    }
}

const { list, total, queryPagination, currentChange } = usePagination({
    query,
    getPagination,
    queryHandlers: [setStatesIfNecessary],
});

const { submit, confirm, add, cancel, del, edit } = useArticleList({ getPagination: queryPagination });
const { categoryList, queryCategoryList } = useCategory();

const getDefaultImage = inject('getDefaultImage');

onMounted(() => {
    queryCategoryList();
});

watch(() => query.states, (n, o) => {
    if (n && n.includes(DELETED)) {
        query.excludedState = "";
    }
    else {
        query.excludedState = DELETED;
    }
});

onActivated(() => {
    queryPagination();
});

function search() {
    query.current = 1;
    queryPagination();
}
</script>

<style>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}
</style>

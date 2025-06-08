<template>

    <el-pagination
        @current-change="currentChange"
        background
        :page-size="paginationQuery.value.size"
        layout="total, prev, pager, next"
        :total="total">
    </el-pagination>
</template>

<script setup>
import { onMounted, ref, onActivated, inject } from "vue";
import { useRouter } from "vue-router";

import { cancel, confirm, getPagination, submit } from "@/api/accountArticle";

import { usePagination } from "../../composables/usePagination";

const router = useRouter();

// 查询参数
const paginationQuery = ref({
    size: 10,
    current: 1,
    categoryId: "",
    states: [],
    creationType: "",
    title: "",
    excludedState: DELETED
});

const { list, total, queryPagination, currentChange } = usePagination({
    query: paginationQuery,
    getPagination,
    queryHandlers: []
});

onActivated(() => {
    queryPagination();
});
</script>

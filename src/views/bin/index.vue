<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <div slot="header" class="clearfix">
                <el-form :inline="true" :model="query" size="mini" class="x-el-form">
                    <el-form-item label="标题">
                        <el-input v-model="query.title" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="query.categoryId" placeholder="请选择">
                            <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="query.creationType" placeholder="请选择">
                            <el-option
                                v-for="item in types"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" @click="getPagination">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="list" style="width: 100%;" border size="small" height="0px">
                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                <el-table-column align="center" label="ID" prop="id" width="80"></el-table-column>
                <el-table-column align="center" label="封面" width="120" prop="cover">
                    <template slot-scope="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.cover ? row.cover : getDefaultImage()" lazy
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标题" prop="title" width="auto"></el-table-column>
                <el-table-column align="center" label="分类" prop="categoryName" width="120"></el-table-column>
                <el-table-column align="center" label="状态" prop="state" width="120">
                    <template>
                        <span>已删除</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" prop="creationType" width="120">
                    <template slot-scope="{ row }">
                        <span>{{ typeMap[row.creationType] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="140">
                    <template slot-scope="{ row }">
                        <el-button type="text" class="x-el-button-text" size="mini" @click="recover(row)">恢复</el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="text-align: right; margin-top: 10px;">
                <el-pagination
                    background
                    :page-size="query.size"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getDeleteedPagination, doDel, getCategoryList, recover } from "@/api/article";
// import { stateMap, states, types, typeMap } from "@/views/article/index.vue.backup";
const states = [
    { id: 0, name: "未发布" },
    { id: 1, name: "已发布" },
    { id: 3, name: "草稿" }
];

const types = [
    { id: 0, name: "原创" },
    { id: 1, name: "转载" }
];

const stateMap = {};
const typeMap = {};

for (let { id, name } of states) {
    stateMap[id] = name;
}
for (let { id, name } of types) {
    typeMap[id] = name;
}
export default {
    data() {
        return {
            list: [],
            total: 0,
            query: {
                size: 10,
                current: 1,
                categoryId: "",
                creationType: "",
                title: ""
            },
            categoryList: [],
            types,
            states,
            typeMap, stateMap
        };
    },
    created() {
        this.getPagination();
        this.getCategoryList();
    },
    methods: {
        async getCategoryList() {
            const resp = await getCategoryList();
            if (resp.code === 0) {
                this.categoryList = resp.data;
            }
        },
        async getPagination() {
            const resp = await getDeleteedPagination(this.query);
            if (resp.code === 0) {
                this.list = resp.data.records;
                this.total = resp.data.total;
            }
        },
        del(data) {
            this.$confirm("此操作不可逆，确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await doDel({ id: data.id }).catch((error) => {
                    console.log(error);
                });
                if (resp.code === 0) {
                    this.$message.success("操作成功");
                    this.getPagination();
                }
            });
        },
        recover(data) {
            this.$confirm("即将把文章恢复为【草稿】状态，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await recover({ id: data.id }).catch((error) => {
                    console.log(error);
                });
                if (resp.code === 0) {
                    this.$message.success("操作成功");
                    this.getPagination();
                }
            });
        }
    },
};
</script>

<style lang="scss" scoped>
</style>

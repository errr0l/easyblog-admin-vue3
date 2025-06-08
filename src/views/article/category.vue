<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <div slot="header" class="clearfix">
                <el-form :inline="true" size="mini" class="x-el-form">
                    <el-form-item label="名称" class="x-form-item-m-b-0px">
                        <el-input v-model="query.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="x-form-item-m-b-0px">
                        <el-button size="mini" @click="getList">查询</el-button>
                        <el-button type="primary" size="mini" @click="showDialogForAdding()">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="list" style="width: 100%;" border size="mini">
                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                <el-table-column align="center" label="ID" width="80" prop="id"></el-table-column>
                <el-table-column align="center" label="名称" width="100" prop="name"></el-table-column>
                <el-table-column align="center" label="封面" width="120" prop="cover">
                    <template slot-scope="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.cover" lazy
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述" prop="description"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="mini" @click="showDialogForEditing(row)">编辑</el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog :visible.sync="dialogVisible" title="新增/编辑" width="40%" class="x-el-dialog styl-1">
            <el-form :model="formData" label-width="80px" size="small">
                <el-form-item label="名称">
                    <el-input v-model="formData.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="formData.description" placeholder="请输入" />
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
            </el-form>
            <div style="text-align:right;">
                <el-button @click="dialogVisible = false" size="mini">取消</el-button>
                <el-button type="primary" size="mini" v-if="isEditing" @click="update">确定</el-button>
                <el-button type="primary" size="mini" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCategoryList, saveCategory, updateCategory, delCategory } from "@/api/article";
import { uploadImage } from "@/api/file";
import { uploadMixin } from "@/mixins/upload";
import { addIdentityForImagePath } from "@/utils/common";

const defaultFormData = {
    name: "",
    description: "",
    cover: ""
};

export default {
    mixins: [uploadMixin],
    data() {
        return {
            dialogVisible: false,
            list: [],
            formData: { ...defaultFormData },
            isEditing: false,
            total: 0,
            query: {
                name: ""
            },
            cellStyle: {
                verticalAlign: 'middle'
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        async requstHandler(ctx) {
            const formData = new FormData();
            formData.append([ctx.filename], ctx.file);
            const resp = await uploadImage(formData, { type: 2 });
            if (resp.code === 0) {
                this.formData.cover = addIdentityForImagePath(resp.data.path);
            }
        },
        async getList() {
            const resp = await getCategoryList(this.query);
            if (resp.code === 0) {
                this.list = resp.data;
            }
        },
        showDialogForAdding() {
            this.isEditing = false;
            this.dialogVisible = true;
            this.formData = { ...defaultFormData };
        },
        async save() {
            const resp = await saveCategory(this.formData).catch(
                (error) => {
                    console.log(error);
                }
            );
            if (resp.code === 0) {
                this.dialogVisible = false;
                this.$message.success("操作成功");
                this.getList();
            }
        },
        showDialogForEditing(data) {
            this.isEditing = true;
            this.dialogVisible = true;
            this.formData = { ...data }
        },
        async update() {
            const resp = await updateCategory(this.formData).catch(
                (error) => {
                    console.log(error);
                }
            );
            if (resp.code === 0) {
                this.dialogVisible = false;
                this.$message.success("操作成功");
                this.getList();
            }
        },
        del(data) {
            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await delCategory({ id: data.id }).catch((error) => {
                    console.log(error);
                });
                if (resp.code === 0) {
                    this.$message.success("操作成功");
                    this.getList();
                }
            });
        }
    },
};
</script>

<style lang="scss" scoped>
</style>

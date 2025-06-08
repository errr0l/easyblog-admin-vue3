<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <div slot="header" class="clearfix">
                <el-button type="primary" size="mini" @click="showDialogForAdding()">添加用户</el-button>
            </div>
            <el-table :data="list" style="width: 100%;" border size="small">
                <el-table-column label="序号"
                    type="index" align="center"
                    width="50">
                </el-table-column>
                <el-table-column align="center" label="ID" width="80" prop="id"></el-table-column>
                <el-table-column align="center" label="用户名" width="100" prop="username"></el-table-column>
                <el-table-column align="center" label="头像" width="120" prop="avatar">
                    <template slot-scope="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.avatar ? row.avatar : getDefaultImage()" lazy
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="120">
                    <template slot-scope="{ row }">
                        <el-tag size="mini" v-if="row.state === 1">正常</el-tag>
                        <el-tag size="mini" type="warning" v-else-if="row.state === 3">等待审核</el-tag>
                        <el-tag size="mini" type="info" v-else>禁用中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邮箱" width="240" prop="email"></el-table-column>
                <!-- <el-table-column align="center" label="介绍" width="240" prop="introduction" /> -->
                <el-table-column align="center" label="注册时间" width="240">
                    <template slot-scope="{ row }">
                        <span>{{ row.createdAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="210">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="mini" @click="showDialogForEditing(row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="showDialogForUpdatingPassword(row)">修改密码</el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" v-if="row.state === 1" @click="ban(row)">禁用</el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" v-else-if="row.state === 2" @click="activate(row)">激活</el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" v-else-if="row.state === 3" @click="approve(row)">通过</el-button>
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

        <el-dialog :visible.sync="dialogVisible" title="新增/编辑用户" width="40%" class="x-el-dialog styl-1" size="mini">
            <el-form :model="formData" label-width="80px" size="mini">
                <el-form-item label="用户名">
                    <el-input v-model="formData.username" placeholder="请输入" />
                </el-form-item>
                <!-- <el-form-item label="昵称">
                    <el-input v-model="formData.nickname" placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label="邮箱">
                    <el-input v-model="formData.email" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="初始密码" v-if="!isEditing">
                    <el-input v-model="formData.password" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input v-model="formData.introduction" placeholder="请输入（markdown、纯文本）" :rows="3" type="textarea" resize="none" />
                </el-form-item>
                <el-form-item label="角色">
                    <el-checkbox-group v-model="roleIds">
                        <el-checkbox v-for="role of roleList" :label="role.id" :key="role.id">{{ role.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="mini" @click="dialogVisible = false">取消</el-button>
                <el-button size="mini" type="primary" v-if="isEditing" @click="update">确定</el-button>
                <el-button size="mini" type="primary" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="passwordDialogVisible" title="修改密码" width="40%" class="x-el-dialog styl-1" size="mini">
            <el-form ref="elPasswordForm" :model="passwordFormData" :rules="passwordRules" label-width="80px" size="mini">
                <el-form-item label="密码" required prop="password">
                    <el-input v-model="passwordFormData.password" placeholder="请输入" type="password" />
                </el-form-item>
                <el-form-item label="确认密码" required prop="confirmation">
                    <el-input v-model="passwordFormData.confirmation" placeholder="请输入" type="password" />
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="mini" @click="dialogVisible = false">取消</el-button>
                <el-button size="mini" type="primary" @click="updatePassword">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getPagination, save, del, update, updatePassword, updateState } from "@/api/user";
import { getList, getRoleListByUserId } from "@/api/role";
import { getDifference, copyProperties } from '@/utils/common.js';

const defaultFormData = {
    id: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    // nickname: "",
    introduction: ""
};

const defaultPasswordFormData = {
    id: "",
    password: "",
    confimation: ""
};

export default {
    data() {
        const sameValidator = (rule, value, callback) => {
            if (value !== this.passwordFormData.password) {
                callback(new Error('两次输入密码不一致!'));
            }
            else {
                callback();
            }
        }
        return {
            dialogVisible: false,
            list: [], // table列表
            formData: { ...defaultFormData },
            isEditing: false,
            userRoleList: [], // 用户角色列表
            roleList: [], // 角色列表
            roleIds: [],
            total: 0,
            query: {
                size: 10,
                current: 1
            },
            passwordFormData: { ...defaultPasswordFormData },
            passwordDialogVisible: false,
            passwordRules: {
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                ],
                confirmation: [
                    { required: true, message: '确认密码不能为空', trigger: 'blur' },
                    { validator: sameValidator, trigger: 'blur' }
                ],
            }
        };
    },
    filters: {
        stateFilter(value) {
            return value === 1 ? '正常' : '禁用';
        }
    },
    created() {
        this.getPagination();
        this.getList();  
    },
    methods: {
        approve(row) {
            this.updateState({ id: row.id, state: 1 });
        },
        ban(row) {
            this.updateState({ id: row.id, state: 2 });
        },
        activate(row) {
            this.updateState({ id: row.id, state: 1 });
        },
        async updateState(data) {
            const resp = await updateState(data);
            if (resp.code === 0) {
                this.getPagination();
                this.$message.success("操作成功");
            }
        },
        showDialogForUpdatingPassword(row) {
            this.passwordFormData.id = row.id;
            this.passwordDialogVisible = true;
        },
        async updatePassword() {
            this.$refs.elPasswordForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                const resp = await updatePassword(this.passwordFormData);
                if (resp.code === 0) {
                    this.passwordFormData = { ...defaultPasswordFormData };
                    this.$message.success("操作成功");
                    this.passwordDialogVisible = false;
                }
            });
        },
        async getPagination() {
            const resp = await getPagination();
            if (resp.code !== 0) {
                return;
            }
            this.list = resp.data.records;
            this.total = resp.data.total;
        },
        async getList() {
            const resp = await getList();
            if (resp.code !== 0) {
                return;
            }
            this.roleList = resp.data;
        },
        async getRoleListByUserId(id) {
            const resp = await getRoleListByUserId(id);
            if (resp.code !== 0) {
                return;
            }
            this.userRoleList = resp.data;
            this.roleIds = this.userRoleList.map(item => item.id);
        },
        showDialogForAdding() {
            this.isEditing = false;
            this.dialogVisible = true;
            this.formData = { ...defaultFormData };
            this.roleIds = [];
        },
        async save() {
            this.dialogVisible = false;
            this.formData.assigning = this.roleIds;
            const resp = await save(this.formData).catch((error) => {
                console.log(error);
            });
            if (resp.code !== 0) {
                return;
            }
            this.$message.success("操作成功");
            this.getPagination();
        },
        showDialogForEditing(data) {
            this.isEditing = true;
            this.dialogVisible = true;
            this.formData = copyProperties(data, { ...defaultFormData });
            this.getRoleListByUserId(data.id);
        },
        async update() {
            this.dialogVisible = false;
            const roleIdsAssigned = this.userRoleList.map(item => item.id);
            this.formData.assigning = getDifference(this.roleIds, roleIdsAssigned);
            this.formData.removing = getDifference(roleIdsAssigned, this.roleIds);
            const resp = await update(this.formData).catch(
                (error) => {
                    console.log(error);
                }
            );
            if (resp.code !== 0) {
                return;
            }
            this.$message.success("操作成功");
            this.getPagination();
        },
        del(data) {
            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await del({ id: data.id }).catch((error) => {
                    console.log(error);
                });
                if (resp.code !== 0) {
                    return;
                }
                this.$message.success("操作成功");
                this.getPagination();
            });
        }
    },
};
</script>

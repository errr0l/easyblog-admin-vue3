<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <template #header>
                <el-button type="primary" size="small" @click="showDialogForAdding()">添加用户</el-button>
            </template>
            <el-table :data="list" style="width: 100%;" border size="small">
                <el-table-column label="序号"
                    type="index" align="center"
                    width="50">
                </el-table-column>
                <el-table-column align="center" label="ID" width="80" prop="id"></el-table-column>
                <el-table-column align="center" label="用户名" width="100" prop="username"></el-table-column>
                <el-table-column align="center" label="头像" width="120" prop="avatar">
                    <template #="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.avatar ? row.avatar : getDefaultImage()" lazy
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="120">
                    <template #="{ row }">
                        <el-tag size="small" v-if="row.state === 1">正常</el-tag>
                        <el-tag size="small" type="warning" v-else-if="row.state === 3">等待审核</el-tag>
                        <el-tag size="small" type="info" v-else>禁用中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邮箱" width="240" prop="email"></el-table-column>
                <!-- <el-table-column align="center" label="介绍" width="240" prop="introduction" /> -->
                <el-table-column align="center" label="注册时间" width="240">
                    <template #="{ row }">
                        <span>{{ row.createdAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="210">
                    <template #="{ row }">
                        <el-button link size="small" @click="showDialogForEditing(row)">编辑</el-button>
                        <el-button link size="small" @click="showDialogForUpdatingPassword(row)">修改密码</el-button>
                        <el-button link class="x-el-button-text" size="small" v-if="row.state === 1" @click="ban(row)">禁用</el-button>
                        <el-button link class="x-el-button-text" size="small" v-else-if="row.state === 2" @click="activate(row)">激活</el-button>
                        <el-button link class="x-el-button-text" size="small" v-else-if="row.state === 3" @click="activate(row)">通过</el-button>
                        <el-button link class="x-el-button-text" size="small" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" title="新增/编辑用户" width="40%" class="x-el-dialog styl-1" size="small">
            <el-form :model="formData" label-width="80px" size="small">
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
                        <el-checkbox v-for="role of roleList" :value="role.id" :key="role.id">{{ role.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" v-if="isEditing" @click="update">确定</el-button>
                <el-button size="small" type="primary" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="passwordDialogVisible" title="修改密码" width="40%" class="x-el-dialog styl-1" size="small">
            <el-form ref="passwordFormRef" :model="passwordFormData" :rules="rules" label-width="80px" size="small">
                <el-form-item label="密码" required prop="password">
                    <el-input v-model="passwordFormData.password" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="确认密码" required prop="confirmation">
                    <el-input v-model="passwordFormData.confirmation" placeholder="请输入" />
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="small" @click="passwordDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="updatePassword">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { copyProperties, getDifference } from "@/utils/common";
import {
    del as delApi,
    save as saveApi,
    update as updateApi,
    updatePassword as updatePasswordApi,
    updateState as updateStateApi
} from "@/api/user";
import { getRolesByUserId as getRolesByUserIdApi } from "@/api/role";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUser } from "@/composables/useUser";
import { useRole } from "@/composables/useRole";

const query = reactive({
    size: 10,
    current: 1
});
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
    confirmation: ""
};
const passwordFormData = reactive({ ...defaultPasswordFormData });
const roleIds = ref([]);
const dialogVisible = ref(false);
const isEditing = computed(() => !!formData.id);
const formData = reactive({ ...defaultFormData });
const userRoleList = ref([]);
const passwordDialogVisible = ref(false);

const { list, getAllUsers, del } = useUser();

const getDefaultImage = inject('getDefaultImage');

const { getAllRoles, roles: roleList } = useRole();

const passwordFormRef = ref(null);
async function passwordFormDataValidator() {
    return await new Promise(resolve => {
        passwordFormRef.value?.validate((valid) => {
            resolve(valid);
            if (!valid) {
                return false;
            }
        });
    });
}

watch(userRoleList, (_new) => {
    roleIds.value = _new.map(item => item.id);
});

onMounted(() => {
    getAllUsers();
    getAllRoles();
});
window.addEventListener('error', (err) => {
    console.log(err);
});

function showDialogForUpdatingPassword(row) {
    passwordDialogVisible.value = true;
    Object.assign(passwordFormData, { ...defaultPasswordFormData });
    passwordFormData.id = row.id;
}

function showDialogForAdding() {
    dialogVisible.value = true;
    Object.assign(formData, { ...defaultFormData });
    userRoleList.value.length = 0;
}

function showDialogForEditing(row) {
    dialogVisible.value = true;
    Object.assign(formData, copyProperties(row, { ...defaultFormData }))
    getRolesByUserId(formData.id);
}

async function save() {
    const resp = await saveApi(formData);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        getAllUsers();
    }
}

const activated = 1;
const banned = 2;
async function updateState(formData) {
    const resp = await updateStateApi(formData);
    if (resp?.code === 0) {
        getAllUsers();
        ElMessage.success("操作成功");
    }
}

function activate(row) {
    updateState({ id: row.id, state: activated });
}

function ban(row) {
    updateState({ id: row.id, state: banned });
}

async function getRolesByUserId(id) {
    const resp = await getRolesByUserIdApi(id);
    if (resp?.code !== 0) {
        return;
    }
    userRoleList.value = resp.data;
}

const userRoleIds = computed(() => userRoleList.value.map(item => item.id));

const rules = {
    password: [
        { required: true, message: '密码不能为空', trigger: '' },
    ],
    confirmation: [
        { required: true, message: '确认密码不能为空', trigger: '' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordFormData.password) {
                    callback(new Error('两次输入密码不一致!'));
                }
                else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
};

async function updatePassword() {
    if (!await passwordFormDataValidator()) {
        return;
    }
    passwordDialogVisible.value = false;
    const resp = await updatePasswordApi(passwordFormData);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
    }
}

async function update() {
    dialogVisible.value = false;
    // 设置分配和移除的角色id
    // 分别取<选中id&已分配id的差集>和<已分配id&选中id的差集>，分别表示分配项和移除项
    formData.assigning = getDifference(roleIds.value, userRoleIds.value);
    formData.removing = getDifference(userRoleIds.value, roleIds.value);
    const resp = await updateApi(formData);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        getAllUsers();
    }
}
</script>

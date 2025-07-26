<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <template #header>
                <el-button type="primary" size="small" @click="showDialogForAdding">添加角色</el-button>
            </template>
            <el-table :data="list" style="width: 100%;" border size="small">
                <el-table-column label="序号"
                    type="index" align="center"
                    width="50">
                </el-table-column>
                <el-table-column align="center" label="ID" width="80" prop="id"></el-table-column>
                <el-table-column align="center" label="名称" width="220" prop="name"></el-table-column>
                <el-table-column align="center" label="描述" prop="description"></el-table-column>
                <el-table-column align="center" label="创建时间" width="240">
                    <template #="{ row }">
                        <span>{{ row.createdAt }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="140">
                    <template #="{ row }">
                        <el-button link size="small" @click="showDialogForEditing(row)">编辑</el-button>
                        <el-button link class="x-el-button-text" size="small" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 10px;">
                <el-pagination
                    background
                    :page-size="query.size"
                    layout="prev, pager, next"
                    :total="total" style="float: right;">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog v-model="dialogVisible" title="新增/编辑角色" width="40%" class="x-el-dialog styl-1" size="small">
            <el-form :model="formData" label-width="80px" size="small">
                <el-form-item label="名称">
                    <el-input v-model="formData.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="formData.description" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="权限">
                    <el-tree check-strictly :props="props" :default-expanded-keys="expended" ref="treeRef" :data="permissionList" show-checkbox node-key="id" :expand-on-click-node="false">
                        <template #="{ data }">
                            <span style="font-size: 14px;">
                                <el-icon v-if="data.type === PERMISSION_MENU">
                                    <Menu />
                                </el-icon>
                                <el-icon v-else><Pointer /></el-icon>
                                {{ data.name }}
                            </span>
                        </template>
                    </el-tree>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" v-if="isEditing" @click="update">确定</el-button>
                <el-button size="small" type="primary" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { useDel, usePagination, useUpdate, useDialog, useSave } from "@/composables/role";
import { computed, onMounted, reactive, ref } from "vue";
import { copyProperties, getDifference } from "@/utils/common";
import { useRolePermissionList, useList } from "@/composables/permission";
import { PERMISSION_MENU } from "@/constants/general";

const defaultFormData = {
    id: "",
    name: "",
    description: "",
};

const query = reactive({
    size: 10,
    current: 1
});

const treeRef = ref(null);
const formData = reactive({ ...defaultFormData });
const { queryPagination, list, total } = usePagination({ query });
const { getRolePermissionList, assigned } = useRolePermissionList();

// 为formData设置选中的权限
function setAssigning() {
    dialogVisible.value = false;
    formData.assigning = treeRef.value?.getCheckedKeys();
}

// 设置选中和移除的权限
function setRemovingAndAssigning() {
    dialogVisible.value = false;
    const checked = treeRef.value?.getCheckedKeys();
    // 取与assigned集合的差集：
    // 要授予的权限；
    formData.assigning = getDifference(checked, assigned.value);
    // 要移除的权限；
    formData.removing = getDifference(assigned.value, checked);
}

const { save } = useSave({
    formData, refresh: queryPagination, preHandlers: [setRemovingAndAssigning]
});
function resetFormData() {
    Object.assign(formData, defaultFormData);
}

function setFormData(row) {
    Object.assign(formData, copyProperties(row, { ...defaultFormData }))
    getRolePermissionList(row.id)
        .then(() => {
            treeRef.value?.setCheckedKeys(assigned.value);
        });
}
const { dialogVisible, showDialogForEditing, showDialogForAdding, isEditing } = useDialog({
    formData, setFormData, resetFormData
});
const { del } = useDel({ refresh: queryPagination });
const { update } = useUpdate({
    formData, refresh: queryPagination, preHandlers: [setAssigning]
});
const { getList, list: permissionList } = useList();

const expended = computed(() => {
    return permissionList.value.map(item => item.id)
});
const props = {
    label: "name",
    children: "children",
};

onMounted(() => {
    queryPagination();
    // getList();
});
</script>

<style lang="scss" scoped>
.app-container {
    .roles-table {
        margin-top: 30px;
    }
    .permission-tree {
        margin-bottom: 30px;
    }
}
</style>

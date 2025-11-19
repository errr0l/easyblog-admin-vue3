<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <template #header>
                <el-button type="primary" size="small" @click="showDialogForAdding()">新增权限</el-button>
            </template>
            <div class="mg-b-10">
                <el-tag type="success">
                    <span style="margin-right: 10px;">
                        <i class="el-icon-document" /> 菜单权限
                    </span>
                    <span>
                        <i class="el-icon-thumb"></i> 操作权限
                    </span>
                </el-tag>
            </div>
            <el-tree :data="tree" node-key="id" :default-expanded-keys="expanded" :expand-on-click-node="false">
                <template #="{ data }">
                    <span style="font-size: 14px;">
                        <el-icon v-if="data.type === PERMISSION_MENU">
                            <Menu />
                        </el-icon>
                        <el-icon v-else><Pointer /></el-icon>
                        {{ data.name }}
                    </span>
                    <span style="margin-left: 10px;">
                        <el-button v-if="data.type === PERMISSION_MENU" link size="small" @click="showDialogForAdding(data)">
                            添加
                        </el-button>
                        <el-button link size="small" style="margin-left: 0;" @click="showDialogForEditing(data)">
                            修改
                        </el-button>
                        <el-button link size="small" style="margin-left: 0;" @click="del(data)">
                            删除
                        </el-button>
                    </span>
                </template>
            </el-tree>
        </el-card>

        <el-dialog title="新增/编辑权限" v-model="dialogVisible" width="40%" size="small">
            <el-form :model="formData" label-width="80px" size="small">
                <el-form-item label="父级">
                    <el-popover ref="popoverRef" :virtual-ref="inputRef" placement="bottom-start" trigger="click" virtual-triggering>
                        <el-tree ref="treeRef" :data="menu" :props="props" node-key="id" @current-change="currentChange" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false"></el-tree>
                    </el-popover>
                    <el-input v-model="formData.parentName" ref="inputRef" :readonly="true" placeholder="" :disabled="isEditing"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio :disabled="isEditing" v-model="formData.type" :label="PERMISSION_MENU">菜单权限</el-radio>
                    <el-radio :disabled="isEditing" v-model="formData.type" :label="PERMISSION_OPERATION">操作权限</el-radio>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="权限码">
                    <el-input v-model="formData.value"></el-input>
                </el-form-item>
                <el-form-item label="路径" v-if="formData.type === PERMISSION_MENU">
                    <el-input v-model="formData.path"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer t-r">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" v-if="isEditing" @click="update">确定</el-button>
                <el-button size="small" type="primary" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { PERMISSION_MENU, PERMISSION_OPERATION } from "@/constants/general";
import { del as delApi, save as saveApi, update as updateApi } from "@/api/permission";
import { copyProperties, generateTree } from "@/utils/common";
import { usePermissionTree } from "@/composables/permission/usePermissionTree";

const defaultFormData = {
    id: "",
    type: PERMISSION_MENU,
    value: "",
    name: "",
    path: "",
    parentId: -1,
    // extra: "",
    parentName: "",
};

const formData = reactive({ ...defaultFormData });
const { getPermissionTree, tree } = usePermissionTree();
const popoverRef = ref(null);
const inputRef = ref(null);

onMounted(() => {
    getPermissionTree();
});

function del(row) {
    ElMessageBox.confirm("确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
    }).then(async () => {
        const resp = await delApi({ id: row.id });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            getPermissionTree();
        }
    });
}

const lastPermissionType = ref("");
async function save() {
    dialogVisible.value = false;
    const resp = await saveApi(formData);
    if (resp?.code === 0) {
        lastPermissionType.value = formData.type;
        ElMessage.success("操作成功");
        getPermissionTree();
    }
}

async function update() {
    dialogVisible.value = false;
    const resp = await updateApi(formData);
    if (resp?.code === 0) {
        ElMessage.success("操作成功");
        getPermissionTree();
    }
}

// 新增菜单场景：当选择父级菜单时，更新表单数据
function currentChange(row) {
    formData.parentId = row.id;
    formData.parentName = row.name;
    popoverRef.value.hide();
}

const dialogVisible = ref(false);
const isEditing = computed(() => !!formData.id);

function showDialogForAdding(row) {
    dialogVisible.value = true;
    resetFormData(row);
}

// 有两种情况：
// 1）从菜单列表处点击添加，此时传入当前节点信息；
// 2）从飞菜单处点击点击（如左上角'添加'按钮），此时row为undefined；
// dialogVisible.value赋值要在表单之前，否则会出现在nextTick中获取不到引用的问题，showDialogForAdding同理
function showDialogForEditing(row) {
    dialogVisible.value = true;
    setFormData(row);
}

const treeRef = ref(null);
function setFormData(row) {
    Object.assign(formData, copyProperties(row, { ...defaultFormData }));
    if (formData.parentId) {
        nextTick(() => {
            treeRef.value?.setCurrentKey(formData.parentId);
            // 为什么这样获取name，直接在row获取不行吗？
            formData.parentName = (treeRef.value?.getCurrentNode() || {})["name"];
        });
    }
}

function resetFormData(row) {
    Object.assign(formData, defaultFormData);
    if (lastPermissionType.value) {
        formData.type = lastPermissionType.value;
    }
    if (row) {
        formData.parentId = row.id;
        formData.parentName = row.name;
        nextTick(() => {
            treeRef.value?.setCurrentKey(formData.parentId);
        });
    }
    else {
        nextTick(() => {
            treeRef.value?.setCurrentKey(-1);
        });
    }
}

const extraOption = {
    id: -1,
    value: "1",
    name: "根节点",
    parentId: -1,
    children: []
};
const props = {
    label: "name",
    children: "children",
};

// 菜单
const menu = computed(() => {
    const _menu = generateTree(tree.value);
    return _menu.length ? [extraOption].concat(_menu) : [];
});
// 展开项
const expanded = computed(() => {
    const keys = [];
    if (!menu.value.length) {
        return keys;
    }
    for (const item of menu.value) {
        keys.push(item.id);
    }
    return keys;
});
</script>
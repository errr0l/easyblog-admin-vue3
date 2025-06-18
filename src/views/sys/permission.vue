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
            <el-tree :data="list" node-key="id" :default-expanded-keys="expanded" :expand-on-click-node="false">
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
import { PERMISSION_MENU, PERMISSION_OPERATION } from "@/constants/general";
import { useList, useMenu, useDel, useDialog, useSave, useFormData, useTree, useUpdate } from "@/composables/permission";
import { reactive, ref } from "vue";

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
const { setFormData, resetFormData, treeRef } = useFormData({ defaultFormData, formData });
const { showDialogForAdding, showDialogForEditing, dialogVisible, isEditing } = useDialog({ formData, setFormData, resetFormData });
const { getList, list } = useList();
const { menu, expanded, props } = useMenu({ permissions: list });
const { save } = useSave({ formData, refresh: getList, dialogVisible });
const { update } = useUpdate({ formData, refresh: getList, dialogVisible });
const { del } = useDel({ refresh: getList });
const popoverRef = ref(null);
const inputRef = ref(null);
const { currentChange } = useTree({ formData, popoverRef });
</script>
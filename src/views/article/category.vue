<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table el-card__header-sty-2">
            <template #header>
                <el-form :inline="true" size="small" class="x-el-form">
                    <el-form-item label="名称">
                        <el-input v-model="query.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="queryList">查询</el-button>
                        <el-button type="primary" size="small" @click="showDialogForAdding()">新增</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <el-table :data="list" style="width: 100%;" border size="small">
                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                <el-table-column align="center" label="ID" width="80" prop="id"></el-table-column>
                <el-table-column align="center" label="名称" width="100" prop="name"></el-table-column>
                <el-table-column align="center" label="封面" width="120" prop="cover">
                    <template #="{ row }">
                        <el-image style="vertical-align: middle; height: 60px;"
                            :src="row.cover || getDefaultImage()" lazy
                            fit="cover">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述" prop="description"></el-table-column>
                <el-table-column align="center" label="操作" width="180">
                    <template #="{ row }">
                        <el-button link size="small" @click="showDialogForEditing(row)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" title="新增/编辑" width="40%" class="x-el-dialog styl-1">
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
                        :http-request="httpRequest"
                        :show-file-list="false"
                        :on-success="onSuccess">
                        <img v-if="formData.cover" :src="formData.cover" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button @click="dialogVisible = false" size="small">取消</el-button>
                <el-button type="primary" size="small" v-if="isEditing" @click="update">确定</el-button>
                <el-button type="primary" size="small" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { useList, useCategoryDialog, useDel, useSave, useUpdate } from "@/composables/category";
import { reactive, ref, inject, watch } from "vue";
import { useElUpload } from "@/composables/useElUpload";
import { addIdentityForImagePath } from "@/utils/common";

const defaultFormData = {
    id: "",
    name: "",
    description: "",
    cover: ""
};
const formData = reactive({ ...defaultFormData });
const query = reactive({
    name: ""
});
function resetFormData() {
    if (formData.id) {
        Object.assign(formData, defaultFormData);
    }
}
const { list, queryList } = useList({ query });
const { del } = useDel({ refresh: queryList });
const { save } = useSave({ formData, refresh: queryList });
const { showDialogForAdding, showDialogForEditing, dialogVisible, isEditing } = useCategoryDialog({ formData, resetFormData });
const { update } = useUpdate({ formData, refresh: queryList, dialogVisible });
const { createHttpRequest, onSuccess } = useElUpload();

const cover = ref("");
const httpRequest = createHttpRequest({
    path: cover,
    postHandler: addIdentityForImagePath,
    type: 2,
});

const getDefaultImage = inject('getDefaultImage');

// 同步cover
watch(cover, (_new, _old) => {
    formData.cover = _new;
});
</script>

<template>
    <div class="app-container my-app-container site-asset">
        <el-card class="x-el-card-table el-card__body-pd-0 el-card__header-sty-1">
            <template #header>
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input value="编辑文件" class="x-el-input-b-none" readonly></el-input>
                    </div>
                    <div class="acts">
                        <el-button type="primary" size="small" @click="save">
                            <el-icon style="margin-right: 5px;" class="el-icon--right"><Edit /></el-icon>
                            保存
                        </el-button>
                    </div>
                </div>
            </template>
            <div style="display: flex; height: 100%;">
                <div style="flex: 0 0 20%; padding: 10px; overflow: scroll;">
                    <el-tree :data="list" node-key="name" highlight-current :default-expanded-keys="expanded" :expand-on-click-node="false">
                        <template #="{ data }">
                            <span style="font-size: 14px;">
                                <el-icon v-if="data.dir"><FolderOpened /></el-icon>
                                <el-icon v-else><Document /></el-icon>
                                {{ data.name }}
                            </span>
                            <span style="margin-left: 10px;">
                                <el-button @click="onEdit(data)" link size="small" v-if="data.editable">
                                    编辑
                                </el-button>
                            </span>
                        </template>
                    </el-tree>
                </div>
                <div style="flex: 4; height: inherit;">
                    <el-input ref="textareaRef" :placeholder="placeholder" type="textarea" style="height: inherit;" v-model="content" resize="none"></el-input>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { useFile, useSaveFile, useFileList } from "@/composables/site-asset";
import { ref } from "vue";

const { list, expanded } = useFileList();
const placeholder = "请选择需要编辑的文件";
const textareaRef = ref(null);
const { content, queryFile, cache, fileName } = useFile({ textareaRef });
const { save } = useSaveFile({ content, cache, name: fileName });

function onEdit(data) {
    const { parentDir, name } = data;
    const _name = parentDir + name;
    queryFile(_name);
}
</script>

<style lang="scss">
.site-asset {
    .x-el-card-table {
        .el-textarea {
            textarea {
                height: inherit;
                background-color: #333;
                color: #fff;
                padding-top: 10px;
            }
            .el-textarea__inner:focus {
                border-color: transparent !important;
            }
        }
    }
}
</style>

<style scoped>

:deep(.el-tree .el-tree-node > .el-tree-node__children) {
    overflow: scroll !important;
}
</style>
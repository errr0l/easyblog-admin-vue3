<template>
    <div class="app-container my-app-container site-asset">
        <el-card class="x-el-card-table el-card__body-pd-0 el-card__header-sty-1">
            <div slot="header" class="clearfix">
                <div style="display: flex;">
                    <div style="flex: 1;">
                        <el-input value="编辑文件" class="x-el-input-b-none" readonly>
                            <i class="el-icon-edit el-input__icon" style="color: #606266;" slot="prefix"></i>
                        </el-input>
                    </div>
                    <div class="acts">
                        <el-button type="primary" size="mini" @click="save">保存</el-button>
                    </div>
                </div>
            </div>
            <div style="display: flex; height: 100%;">
                <div style="flex: 1; margin-right: 24px; padding: 10px;">
                    <el-tree :data="list" node-key="name" highlight-current :default-expanded-keys="defaultExpandedKeys" :expand-on-click-node="false">
                        <span slot-scope="{ data }">
                            <span style="font-size: 14px;">
                                <i v-if="data.dir" class="el-icon-folder-opened" />
                                <i v-else class="el-icon-tickets" />
                                {{ data.name }}
                            </span>
                            <span style="margin-left: 10px;">
                                <el-button @click="getCustomFileContent(data)" type="text" size="mini" v-if="data.editable">
                                    编辑
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                </div>
                <div style="flex: 4; height: inherit;">
                    <el-input ref="textarea" :placeholder="placeholder" type="textarea" style="height: inherit;" v-model="content" resize="none"></el-input>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { loadResourceDetail, loadResources, save } from "@/api/site-asset";

const fileReader = new FileReader();

export default {
    data() {
        return {
            list: [],
            content: "",
            placeholder: "请选择需要编辑的文件",
            cache: {},
            name: ""
        };
    },

    computed: {
        // 默认展开第一级节点
        defaultExpandedKeys() {
            return this.list.map(item => item.name);
        }
    },
    created() {
        this.getList();
    },
    methods: {
        async getList() {
            const resp = await loadResources();
            if (resp && resp.code !== 0) {
                return this.$message.error(resp.message);
            }
            this.sort(resp.data);
            this.list = resp.data;
        },
        sort(arr) {
            arr.sort((a, b) => {
                if (a.children && !b.children) {
                    return -1;
                }
                if (!a.children && b.children) {
                    return 1;
                }
                return a.name.localeCompare(b.name);
            });
            for (const item of arr) {
                if (item.children) {
                    this.sort(item.children);
                }
            }
        },
        async loadResourceDetail(name) {
            const _content = this.cache[name];

            if (_content) {
                this.content = _content;
                return;
            }
            const params = {
                name
            };
            const resp = await loadResourceDetail(params);
            if (resp && resp.code !== 0) {
                return this.$message.error(resp.message);
            }
            const customFile = resp.data;
            const blob = new Blob([customFile.content], { type: "text/plain" });

            fileReader.readAsText(blob);
            fileReader.onloadend = (event) => {
                this.content = event.target.result;
                // 更新缓存；
                this.cache[name] = this.content;
                this.$refs.textarea.focus();
            }
        },
        getCustomFileContent(customFile) {
            const { parentDir, name } = customFile;
            this.name = parentDir + name;
            this.loadResourceDetail(this.name);
        },
        async save() {
            if (this.content == this.cache[this.name]) {
                return this.$message.warning('当前内容没有发生变化');
            }
            const params = {
                name: this.name,
                content: this.content
            };
            const resp = await save(params);
            if (resp && resp.code !== 0) {
                return this.$message.error(resp.message);
            }
            // 更新缓存
            this.cache[this.name] = this.content;
            this.$message.success("操作成功");
        }
    },
};
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
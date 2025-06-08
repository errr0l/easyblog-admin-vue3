<template>
    <div class="app-container my-app-container">
        <el-card class="x-el-card-table">
            <div slot="header" class="clearfix">
                <el-button type="primary" size="mini" @click="showDialogForAdding()">新增权限</el-button>
            </div>
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
                <span slot-scope="{ data }">
                    <span style="font-size: 14px;">
                        <i v-if="data.type === PERMISSION_MENU" class="el-icon-document" />
                        <i v-else class="el-icon-thumb" />
                        {{ data.name }}
                    </span>
                    <span style="margin-left: 10px;">
                        <el-button v-if="data.type === PERMISSION_MENU" type="text" size="mini" @click="() => showDialogForAdding(data)">
                            添加
                        </el-button>
                        <el-button type="text" size="mini" @click="() => showDialogForEditing(data)">
                            修改
                        </el-button>
                        <el-button type="text" class="x-el-button-text" size="mini" @click="() => del(data)">
                            删除
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </el-card>

        <el-dialog title="新增/编辑权限" :visible.sync="dialogVisible" width="40%" class="x-el-dialog styl-1" size="mini">
            <el-form :model="formData" label-width="80px" size="mini">
                <el-form-item label="父级">
                    <el-popover ref="popover" placement="bottom-start" trigger="click">
                        <el-tree ref="menuTree" :data="menu" :props="props" node-key="id" @current-change="currentChange" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
                        </el-tree>
                    </el-popover>
                    <el-input v-model="formData.parentName" v-popover:popover :readonly="true" placeholder="" :disabled="isEditing"></el-input>
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
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取消</el-button>
                <el-button size="mini" type="primary" v-if="isEditing" @click="update">确定</el-button>
                <el-button size="mini" type="primary" v-else @click="save">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getList, save, update, del } from "@/api/permission";
import { copyProperties } from '@/utils/common.js';
import { PERMISSION_MENU, PERMISSION_OPERATION } from "@/constants/general";

const defaultFormData = {
    id: "",
    type: PERMISSION_MENU,
    value: "",
    name: "",
    path: "",
    parentId: -1,
    // extra: "", // json数据【要做防xss攻击？】
    parentName: "",
};

const extraOption = {
    id: -1,
    value: "1",
    name: "根节点",
    parentId: -1,
    children: []
}

// 获取菜单权限
function getMenu(permissionList) {
    const p = permissionList.filter((p) => {
        if (p.type === PERMISSION_MENU) {
            if (p.children && p.children.length) {
                p.children = getMenu(p.children);
            }
            return true;
        }
        return false;
    });
    p.unshift(extraOption);
    return p;
}

// 菜单权限，除了可以看做一个页面之外，还可以看做一个权限集合；
// 即是说，即使没有特定的页面，也可以凭空构建一个'菜单权限'来存储其他权限
export default {
    data() {
        return {
            list: [],
            props: {
                label: "name",
                children: "children",
            },
            formData: {
                ...defaultFormData,
            },
            isEditing: false,
            dialogVisible: false,
            tempType: null,
            PERMISSION_MENU, PERMISSION_OPERATION
        };
    },
    computed: {
        menu() {
            if (!this.list.length) {
                return [];
            }
            // [].filter()本身不会修改数组，但是在getMenu()方法里直接对传入的数组做修改了，因此这里使用深复制再对其进行操作
            return getMenu(JSON.parse(JSON.stringify(this.list)));
        },
        expanded() {
            const keys = [];
            if (!this.menu.length) {
                return keys;
            }
            // 最多展开两层
            for (const item of this.menu) {
                keys.push(item.id);
                // const children = item.children;
                // if (children && children.length) {
                //     children.forEach(child => {
                //         keys.push(child.id);
                //     });
                // }
            }
            return keys;
        }
    },
    created() {
        this.getList();
    },
    methods: {
        async getList() {
            const resp = await getList();
            if (resp && resp.code !== 0) {
                return this.$message.error(resp.message);
            }
            this.list = resp.data;
        },
        showDialogForAdding(data) {
            this.isEditing = false;
            this.formData = { ...defaultFormData };
            if (this.tempType != null) {
                this.formData.type = this.tempType;
            }
            if (data) {
                this.formData.parentId = data.id;
                this.formData.parentName = data.name;
                this.$nextTick(() => {
                    this.$refs.menuTree.setCurrentKey(this.formData.parentId);
                });
            }
            else {
                this.formData.parentName = extraOption.name;
                this.$nextTick(() => {
                    this.$refs.menuTree.setCurrentKey(-1);
                });
            }
            this.dialogVisible = true;
        },
        async save() {
            this.dialogVisible = false;
            const resp = await save(this.formData).catch((error) => {
                console.log(error);
            });
            if (resp.code === 0) {
                this.tempType = this.formData.type;
                this.$message.success("操作成功");
                this.getList();
            }
        },
        showDialogForEditing(data) {
            this.isEditing = true;

            this.formData = copyProperties(data, { ...defaultFormData })

            this.dialogVisible = true;
            // 非根权限
            if (this.formData.parentId) {
                this.$nextTick(() => {
                    this.$refs.menuTree.setCurrentKey(this.formData.parentId);
                    this.formData.parentName =
                        (this.$refs.menuTree.getCurrentNode() || {})["name"];
                });
            }
        },
        async update() {
            this.dialogVisible = false;
            const resp = await update(this.formData).catch(
                (error) => {
                    console.log(error);
                }
            );
            if (resp.code === 0) {
                this.$message.success("操作成功");
                this.getList();
            }
        },
        del(data) {
            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await del({ id: data.id }).catch(
                    (error) => {
                        console.log(error);
                    }
                );
                if (resp.code === 0) {
                    this.$message.success("操作成功");
                    this.getList();
                }
            });
        },
        currentChange(data) {
            this.formData.parentId = data.id;
            this.formData.parentName = data.name;
            this.$refs.popover.doClose();
        },
    },
};
</script>
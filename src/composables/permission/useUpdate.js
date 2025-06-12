import { update as _ } from "@/api/permission";
import { ElMessage } from "element-plus";

/**
 * 更新权限组合函数
 * @param {Ref<Boolean>} dialogVisible 模态框显示控制
 * @param {Reactive<Object>} formData 表单
 * @param {Function} refresh 刷新方法
 * @typedef {Object} formData
 * @property {string} id - 权限id
 * @property {string} type - 权限类型
 * @property {string} value - 权限码
 * @property {string} name - 权限名称
 * @property {string} path - 路由路径
 * @property {number} parentId - 父权限id，-1 表示无父级
 * @property {string} parentName - 父级权限名称
 */
export function useUpdate({ dialogVisible, formData, refresh }) {
    async function update() {
        dialogVisible.value = false;
        const resp = await _(this.formData).catch(
            (error) => {
                console.log(error);
            }
        );
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            refresh();
        }
    }

    return { update };
}
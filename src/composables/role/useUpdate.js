import { update as _ } from "@/api/role";
import { useHandler } from "@/composables/useHandler";
import { ElMessage } from "element-plus";

export function useUpdate({ formData, refresh, preHandlers }) {
    async function update() {
        // this.dialogVisible = false;
        // const checked = this.$refs.tree.getCheckedKeys();
        // 取与permissionIdsAssigned集合的差集：
        // 要授予的权限；
        // this.formData.assigning = getDifference(checked, this.permissionIdsAssigned);
        // 要移除的权限；
        // this.formData.removing = getDifference(this.permissionIdsAssigned, checked);
        const resp = await useHandler({ func: _, preHandlers })(formData);
        if (resp?.code === 0) {
            ElMessage.error("操作成功");
            refresh();
        }
        else {
            this.$message.success("操作成功");
        }
    }

    return { update };
}
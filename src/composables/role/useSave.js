import { save as _ } from "@/api/role";
import { ElMessage } from "element-plus";
import { useHandler } from "@/composables/useHandler";

export function useSave({ formData, refresh, preHandlers = [] }) {
    async function save() {
        // dialogVisible.value = false;
        // const checked = this.$refs.tree.getCheckedKeys();
        // formData.assigning = checked;
        const resp = await useHandler({ func: _, preHandlers })(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            refresh();
        }
    }

    return { save };
}
import { save as _ } from "@/api/permission";
import { ElMessage } from "element-plus";
import { ref } from "vue";

export function useSave({ formData, refresh }) {

    // 记录上一次添加的权限类型
    const lastPermissionType = ref("");
    async function save() {
        this.dialogVisible = false;
        const resp = await _(formData).catch((error) => {
            console.log(error);
        });
        if (resp?.code === 0) {
            lastPermissionType.value = formData.type;
            ElMessage.success("操作成功");
            refresh();
        }
    }

    return { save, lastPermissionType };
}
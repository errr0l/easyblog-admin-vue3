import { save as _ } from "@/api/category";
import { ElMessage } from "element-plus";

export function useSave({ formData, refresh, dialogVisible }) {
    async function save() {
        const resp = await _(formData).catch((error) => {
            console.log(error);
        });
        if (resp?.code === 0) {
            dialogVisible.value = false;
            ElMessage.success("操作成功");
            refresh();
        }
    }

    return { save };
}
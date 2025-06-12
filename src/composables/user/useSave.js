import { save as _ } from "@/api/user";
import { ElMessage } from "element-plus";
import { useHandler } from "@/composables/useHandler";

export function useSave({ formData, refresh, postHandlers = [] }) {
    async function save() {
        const resp = await useHandler({ func: _, postHandlers })(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            refresh();
        }
    }

    return { save };
}
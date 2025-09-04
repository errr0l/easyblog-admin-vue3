import { ElMessage } from "element-plus";
import { create as _ } from "@/api/site-asset";

export function useCreateFile({ name, content }) {
    async function create() {
        const params = {
            name: name.value,
            content: content.value
        };
        const resp = await _(params);
        if (resp?.code !== 0) {
            return;
        }
        ElMessage.success("操作成功");
    }

    return { create };
}
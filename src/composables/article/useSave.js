import { ElMessage } from "element-plus";
import { save as _ } from "@/api/accountArticle";
import { useRouter } from "./useRouter";

export function useSave({ formData, skipComparison }) {
    const { back } = useRouter();
    async function save() {
        const resp = await _(formData);
        if (resp?.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    return { save };
}
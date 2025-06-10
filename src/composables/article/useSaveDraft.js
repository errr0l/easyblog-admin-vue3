import { ElMessage } from "element-plus";
import { saveDraft as _ } from "@/api/accountArticle";
import { useRouter } from "./useRouter";

export function useSaveDraft({ formData, skipComparison }) {
    const { back } = useRouter();
    async function saveDraft() {
        const resp = await _(formData);
        if (resp.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    return { saveDraft };
}
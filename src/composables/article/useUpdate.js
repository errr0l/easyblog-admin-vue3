import { ElMessage } from "element-plus";
import { update as _ } from "@/api/accountArticle";
import { useRouter } from "./useRouter";

export function useUpdate({ formData, skipComparison }) {
    const { back } = useRouter();
    async function update() {
        const resp = await _(formData);
        if (resp?.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    return { update };
}
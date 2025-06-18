import { publish as _ } from "@/api/app";
import { reactive } from "vue";
import { useSetInterval } from "../useSetInterval";
import { usePublishProgress } from "./usePublishProgress";

// 发布文章；发布时，从服务器读取进度
// toRemote表示要推送到基于git的远程仓库（github pages，或其他同类型的远程仓库）；force表示要强制生成文章（不管更新与否）
export function usePublish({ dialogVisible, progressDialogVisible }) {
    const defaultFormData = {
        toRemote: 1,
        force: 0
    };
    const formData = reactive({ ...defaultFormData });
    const { start, clear } = useSetInterval();
    const { getPublishProgress, progress, resetProgress } = usePublishProgress(clear);
    async function publish() {
        dialogVisible.value = false;
        const resp = await _(formData);
        if (resp?.code === 0) {
            progressDialogVisible.value = true;
            start(getPublishProgress);
        }
    }

    return { publish, formData, progress, resetProgress };
}
import { publish as _ } from "@/api/app";
import { reactive } from "vue";
import { useSetInterval } from "../useSetInterval";
import { usePublishProgress } from "./usePublishProgress";

// 发布文章；发布时，从服务器读取进度
export function usePublish({ dialogVisible, progressDialogVisible }) {
    const defaultFormData = {
        toGithub: 1,
        force: 0
    };
    const formData = reactive({ ...defaultFormData });
    const { start, clear } = useSetInterval();
    const { getPublishProgress, progress } = usePublishProgress(clear);
    async function publish() {
        dialogVisible.value = false;
        const resp = await _(formData);
        if (resp?.code === 0) {
            progressDialogVisible.value = true;
            start(getPublishProgress);
        }
    }

    return { publish, formData, progress };
}
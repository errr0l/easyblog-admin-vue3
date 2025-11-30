import { getPublishProgress as getPublishProgressApi, publish as publishApi } from "@/api/app";
import { reactive } from "vue";
import { useSetInterval } from "../useSetInterval";
import { EXCEPTION, SUCCESS } from "@/constants/general";

// 发布文章；发布时，从服务器读取进度
// toRemote表示要推送到基于git的远程仓库（github pages，或其他同类型的远程仓库）；force表示要强制生成文章（不管更新与否）
export function usePublish({ dialogVisible, progressDialogVisible }) {
    const defaultFormData = {
        toRemote: 1,
        force: 0,
        forceStatic: 0
    };
    const formData = reactive({ ...defaultFormData });
    const defaultProgress = {
        status: "",
        percentage: 0,
        message: ""
    };
    const progress = reactive({
        ...defaultProgress
    });
    const { start, clear } = useSetInterval();
    async function publish() {
        dialogVisible.value = false;
        const resp = await publishApi(formData);
        if (resp?.code === 0) {
            progressDialogVisible.value = true;
            start(getPublishProgress);
        }
    }

    async function getPublishProgress() {
        const resp = await getPublishProgressApi();
        if (resp?.code === 0) {
            // -1表示进行中
            const { code, percentage, message } = resp.data;
            progress.percentage = percentage;
            if (code === 0) {
                progress.status = SUCCESS;
                progress.message = message;
                clear();
            }
            else if (code === 1) {
                progress.status = EXCEPTION;
                progress.message = message;
                clear();
            }
        }
    }

    function resetProgress() {
        Object.assign(progress, defaultProgress);
    }

    return { publish, formData, progress, resetProgress };
}
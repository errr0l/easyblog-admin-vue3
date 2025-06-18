import { getPublishProgress as _ } from "@/api/app";
import { reactive } from "vue";
import { EXCEPTION, SUCCESS } from "@/constants/general";

export function usePublishProgress(clear) {
    const defaultProgress = {
        status: "",
        percentage: 0,
        message: ""
    };
    const progress = reactive({
        ...defaultProgress
    });
    async function getPublishProgress() {
        const resp = await _();
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

    return { progress, getPublishProgress, resetProgress };
}
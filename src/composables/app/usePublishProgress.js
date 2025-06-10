import { getPublishProgress as _ } from "@/api/app";
import { reactive } from "vue";
import { EXCEPTION, SUCCESS } from "@/constants/general";

export function usePublishProgress(clear) {
    const progress = reactive({
        status: "",
        percentage: 0,
        message: ""
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

    return { progress, getPublishProgress };
}
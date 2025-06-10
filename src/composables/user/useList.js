import { getList as _ } from "@/api/user";
import { ref } from "vue";

export function useList() {
    const list = ref(null);
    async function queryList() {
        const resp = await _();
        if (resp?.code === 0) {
            list.value = resp.data;
        }
    }

    return { queryList, list };
}
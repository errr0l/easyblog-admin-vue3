import { getAccountInfo as _ } from "@/api/account";
import { ref } from "vue";

export function useAccountInfo({ formData }) {
    const original = ref({});
    async function queryAccountInfo() {
        const resp = await _();
        if (resp?.code === 0) {
            original.value = resp.data;
            Object.assign(formData, resp.data);
        }
    }

    return { queryAccountInfo, original };
}
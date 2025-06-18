import { getAccountInfo as _ } from "@/api/account";
import { ref } from "vue";

/**
 * 获取账号数据；
 * @param {Reactive<Object>} formData 表单数据
 * @returns {{queryAccountInfo: ((function(): Promise<void>)|*), original: Ref<Object>}}
 */
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
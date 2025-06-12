import { getList as _ } from "@/api/user";
import { ref } from "vue";

/**
 * 用户列表处理模块；
 * @returns {{list: Ref<UnwrapRef<*[]>, UnwrapRef<*[]> | *[]>, queryList: ((function(): Promise<void>)|*)}}
 */
export function useList() {
    const list = ref([]);
    async function queryList() {
        const resp = await _();
        if (resp?.code === 0) {
            list.value = resp.data;
        }
    }

    return { queryList, list };
}
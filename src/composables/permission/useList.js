import { getList as _ } from "@/api/permission";
import { onMounted, ref } from "vue";

/**
 * 权限列表处理模块
 * @returns {{getList: ((function(): Promise<void>)|*), list: Ref<UnwrapRef<*[]>, UnwrapRef<*[]> | *[]>}}
 */
export function useList() {
    const list = ref([]);
    async function getList() {
        const resp = await _();
        if (resp?.code === 0) {
            list.value = resp.data;
        }
    }

    onMounted(() => {
       getList();
    });

    return { getList, list };
}
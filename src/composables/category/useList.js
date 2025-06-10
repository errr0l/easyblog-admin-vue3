import { getList as _getList } from "@/api/category";
import { useBaseList } from "@/composables/useBaseList";
import { onMounted } from "vue";

export function useList({ query = {} } = {}) {
    const { queryList, list } = useBaseList({
        query,
        fetch: _getList
    });

    // 关于是否要在组合式api内调用的问题，如果自身不与其他地方产生依赖的话，就在内部调用，且优先内部调用
    onMounted(() => {
        queryList();
    });

    return { queryList, list };
}
import { useBasePagination } from "@/composables/useBasePagination";
import { getPagination as _ } from "@/api/user";

/**
 * 用户分页处理模块；
 * @returns {{list: Ref<*[]>, total: Ref<Number>, queryPagination: (function(): Promise<void>), currentChange: Function, search: Function}}
 */
export function usePagination({ query }) {
    return useBasePagination({
        query,
        fetch: _
    });
}
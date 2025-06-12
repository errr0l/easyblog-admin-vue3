import { useBaseList } from "@/composables/useBaseList";
import { getList as _ } from "@/api/role";

export function useList() {
    return useBaseList({ fetch: _ })
}
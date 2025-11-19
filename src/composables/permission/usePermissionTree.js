import { ref } from "vue";
import { getPermissionTree as getPermissionTreeApi } from "@/api/permission";

export function usePermissionTree() {
    const tree = ref([]);
    async function getPermissionTree() {
        const resp = await getPermissionTreeApi();
        if (resp?.code === 0) {
            tree.value = resp.data;
        }
    }

    return { getPermissionTree, tree };
}
import { loadResources as _ } from "@/api/site-asset";
import { computed, onMounted, ref } from "vue";

export function useFileList() {
    const list = ref([]);
    async function queryList() {
        const resp = await _();
        if (resp?.code !== 0) {
            return;
        }
        sort(resp.data);
        list.value = resp.data;
    }

    function sort(list) {
        list.sort((a, b) => {
            if (a.children && !b.children) {
                return -1;
            }
            if (!a.children && b.children) {
                return 1;
            }
            return a.name.localeCompare(b.name);
        });
        for (const item of list) {
            if (item.children && item.children.length > 1) {
                sort(item.children);
            }
        }
    }

    const expanded = computed(() => {
        return list.value.map(item => item.name).filter(item => !item.startsWith("."));
    });

    onMounted(() => {
        queryList();
    });

    return { queryList, list, expanded };
}
import { getList as _ } from "@/api/permission";
import { onMounted, ref } from "vue";

/**
 * 权限列表处理模块；
 * 注意，这个权限的话，不一定对得上菜单，随便组合吧；
 * 在路由文件中，不加value表示常规路由；
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
import { getRoleListByUserId as _ } from "@/api/role";
import { computed, ref } from "vue";

// 用户角色列表处理模块
export function useUserRoleList() {
    const userRoleList = ref([]);
    // const userRoleIds = ref([]);
    async function queryUserRoleList(id) {
        const resp = await _(id);
        if (resp?.code !== 0) {
            return;
        }
        userRoleList.value = resp.data;
        // userRoleIds.value = resp.data.map(item => item.id);
    }

    const userRoleIds = computed(() => userRoleList.value.map(item => item.id))
    return { queryUserRoleList, userRoleList, userRoleIds };
}
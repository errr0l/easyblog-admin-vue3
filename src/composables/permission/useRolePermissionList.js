// 角色权限处理模块
import { getRolePermissionList as _ } from "@/api/permission";
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";

export function useRolePermissionList() {
    const list = ref([]);
    const idAssigned = ref([]);
    async function getRolePermissionList(roleId) {
        const resp = await _(roleId);
        if (resp?.code !== 0) {
            return ElMessage.error("获取角色权限失败");
        }
        list.value = resp.data;
    }

    // 已分配的权限id
    const assigned = computed(() => {
        if (!list.value.length) {
            return [];
        }
        return list.value.map(item => item.id);
    });

    return { getRolePermissionList, list, assigned };
}
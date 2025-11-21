import { listAll } from "@/api/role";
import { computed, ref } from "vue";
import { getRolePermissions as getRolePermissionsApi } from "@/api/permission";
import { ElMessage } from "element-plus";

export function useRole() {
    const roles = ref([]);
    async function getAllRoles() {
        const resp = await listAll();

        if (resp?.code === 0) {
            roles.value = resp.data;
        }
    }

    const rolePermissions = ref([]);

    // 获取角色权限
    async function getRolePermissions(roleId) {
        const resp = await getRolePermissionsApi(roleId);
        if (resp?.code !== 0) {
            return ElMessage.error("获取角色权限失败");
        }
        rolePermissions.value = resp.data;
    }

    // 已分配的权限id
    const assigned = computed(() => {
        if (!rolePermissions.value.length) {
            return [];
        }
        return rolePermissions.value.map(item => item.id);
    });

    return {
        getAllRoles, roles,
        rolePermissions, getRolePermissions, assigned
    }
}
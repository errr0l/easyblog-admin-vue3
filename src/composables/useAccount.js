import { computed } from "vue";
import { useAuth } from "@/store/useAuth";

// import { getPermissions } from "../api/permission";
// import { PERMISSION_MENU } from "@/constants/general";
// import { makeUserRoutes } from "../utils/common";
// import { asyncRoutes } from "@/router";

/**
 * 账号相关处理模块；
 */
export function useAccount() {
    const { authTokens } = useAuth();
    // const userRoutes = ref([]);

    // 按照责任划分来说，用户资料应该属于"账号"的一部分，而不属于"认证";
    const userDetails = computed(() => authTokens.baseInfo || {});
    // async function getUserRoutes() {
    //     try {
    //         const resp = await getPermissions();
    //         if (resp?.code === 0) {
    //             const menus = resp.data?.filter(item => item.type === PERMISSION_MENU) || [];
    //             if (menus.length) {
    //                 userRoutes.value = makeUserRoutes(asyncRoutes, menus.value);
    //             }
    //         }
    //     }
    //     catch (err) {
    //
    //     }
    // }

    return {
        // getUserRoutes,
        // userRoutes,
        userDetails
    };
}
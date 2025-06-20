import { defineStore } from "pinia";

import router, { asyncRoutes, constantRoutes, NOT_FOUND, resetRouter } from "@/router";
import { usePermission } from "@/composables/account/usePermission";

export const usePermissionStore = defineStore("permission", {
    state: () => ({
        routes: [],
        userRoutes: [],
        queried: false // 是否已经拉取了权限
    }),
    actions: {
        reset() {
            this.routes = [];
            this.userRoutes = [];
            this.queried = false;
        },
        setRoutes(routes) {
            this.routes = [...constantRoutes, ...routes];
            this.userRoutes = routes;
        },
        async getRoutes() {
            const { queryPermissions, makeUserRoutes, menus, success } = usePermission();
            await queryPermissions();
            let userRoutes = [];
            resetRouter();
            if (success.value) {
                userRoutes = makeUserRoutes(asyncRoutes, menus.value);
                for (let route of userRoutes) {
                    router.addRoute(route);
                }
                this.queried = true;
            }
            router.addRoute(NOT_FOUND);
            this.setRoutes(userRoutes);
        }
    }
});

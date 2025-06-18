import { defineStore } from "pinia";

import router, { asyncRoutes, constantRoutes, NOT_FOUND, resetRouter } from "@/router";
import { usePermission } from "@/composables/account/usePermission";

export const usePermissionStore = defineStore("permission", {
    state: () => ({
        routes: [],
        userRoutes: []
    }),
    actions: {
        setRoutes(routes) {
            this.routes = [...constantRoutes, ...routes];
            this.userRoutes = routes;
        },
        async getRoutes() {
            const { queryPermissions, makeUserRoutes, menus } = usePermission();
            await queryPermissions();
            const userRoutes = makeUserRoutes(asyncRoutes, menus.value);
            userRoutes.push(NOT_FOUND);
            resetRouter();
            for (let route of userRoutes) {
                router.addRoute(route);
            }
            this.setRoutes(userRoutes);
        }
    }
});

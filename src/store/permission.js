import { defineStore } from "pinia";

import { constantRoutes } from '@/router';

export const usePermissionStore = defineStore("permission", {
    state: () => ({
        routes: [],
        userRoutes: []
    }),
    actions: {
        setRoutes(routes) {
            this.routes = [...constantRoutes, ...routes];
            this.userRoutes = routes;
        }
    }
});

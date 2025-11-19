// import { defineStore } from "pinia";
//
// import router, { asyncRoutes, constantRoutes, NOT_FOUND, resetRouter } from "@/router";
// import { makeUserRoutes } from "../utils/common";
// import { PERMISSION_MENU } from "@/constants/general";
//
// export const usePermissionStore = defineStore("permission", {
//     state: () => ({
//         routes: [],
//         userRoutes: [],
//     }),
//     actions: {
//         reset() {
//             this.routes.length = 0;
//             this.userRoutes.length = 0;
//         },
//         setRoutes(routes) {
//             this.routes = [...constantRoutes, ...routes];
//             this.userRoutes = routes;
//         },
//         setDynamicRoutes(routes) {
//             const menus = routes.length ? routes.filter(item => item.type === PERMISSION_MENU) : [];
//             let userRoutes = [];
//             resetRouter();
//             if (menus.length) {
//                 userRoutes = makeUserRoutes(asyncRoutes, menus);
//                 for (let route of userRoutes) {
//                     router.addRoute(route);
//                 }
//             }
//             router.addRoute(NOT_FOUND);
//             this.setRoutes(userRoutes);
//         }
//     }
// });

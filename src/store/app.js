import { defineStore } from "pinia";

import Cookies from "js-cookie";

import { useUserStore } from "./user";
import { usePermissionStore } from "./permission";

const sidebarStatus = Cookies.get("sidebarStatus");
export const useAppStore = defineStore("app", {
    state: () => ({
        sidebar: {
            opened: sidebarStatus ? !!+sidebarStatus : true,
            withoutAnimation: false
        },
        device: "desktop",
        config: null,
        userStore: useUserStore(),
        permissionStore: usePermissionStore()
    }),
    getters: {
        token: state => state.userStore.accessToken,
        refreshToken: state => state.userStore.refreshToken,
        accessToken() {
            return this.token;
        },
        routes: state => state.permissionStore.routes
    },
    actions: {
        toggleSideBar() {
            this.sidebar.opened = !this.sidebar.opened;
            this.sidebar.withoutAnimation = false;
            if (this.sidebar.opened) {
                Cookies.set("sidebarStatus", 1);
            } else {
                Cookies.set("sidebarStatus", 0);
            }
        },
        closeSideBar({ withoutAnimation }) {
            Cookies.set("sidebarStatus", 0);
            this.sidebar.opened = false;
            this.sidebar.withoutAnimation = withoutAnimation;
        },
        toggleDevice(device) {
            this.device = device;
        },
        setConfig({ config }) {
            this.config = config;
        }
    }
});

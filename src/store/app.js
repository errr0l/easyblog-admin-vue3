import { defineStore } from "pinia";

import Cookies from "js-cookie";

import { useAuth } from "./useAuth";

const sidebarStatus = Cookies.get("sidebarStatus");
export const useAppStore = defineStore("app", {
    state: () => ({
        sidebar: {
            opened: sidebarStatus ? !!+sidebarStatus : true,
            withoutAnimation: false
        },
        device: "desktop",
        config: null,
        auth: useAuth(),
    }),
    getters: {
        accessToken: state => state.auth.authTokens.accessToken,
        isAuthenticated: state => state.auth.isAuthenticated,
        routes: state => state.auth.routes
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
        getConfig() {
            return this.config;
        },
        async loadConfig() {
            try {
                const configUrl = "/easyblog/config.json";
                this.config = await fetch(configUrl)
                    .then(res => res.json());
                return true;
            }
            catch (err) {
                console.log(err);
            }
        }
    }
});

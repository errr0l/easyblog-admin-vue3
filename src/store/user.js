import { defineStore } from "pinia";

import { resetRouter } from "@/router";
import { getPrefixForStorage } from "@/utils/common";
import { usePermissionStore } from "./permission";
import { useAppStore } from './app';

export const useUserStore = defineStore("user", {
    state: () => ({
        refreshToken: "",
        accessToken: "",
        user: {}
    }),
    actions: {
        logout() {
            resetRouter();
            const payload = {
                data: { user: {}, accessToken: "", refreshToken: "" }
            };
            this.cache(payload);
            const permissionStore = usePermissionStore();
            permissionStore.setRoutes({ routes: [] });
        },
        cache(payload) {
            const appStore = useAppStore();
            const prefix = appStore.config.PREFIX;
            const { data = {} } = payload;
            const _prefix = getPrefixForStorage(prefix);
            for (const key of Object.keys(data)) {
                let v = data[key];
                this[key] = v;
                localStorage.setItem(`${_prefix}${key}`, typeof v == 'string' ? v : JSON.stringify(v));
            }
        },
        init(payload) {
            const { prefix } = payload;
            const _prefix = getPrefixForStorage(prefix);
            this.accessToken = localStorage.getItem(`${_prefix}accessToken`);
            this.refreshToken = localStorage.getItem(`${_prefix}refreshToken`);
            this.user = JSON.parse(localStorage.getItem(`${_prefix}user`));
        }
    }
});

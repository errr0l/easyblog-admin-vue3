import { defineStore } from "pinia";

import { getPrefixForStorage, isPrimitive } from "@/utils/common";
import { usePermissionStore } from "./permission";
import { useAppStore } from './app';

const defaultState = {
    refreshToken: "",
    accessToken: "",
};

export const useUserStore = defineStore("user", {
    state: () => ({
        ...defaultState,
        user: {},
    }),
    actions: {
        logout() {
            const payload = {
                data: { ...defaultState, user: {} }
            };
            this.cache(payload);
            const permissionStore = usePermissionStore();
            permissionStore.reset();
        },
        cache(payload) {
            const appStore = useAppStore();
            const prefix = appStore.config.PREFIX;
            const { data = {} } = payload;
            const _prefix = getPrefixForStorage(prefix);
            for (const key of Object.keys(data)) {
                let v = data[key];
                this[key] = v;
                localStorage.setItem(`${_prefix}${key}`, isPrimitive(v) ? v : JSON.stringify(v));
            }
        },
        async init(payload) {
            const { prefix } = payload;
            const _prefix = getPrefixForStorage(prefix);
            this.accessToken = localStorage.getItem(`${_prefix}accessToken`);
            this.refreshToken = localStorage.getItem(`${_prefix}refreshToken`);
            this.user = JSON.parse(localStorage.getItem(`${_prefix}user`));
        },
    }
});

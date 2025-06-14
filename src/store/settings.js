import { defineStore } from "pinia";

import defaultSettings from '@/settings';

const { showSettings, fixedHeader, sidebarLogo, copyright, title, logo, loginGreeting, registerGreeting, cover } = defaultSettings;

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        showSettings: showSettings,
        fixedHeader: fixedHeader,
        sidebarLogo: sidebarLogo,
        copyright, title, logo, loginGreeting, registerGreeting, cover
    }),
    actions: {
        changeSetting: ({ key, value }) => {
            // eslint-disable-next-line no-prototype-builtins
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
    }
});

<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
                <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.module.scss";
import { useAppStore } from "@/store/app";
import { mapState } from 'pinia';
import { useSettingsStore } from "../../../store/settings";

export default {
    data() {
        return {
            settingsStore: useSettingsStore(),
            appStore: useAppStore(),
        }
    },
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(useAppStore, ["sidebar", "routes"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.settingsStore.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
    },
};
</script>

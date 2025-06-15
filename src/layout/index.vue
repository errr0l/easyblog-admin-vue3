<template>
    <div :class="classObj" class="app-wrapper">
        <Sidebar class="sidebar-container" />
        <div class="main-container">
            <div :class="{'fixed-header':fixedHeader}">
                <Navbar />
            </div>
            <AppMain />
        </div>
    </div>
</template>

<script setup>
import { Navbar, Sidebar, AppMain } from "./components";
import { useAppStore } from "@/store/app";
import { useSettingsStore } from "@/store/settings";
import { computed } from "vue";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const fixedHeader = computed(() => settingsStore.fixedHeader);
const classObj = computed(() => {
    return {
        hideSidebar: !appStore.sidebar.opened,
        openSidebar: appStore.sidebar.opened,
        withoutAnimation: appStore.sidebar.withoutAnimation
    };
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixin.scss" as *;
@use "@/styles/variables.module.scss" as *;

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>

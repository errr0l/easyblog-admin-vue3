<template>
    <div class="sidebar-logo-container" :class="{'collapse':collapse}">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 v-else class="sidebar-title">{{ title }} </h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 class="sidebar-title">{{ title }} </h1>
            </router-link>
        </transition>
    </div>
</template>

<script setup>
import logo from "@/assets/images/logo.jpg";
import { useSettingsStore } from "@/store/settings";
const settingsStore = useSettingsStore();
const title = settingsStore.title;
defineProps({
    collapse: {
        type: Boolean,
        required: true
    }
});
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container.collapse {
    padding: 0;
    text-align: center;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    // background: #2b2f3a;
    background: #fff;
    // text-align: center;
    box-sizing: border-box;
    padding: 0 20px;
    overflow: hidden;
    border-bottom: 1px solid rgb(0 21 41 / 8%);
    // box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    // z-index: 1;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
            border-radius: 5px;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            // color: #fff;
            color: #fa7872;
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>

<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb class="breadcrumb-container x-el-breadcrumb font-weight-normal" />
        <div class="right-menu">
            <div class="username x-el-button-text">
                <el-link>你好，</el-link>
                <el-link type="primary">{{ username }}</el-link>
            </div>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <i class="el-icon-caret-bottom" />
                </div>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                        <router-link to="/">
                            <el-dropdown-item>
                                主页
                            </el-dropdown-item>
                        </router-link>
                        <el-dropdown-item divided @click.native="logout">
                            <span style="display:block;">登出</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import defaultImage from '@/assets/404_images/404.png';
import { computed } from "vue";
import { useLogout } from "@/composables/auth";

const userStore = useUserStore();
const appStore = useAppStore();

const sidebar = computed(() => appStore.sidebar);
const avatar = computed(() => {
    const avatar = userStore.user.avatar;
    return avatar ? avatar : defaultImage;
});
const username = computed(() => userStore.user.username || "");

const toggleSideBar = () => appStore.toggleSideBar();
const { logout } = useLogout();
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }
        .username {
            float: left;
            margin-right: 15px;
            font-size: 13px;
        }
        .avatar-container {
            margin-right: 30px;
            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    object-fit: cover;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>

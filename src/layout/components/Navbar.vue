<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb class="breadcrumb-container x-el-breadcrumb font-weight-normal" />
        <div class="right-menu">
            <div class="username x-el-button-text">
                <el-link>你好，</el-link>
                <el-link type="primary" v-if="isAuthenticated">{{ userDetails.username }}</el-link>
                <el-link v-else @click="toLogin">请登录</el-link>
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
                        <el-dropdown-item divided @click.native="handleLogout">
                            <span style="display:block;">登出</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";

import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { useAppStore } from "@/store/app";
import { useAuth } from "@/store/useAuth";
import { useAccount } from "@/composables/useAccount";

const router = useRouter();
const authStore = useAuth();
const { isAuthenticated } = storeToRefs(authStore);
const { logout } = authStore;
const { userDetails } = useAccount();
const appStore = useAppStore();
const getDefaultImage = inject("getDefaultImage");
const sidebar = computed(() => appStore.sidebar);

const avatar = computed(() => {
    const avatar = userDetails.value.avatar;
    return avatar ? avatar : getDefaultImage();
});

const toggleSideBar = () => appStore.toggleSideBar();

const handleLogout = () => {
    ElMessageBox
        .confirm("确认登出系统？", "提示")
        .then(() => {
            logout();
            toLogin();
        }).catch(() => {
        });
};

const toLogin = () => {
    router.push("/login");
};
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

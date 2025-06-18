<template>
    <div id="main">
        <div class="container">
            <div class="left">
                <img :src="cover" alt="">
            </div>
            <div class="right">
                <div class="content">
                    <div class="item logo mg-b-10">
                        <img :src="logo" alt="">
                        <h2 class="name unselectable">{{ title }}</h2>
                    </div>
                    <h2 class="item greeting mg-b-10 unselectable" v-html="registerGreeting"></h2>
                    <div class="item mg-b-10">
                        <div>
                            <input class="username input-1" v-model="formData.username" placeholder="用户名" type="text" @blur="checkUesrname">
                        </div>
                        <div>
                            <input class="input-1" v-model="formData.introduction" placeholder="简介" type="text">
                        </div>
                        <div>
                            <input class="password input-1" v-model="formData.password" placeholder="密码" type="password">
                        </div>
                        <div>
                            <input class="input-1" v-model="formData.password2" placeholder="确认密码" type="password">
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input class="input-1" style="flex: 1;" v-model="formData.email" placeholder="邮箱" type="text">
                            <span :class="['btn-send', disabled ? 'disabled' : '']" @click="sendEmailCode" v-text="btnText"></span>
                        </div>
                        <div>
                            <input class="input-1" style="width: 50%;" v-model="formData.captcha" placeholder="验证码" type="text">
                        </div>
                    </div>
                    <div class="item forget mg-b-20">
                        <p>
                            <span class="c-p link">已有账号? </span>
                            <span class="btn-login" @click="toLogin">登陆</span>
                        </p>
                    </div>
                    <div class="item mg-b-5">
                        <el-button style="width: 100%;" type="primary" @click="register" size="small">注册</el-button>
                    </div>
                    <div class="item t-a copyright unselectable">
                        {{ copyright }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSettingsStore } from "@/store/settings";
import { onMounted, reactive } from "vue";
import { useOauth2Register, useSendEmailCode } from "@/composables/auth";
import { useCheckEmailHandler } from "./composables/useCheckEmailHandler";
import { useCheckFormDataHandler } from "./composables/useCheckFormDataHandler";
import { useCheckUsernameHandler } from "./composables/useCheckUsernameHandler";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { OAUTH } from "@/constants/general";

const route = useRoute();
const defaultFormData = {
    username: "",
    password: "",
    password2: "",
    introduction: "",
    captcha: "",
    code: "",
    email: ""
};
const formData = reactive({
    ...defaultFormData
});
const settingsStore = useSettingsStore();
const { copyright, registerGreeting, logo, cover, title } = settingsStore;
const { checkUsername } = useCheckUsernameHandler();
const { checkFormData } = useCheckFormDataHandler();
const { register, toLogin } = useOauth2Register({ formData, preHandlers: [checkFormData, checkUsername] });

function setFormData(userinfo, code) {
    Object.assign(formData, userinfo);
    formData.code = code;
}

function initialize(code) {
    const _userinfo = sessionStorage.getItem('userinfo');
    if (!_userinfo) {
        ElMessage.error("未知错误");
        return;
    }
    try {
        const userinfo = JSON.parse(_userinfo);
        setFormData(userinfo, code);
    } catch (error) {
        console.log(error);
        ElMessage.error("未知错误");
    }
}
const { checkEmail } = useCheckEmailHandler();
const { sendEmailCode, btnText, disabled } = useSendEmailCode({ formData, preHandlers: [checkEmail] });

onMounted(() => {
    const { from, code } = route.query;
    if (from === OAUTH) {
        initialize(code);
    }
});
</script>

<style lang="scss" scoped>
.captcha {
    cursor: pointer;
    width: 100px;
    height: 28px;
}

#main {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#main .container {
    width: 880px;
    height: 457px;
    border-radius: 10px;
    box-shadow: 2px 4px 10px rgb(224, 224, 224);
    display: flex;
    overflow: hidden;
    scale: 1.1;
}

#main .container .left {
    flex: 1;
    overflow: hidden;
}

#main .container .right {
    width: 33%;
    position: relative;
    padding: 22px 0 50px 0;
}

#main .container .right .content {
    width: 80%;
    margin: 0 auto;
    vertical-align: middle;
}

.logo {
    display: flex;
    align-items: center;
}

.logo .name {
    margin-left: 5px;
    font-size: 14px;
    color: #fa7872;
    font-weight: 600;
}

.logo img {
    width: 40px; height: 40px; border-radius: 50%;
}

.greeting {
    font-size: 24px;
    font-weight: 600;
}
.greeting .name {
    font-size: 14px;
}

.input-1 {
    border: none;
    padding: 11px 0 6px 0;
    display: inline-block;
    width: 100%;
    height: inherit;
    border-bottom: 1px solid #909399;
    transition: all 0.5s;
    font-size: 13px;
    box-shadow: 0 0 0 1000px white inset !important;
}

.input-1:focus {
    border-color: #333;
    padding-left: 4px;
    color: #333;
}

.copyright {
    width: 100% !important;
    height: 50px;
    color: #909399;
    font-size: 12px;
    line-height: 1.6;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.forget {
    color: #909399;
    font-size: 12px;
}

.message {
    height: 3em;
    max-height: 3em;
    overflow: hidden;
    color: #fa7872;
    font-weight: 500;
    font-size: 12px;
}

.no-account {
    color: #909399;
    font-size: 12px;
}

.btn-login {
    color: rgb(250, 120, 114);
    cursor: pointer;
}
.btn-send {
    display: flex; align-items: center; margin-left: 10px; cursor: pointer; height: 28px; font-size: 13px; color: #fa7872;
}
.btn-send.disabled {
    color: #bfbfbf;
    cursor: not-allowed;
}
</style>

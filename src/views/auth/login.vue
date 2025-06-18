<template>
    <div class="wrapper">
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
                    <h2 class="item greeting mg-b-10 unselectable" v-html="loginGreeting"></h2>
                    <div class="item mg-b-5">
                        <div>
                            <input class="username input-1" v-model="formData.username" placeholder="用户名/邮箱" type="text">
                        </div>
                        <div>
                            <input class="password input-1" style="width: 75%;" v-model="formData.password" placeholder="密码" type="password">
                        </div>
                        <div>
                            <input class="input-1" style="width: 50%;" v-model="formData.captcha" placeholder="验证码" type="text">
                        </div>
                    </div>
                    <div class="item" style="margin-bottom: 15px;">
                        <div class="captcha-wrapper" style="height: 30px;">
                            <!-- <img class="captcha" :src="captchaBase64" alt="captcha" @click="refreshCaptcha" /> -->
                            <p id="wait" v-if="!captcha.image" style="cursor: pointer; height: 28px; font-size: 13px; color: #fa7872;" @click="refresh">点击获取验证码</p>
                            <img class="captcha" v-else :src="captcha.image" alt="captcha" @click="refresh" />
                        </div>
                    </div>
                    <div class="item mg-b-5">
                        <el-button style="width: 100%;" type="primary" size="small" @click="login">登陆</el-button>
                    </div>
                    <!--                    <div class="item forget mg-b-10">-->
                    <!--                        <p class="t-r">-->
                    <!--                            <span class="c-p link">忘记密码?</span>-->
                    <!--                        </p>-->
                    <!--                    </div>-->
                    <div class="item forget mg-b-10">
                        <p>
                            <span class="c-p link" style="cursor: pointer;" @click="authorize">YA授权登录</span>
                        </p>
                    </div>
                    <!--                    <div class="item message">-->
                    <!--                        <span v-text="message"></span>-->
                    <!--                    </div>-->
                    <div class="item t-a copyright unselectable">
                        {{ copyright }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLogin, useOauth2Authorize, useCaptcha } from "@/composables/auth";
import { onMounted, reactive, watch } from "vue";
import { useSettingsStore } from "@/store/settings";

const settingsStore = useSettingsStore();
const { copyright, loginGreeting, logo, cover, title } = settingsStore;

const formData = reactive({
    username: "",
    password: "",
    captcha: "",
    uuid: ""
});
const { login } = useLogin({ formData });
const { getCaptcha, refresh, captcha } = useCaptcha();
const { authorize } = useOauth2Authorize();

watch(() => captcha.uuid, (_new) => {
    formData.uuid = _new;
});

onMounted(() => {
    getCaptcha();
});
</script>

<style lang="scss" scoped>

.wrapper {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.captcha {
    cursor: pointer;
    width: 100px;
    height: 28px;
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
</style>

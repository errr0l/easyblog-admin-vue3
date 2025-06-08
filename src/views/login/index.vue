<template>
    <div id="main">
        <div class="container">
            <div class="left">
                <img src="@/assets/images/3.webp" alt="">
            </div>
            <div class="right">
                <div class="content">
                    <div class="item logo mg-b-10">
                        <img src="@/assets/images/4.webp" alt="">
                        <h2 class="name unselectable">Errol's Blog Admin</h2>
                    </div>
                    <h2 class="item greeting mg-b-10 unselectable">
                        <span style="font-size: 20px;">Hello,</span>
                        <br/>
                        Welcome! <span></span></h2>
                    <div class="item mg-b-5">
                        <div>
                            <input class="username input-1" v-model="loginForm.username" placeholder="用户名/邮箱" type="text">
                        </div>
                        <div>
                            <input class="password input-1" style="width: 75%;" v-model="loginForm.password" placeholder="密码" type="password">
                        </div>
                        <div>
                            <input class="input-1" style="width: 50%;" v-model="loginForm.captcha" placeholder="验证码" type="text">
                        </div>
                    </div>
                    <div class="item" style="margin-bottom: 15px;">
                        <div class="captcha-wrapper" style="height: 30px;">
                            <!-- <img class="captcha" :src="captchaBase64" alt="captcha" @click="refreshCaptcha" /> -->
                            <p id="wait" v-if="!captchaBase64" style="cursor: pointer; height: 28px; font-size: 13px; color: #fa7872;" @click="refreshCaptcha">点击获取验证码</p>
                            <img class="captcha" v-else :src="captchaBase64" alt="captcha" @click="refreshCaptcha" />
                        </div>
                    </div>
                    <div class="item mg-b-5">
                        <el-button style="width: 100%;" type="primary" size="small" @click="login">登陆</el-button>
                    </div>
                    <!-- <div class="item forget mg-b-10">
                        <p class="t-r">
                            <span class="c-p link">忘记密码?</span>
                        </p>
                    </div> -->
                    <div class="item forget mg-b-10">
                        <p>
                            <span class="c-p link" style="cursor: pointer;" @click="authorize">YA授权登录</span>
                        </p>
                    </div>
                    <div class="item message">
                        <span v-text="message"></span>
                    </div>
                    <div class="item t-a copyright unselectable">
                        Copyright © 2023 Errol All Rights Reserved.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { login } from "@/api/account";
import { getCaptcha } from "@/api/captcha";
import { useAppStore } from "../../store/app";

export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
                captcha: "",
                uuid: ""
            },
            loading: false,
            passwordType: "password",
            redirect: undefined,
            message: "",
            captchaBase64: "",
            store: useAppStore(),
            mainEle: null
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    methods: {
        refreshCaptcha() {
            this.getCaptcha();
        },
        login() {
            if (!this.loginForm.username || !this.loginForm.password) {
                return this.$message.error("账号或密码不能空");
            }
            if (!this.loginForm.captcha) {
                return this.$message.error("验证码不能空");
            }
            login(this.loginForm)
                .then(resp => {
                    if (resp.code === 0) {
                        this.$message.success("登陆成功");
                        this.$router.push({ path: this.redirect || '/' });
                        const { accessToken, refreshToken, baseInfo: user } = resp.data;
                        // this.$store.dispatch('user/cache', { data: { accessToken, refreshToken, user } });
                        this.store.userStore.cache({
                            prefix: this.store.config.PREFIX,
                            data: { accessToken, refreshToken, user }
                        });
                    }
                }).finally(() => {
                    this.loading = false;
                });
        },
        async getCaptcha() {
            const resp = await getCaptcha();
            if (resp.code === 0) {
                this.captchaBase64 = resp.data.image;
                this.loginForm.uuid = resp.data.uuid;
            }
        },
        // 1）跳转至授权页面；
        // 2）授权后从授权页面回到/oauth2/callback；
        // 3）使用code登陆？
        // 4）接着就是一般的流程，如果没有注册就跳转至注册页面
        authorize() {
            const { OAUTH_REDIRECT_URI, OAUTH_AUTHORIZATION_URI, OAUTH_CLIENT_ID } = this.store.config.OAUTH;
            const redirectUrl = encodeURIComponent(OAUTH_REDIRECT_URI);
            const state = Math.floor(Math.random() * 100);
            location.href = encodeURI(`${OAUTH_AUTHORIZATION_URI}?redirect_uri=${redirectUrl}&client_id=${OAUTH_CLIENT_ID}&response_type=code&state=${state}&scope=openid profile email`);
        }
    },
    mounted() {
        this.mainEle = document.querySelector("#main");
        this.mainEle.classList.add("login");
    },
    destroyed() {
        this.mainEle.classList.remove("login");
    }
};
</script>

<style>
#main.login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<style lang="scss" scoped>
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

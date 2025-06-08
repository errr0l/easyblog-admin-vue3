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
                        <span style="font-size: 20px;">REGISTRATION</span>
                    </h2>
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
                            <span style="display: flex; align-items: center; margin-left: 10px; cursor: pointer; height: 28px; font-size: 13px; color: #fa7872;" @click="sendEmailCode" v-text="btnText"></span>
                        </div>
                        <div>
                            <input class="input-1" style="width: 50%;" v-model="formData.captcha" placeholder="验证码" type="text">
                        </div>
                    </div>
                    <!-- <div class="item" style="margin-bottom: 15px;">
                        <div class="captcha-wrapper" style="height: 30px;">
                            <p style="cursor: pointer; height: 28px; font-size: 13px; color: #fa7872;" @click="refreshCaptcha">点击获取验证码</p>
                        </div>
                    </div> -->
                    <div class="item forget mg-b-20">
                        <p>
                            <span class="c-p link">已有账号? </span>
                            <span style="color: rgb(250, 120, 114); cursor: pointer;" @click="toLogin">登陆</span>
                        </p>
                    </div>
                    <div class="item mg-b-5">
                        <el-button style="width: 100%;" type="primary" @click="register" size="small">注册</el-button>
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
import { emailRule, applyingInterceptors } from "@/utils/common";
import { CustomException } from "@/exception/CustomException";

let { sendEmailCode } = require("@/api/captcha");
let { register } = require("@/api/oauth");
let { checkEmail, checkUsername } = require("@/api/account");

const OAUTH = "oauth";

// 前置处理器
const interceptors = [
	{
		preHandle({ args, errors }) {
			const { username, password, password2, email, captcha } = args[0];
			if (!username) {
				errors.push("账号不能为空");
			}
			if (!password || !password2) {
				errors.push("（二次）密码不能为空");
			}
			else {
				if (password && password2 && (password != password2)) {
					errors.push("二次密码输入不正确");
				}
			}
			if (!email) {
				errors.push("邮箱不能为空");
			}
			else {
				if (!emailRule.test(email)) {
					errors.push("邮箱格式不正确");
				}
			}
			if (!captcha) {
				errors.push("验证码不能为空");
			}
		}
	}
];

// 将业务和校验逻辑分离，避免过于耦合；
register = applyingInterceptors(register, interceptors);

const interceptors2 = [
	{
		preHandle({ args, errors }) {
			const { email } = args[0];
			if (!email) {
				errors.push("邮箱不能为空");
			}
			else {
				if (!emailRule.test(email)) {
					errors.push("邮箱格式不正确");
				}
			}
		}
	},
    {
        group: 2,
		preHandle({_this }) {
            if (_this.cd != CD) {
                return 0;
            }
			let timer = setInterval(() => {
                _this.cd = _this.cd - 1;
                _this.btnText = `${_this.cd}秒后重试`;
                if (_this.cd === 0) {
                    _this.cd = CD;
                    _this.btnText = defaultBtnText;
                    clearInterval(timer);
                }
            }, 1000);
		}
	},
];

const defaultBtnText = '获取验证码';
const CD = 60; // 一分钟
const defaultFormData = {
    username: "",
    password: "",
    password2: "",
    introduction: "",
    captcha: "",
    code: "",
    email: ""
};

export default {
    data() {
        return {
            formData: {
                ...defaultFormData
            },
            btnText: defaultBtnText,
            cd: CD, existedUsername: false
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
    created() {
        sendEmailCode = applyingInterceptors(sendEmailCode, interceptors2).bind(this);
        const { from, code } = this.$route.query;
        this.formData.code = code;
        if (from === OAUTH) {
            this.initialize();
        }
    },
    methods: {
        async checkUesrname() {
            const username = this.formData.username;
            if (!username) {
                return;
            }
            const resp = await checkUsername(username);
            if (resp && resp.code == 0) {
                this.existedUsername = resp.data.existed;
                if (this.existedUsername) {
                    this.$message.warning("用户名已经存在");
                }
            }
        },
        async register() {
            if (this.existedUsername) {
                return this.$message.warning("用户名已经存在");
            }
			try {
				const resp = await register(this.formData);
                if (resp && resp.code == 0) {
                    this.$message.success("成功，请等待审核");
                    this.toLogin();
				}
			} catch (error) {
                console.log(error);
				if (error instanceof CustomException) {
                    this.$message.error(error.defaultErrorMessage);
				}
			}
		},
        async sendEmailCode() {
            try {
                const emailResp = await checkEmail(this.formData.email);
                if (!emailResp || !emailResp.data) {
                    console.log('非预期请求结果');
                    return;
                }
                if (emailResp.data.existed === true) {
                    return this.$message.error("当前邮箱已经被注册");
                }
                
                if (emailResp.data.existed !== false) {
                    console.log('非预期请求结果');
                    return;
                }
                const params = {
                    email: this.formData.email
                };
                const resp = await sendEmailCode(params);
				if (resp && resp.code == 0) {
                    this.$message.success("发送成功");
				}
			} catch (error) {
                console.log(error);
				if (error instanceof CustomException) {
                    this.$message.error(error.defaultErrorMessage);
				}
			}
        },
        // 初始化用户信息
        initialize() {
            const userinfoStr = sessionStorage.getItem('userinfo');
            if (!userinfoStr) {
                this.$message.error("未知错误");
                return;
            }
            try {
                const userinfo = JSON.parse(userinfoStr);
                this.setFormData(userinfo);
            } catch (error) {
                console.log(error);
                this.$message.error("未知错误");
            }
        },
        toLogin() {
            this.$router.push("/login");
        },
        setFormData(userinfo) {
            for (const key of Object.keys(defaultFormData)) {
                if (key in userinfo) {
                    this.formData[key] = userinfo[key];
                }
            }
        }
    },
};
</script>

<style lang="scss">
</style>

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
</style>

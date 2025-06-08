<template>
    <div class="app-container my-app-container" style="height: 100vh;">
        <el-dialog :visible.sync="dialogVisible" title="授权失败" width="40%" class="x-el-dialog styl-1" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
            <div style="margin-bottom: 20px;">
                <el-alert
                    :title="error"
                    :description="description" show-icon :closable="false"
                    :type="type">
                </el-alert>
            </div>
            
            <div style="text-align: right;">
                <el-button type="primary" size="mini" @click="$router.replace('/login')">返回登录</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import base64js from 'base64-js';
// import request from '@/utils/request';
// import * as jwt from 'jsonwebtoken';
import { login } from "@/api/oauth";
import { useUserStore } from "../../store/user";

// const publicKey = `
// -----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx135eFDFKeyiGajPJwXj
// jwfFNMHwfXQBVp7oKRH4OYmUompT/V/wR35iPykwxUzdt8WAzc0Ae8EXidguqqox
// gAyH5WXDFKPdSdVZ3gOC2kJbwUkW6QUyPKXyS2DFknFPH5qdiuohuPCGnkDjo9Ta
// XnJeozk434CTczwDXg3Q3tbrgD7tnDqEdOw8njiLmAVELMmycV2XJg4qo0k7RVbZ
// PH5CVNoMENb+l0GD1xstLsH2vMInawgrGAEMsKxtYiUYjRmDSxrdbP6bDYLSQiI3
// jE6F3llj6csb+dsNUkhPy71LUxh0rV46H8lx01N74YMullMJf/BxT9FwKx/1OOcv
// RQIDAQAB
// -----END PUBLIC KEY-----
// `;

export default {
    data() {
        return {
            error: "",
            description: "",
            code: "",
            // tokenResp: {},
            // bodyStyle: {
            //     display: 'flex',
            //     flexDirection: 'column'
            // },
            dialogVisible: false,
            redirect: "",
            type: "error",
            userStore: useUserStore()
        }
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
        const { error, error_description, code } = this.$route.query;
        if (error) {
            this.dialogVisible = true;
            this.error = error;
            this.description = error_description;
        }
        else if (code) {
            this.code = code;
            this.loginByCode(code);
        }
        else {
            this.dialogVisible = true;
            this.error = "授权码不能为空";
        }
    },
    methods: {
        // 这个接口会比较花时间：前端请求接口后，接口服务器需要再请求接口
        async loginByCode(code) {
            const resp = await login({ code });
            if (resp.code === 0) {
                // 如果没有返回令牌，表示该用户未注册
                const respData = resp.data;
                if (!respData.accessToken) {
                    sessionStorage.setItem('userinfo', JSON.stringify(respData.baseInfo));
                    return this.$router.replace("/register?from=oauth&code="+this.code);
                }
                // 登陆成功
                else {
                    this.$message.success("登陆成功");
                    this.$router.push({ path: this.redirect || '/' });
                    const { accessToken, refreshToken, baseInfo: user } = resp.data;
                    // this.$store.dispatch('user/cache', { data: { accessToken, refreshToken, user } });
                    this.userStore.cache({ data: { accessToken, refreshToken, user } });
                    return;
                }
            }
            if (resp.code === 40102) {
                this.type = "warning";
            }
            // this.error = "授权失败";
            this.error = resp.message || "服务器开了小差。。";
            this.dialogVisible = true;
        },
        // 该动作应该由后端执行；
        // async getToken() {
        //     const clientId = 1;
        //     const secret = `${clientId}:123`;
        //     const encoded = new TextEncoder().encode(secret);
        //     const resp = await request({
        //         method: "post",
        //         baseURL: "http://127.0.0.1:8080",
        //         url: "/api/easyums/auth/oauth2/token",
        //         headers: {
        //             'Authorization': 'Basic ' + base64js.fromByteArray(encoded)
        //         },
        //         data: {
        //             grant_type: "authorization_type",
        //             code: this.code,
        //             client_id: clientId,
        //             redirect_uri: 'http://localhost:9528/easyblog/admin/#/oauth2/callback'
        //         },
        //         silence: true
        //     });
        //     console.log(resp);
        //     if (!resp.error) {
        //         try {
        //             const decoded = jwt.verify(resp.payload.id_token, publicKey);
        //             console.log(decoded);
        //         } catch (error) {
        //             console.log('id_token verifying failure.');
        //             console.log(error);
        //         }
        //     }
        //     this.tokenResp = resp;
        // },
        // goback() {
        //     this.$router.push('/login');
        // },
        // async getUserinfo() {
        //     let token = "";
        //     if (this.tokenResp.payload) {
        //         token = this.tokenResp.payload.access_token;
        //     }
        //     const resp = await request({
        //         baseURL: "http://127.0.0.1:8080",
        //         url: "/api/easyums/auth/oauth2/userinfo",
        //         headers: {
        //             'Authorization': 'Bearer ' + token
        //         },
        //         silence: true
        //     });
        //     console.log(resp)
        // },
        // async withoutAuthorization() {
        //     const resp = await request({
        //         baseURL: "http://127.0.0.1:8080",
        //         url: "/api/easyums/auth/oauth2/userinfo",
        //         silence: true
        //     });
        //     console.log(resp);
        // },
    }
}
</script>

<style lang="scss" scoped>
    .ul {
        li {
            margin-bottom: 20px;
        }
    }
</style>
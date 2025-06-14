import { useAppStore } from "@/store/app";

export function useOauth2Authorize() {
    // 1）跳转至授权页面；
    // 2）授权后从授权页面回到/oauth2/callback；
    // 3）使用code登陆；
    // 4）接着就是一般的流程，如果没有注册就跳转至注册页面；
    const appStore = useAppStore();
    function authorize() {
        const { OAUTH_REDIRECT_URI, OAUTH_AUTHORIZATION_URI, OAUTH_CLIENT_ID } = appStore.config.OAUTH;
        const redirectUrl = encodeURIComponent(OAUTH_REDIRECT_URI);
        const state = Math.floor(Math.random() * 100);
        location.href = encodeURI(`${OAUTH_AUTHORIZATION_URI}?redirect_uri=${redirectUrl}&client_id=${OAUTH_CLIENT_ID}&response_type=code&state=${state}&scope=openid profile email`);
        //console.log(encodeURI(`${OAUTH_AUTHORIZATION_URI}?redirect_uri=${redirectUrl}&client_id=${OAUTH_CLIENT_ID}&response_type=code&state=${state}&scope=openid profile email`));
    }

    return { authorize };
}
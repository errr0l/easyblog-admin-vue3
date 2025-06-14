import request from '@/utils/request';

export function oauth2Login(data) {
    return request({
        url: '/oauth/login',
        method: 'post',
        data,
        silence: true,
        timeout: 10000,
    });
}

export function oauth2Register(data) {
    return request({
        url: '/oauth/register',
        method: 'post',
        data
    });
}


// 检查邮箱【注册时】
export function checkEmail(email) {
    return request({
        url: '/account/checkEmail',
        method: 'get',
        params: {
            email
        }
    });
}

// 检查邮箱【注册时】
export function checkUsername(username) {
    return request({
        url: '/account/check/username',
        method: 'get',
        params: {
            username
        }
    });
}

export function sendEmailCode(data) {
    return request({
        url: '/captcha/emailVerifyCode',
        method: 'post',
        data
    });
}
import request from '@/utils/request';

export function getCaptcha() {
    return request({
        url: '/captcha/',
        method: 'get'
    });
}

export function sendEmailCode(data) {
    return request({
        url: '/captcha/emailVerifyCode',
        method: 'post',
        data
    });
}
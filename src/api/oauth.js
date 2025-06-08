import request from '@/utils/request';

export function login(data) {
    return request({
        url: '/oauth/login',
        method: 'post',
        data,
        silence: true,
        timeout: 10000,
    });
}

export function register(data) {
    return request({
        url: '/oauth/register',
        method: 'post',
        data
    });
}
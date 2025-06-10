import request from '@/utils/request';

export function login(data) {
    return request({
        url: '/account/login',
        method: 'post',
        data
    });
}

export async function refresh(data) {
    return request({
        url: '/account/refresh',
        method: 'post',
        data
    });
}

export function logout() {
    return request({
        url: '/account/logout',
        method: 'post'
    });
}

// 获取账户信息
export function getAccountInfo() {
    return request({
        url: '/account/info',
        method: 'get'
    });
}

// 更新账户信息
export function updateAccountInfo(data) {
    return request({
        url: '/account/update',
        method: 'post',
        data
    });
}

// 更新头像
export function updateAvatar(data) {
    return request({
        url: '/account/updateAvatar',
        method: 'post',
        data
    });
}

// 更新密码
export function updatePassword(data) {
    return request({
        url: '/account/updatePassword',
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
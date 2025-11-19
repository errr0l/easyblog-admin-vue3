import request from '@/utils/request';

export function authenticate(credentials) {
    return request({
        url: '/auth/authenticate',
        method: 'post',
        data: credentials
    });
}

export async function refresh(token) {
    return request({
        url: '/auth/refresh',
        method: 'post',
        data: {
            refreshToken: token
        }
    });
}
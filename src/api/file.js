import request from '@/utils/request';

export function uploadImage(data, params) {
    return request({
        url: '/file/image/upload',
        method: 'post',
        data,
        params
    });
}
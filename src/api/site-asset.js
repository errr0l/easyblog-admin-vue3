import request from '@/utils/request';

export function loadResources() {
    return request({
        url: '/app/resource/list',
        method: 'get'
    });
}

export function loadResourceDetail(data) {
    return request({
        url: '/app/resource/detail',
        method: 'get',
        params: data
    });
}

export function save(data) {
    return request({
        url: '/app/resource/save',
        method: 'post',
        data
    });
}
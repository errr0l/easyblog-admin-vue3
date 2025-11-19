import request from '@/utils/request';

// 获取文章分类列表
export function listAll(query) {
    return request({
        url: '/category/all',
        method: 'get',
        params: query
    });
}

// 创建分类
export function create(data) {
    return request({
        url: '/category/create',
        method: 'post',
        data
    });
}

// 删除分类
export function del(data) {
    return request({
        url: '/category/del',
        method: 'post',
        data
    });
}

// 更新分类
export function update(data) {
    return request({
        url: '/category/update',
        method: 'post',
        data
    });
}
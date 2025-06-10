import request from '@/utils/request';

// 获取文章分类列表
export function getList(data) {
    return request({
        url: '/category/list',
        method: 'get',
        params: data
    });
}

// 保存分类
export function save(data) {
    return request({
        url: '/category/save',
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
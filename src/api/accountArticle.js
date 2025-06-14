import request from '@/utils/request';

// 保存文章
export function save(data) {
    return request({
        url: '/account/article/save',
        method: 'post',
        data
    });
}

// 更新文章
export function update(data) {
    return request({
        url: '/account/article/update',
        method: 'post',
        data
    });
}

// 删除文章
export function del(data) {
    return request({
        url: '/account/article/del',
        method: 'post',
        data
    });
}

// 物理删除
export function doDel(data) {
    return request({
        url: '/account/article/doDel',
        method: 'post',
        data
    });
}

// 获取文章分页
export function getPagination(data) {
    return request({
        url: '/account/article/pagination',
        method: 'get',
        params: data
    });
}

// 获取文章详情
export function getDetail(id) {
    return request({
        url: `/account/article/${id}/detail`,
        method: 'get'
    });
}

// 保存草稿
export function saveDraft(data) {
    return request({
        url: `/account/article/saveDraft`,
        method: 'post',
        data
    });
}

// 提交审核
export function submit(data) {
    return request({
        url: `/account/article/submit`,
        method: 'post',
        data
    });
}

// 撤回
export function cancel(data) {
    return request({
        url: `/account/article/cancel`,
        method: 'post',
        data
    });
}

// 确认
export function confirm(data) {
    return request({
        url: `/account/article/confirm`,
        method: 'post',
        data
    });
}

// 恢复文章
export function recover(data) {
    return request({
        url: `/account/article/recover`,
        method: 'post',
        data
    });
}
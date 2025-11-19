import request from '@/utils/request';

/**
 * 创建文章
 * @param {Object} article 
 * @returns 
 */
export function create(article) {
    return request({
        url: '/article/create',
        method: 'post',
        data: article
    });
}

// 更新文章
export function update(article) {
    return request({
        url: '/article/update',
        method: 'post',
        data: article
    });
}

// 删除文章
export function del(id) {
    return request({
        url: `/article/${id}/del`,
        method: 'put'
    });
}

// 获取文章分页
export function list(query) {
    return request({
        url: '/article/list',
        method: 'get',
        params: query
    });
}

// export function getMyPagination(query) {
//     return request({
//         url: '/article/pagination',
//         method: 'get',
//         params: query
//     });
// }

// 获取文章详情
export function getDetail(id) {
    return request({
        url: `/article/${id}/detail`,
        method: 'get'
    });
}

export function getStatistic() {
    return request({
        url: `/article/statistic`,
        method: 'get'
    });
}

export function audit(auditDto) {
    return request({
        url: `/article/audit`,
        method: 'post',
        data: auditDto
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

// 创建草稿
export function createDraft(data) {
    return request({
        url: `/article/create-draft`,
        method: 'post',
        data
    });
}

export function updateDraft(data) {
    return request({
        url: `/article/update-draft`,
        method: 'post',
        data
    });
}
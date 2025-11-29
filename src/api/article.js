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
export function submit(id) {
    return request({
        url: `/article/${id}/submit`,
        method: 'post'
    });
}

// 撤回
export function cancel(id) {
    return request({
        url: `/article/${id}/cancel`,
        method: 'post',
    });
}

// 确认
export function confirm(id) {
    return request({
        url: `/article/${id}/confirm`,
        method: 'post',
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

export function importArticles(data) {
    return request({
        url: `/article/import`,
        method: 'post',
        data
    });
}

export function hideArticle(id) {
    return request({
        url: `/article/${id}/hide`,
        method: 'post',
    });
}

export function showArticle(id) {
    return request({
        url: `/article/${id}/show`,
        method: 'post',
    });
}
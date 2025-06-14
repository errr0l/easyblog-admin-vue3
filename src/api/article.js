import request from '@/utils/request';

// 保存文章
export function save(data) {
    return request({
        url: '/article/save',
        method: 'post',
        data
    });
}

// 更新文章
export function update(data) {
    return request({
        url: '/article/update',
        method: 'post',
        data
    });
}

// 删除文章
export function del(data) {
    return request({
        url: '/article/del',
        method: 'post',
        data
    });
}

// 获取文章分页
export function getPagination(data) {
    return request({
        url: '/article/pagination',
        method: 'get',
        params: data
    });
}

// 获取文章详情
export function getDetail(id) {
    return request({
        url: `/article/${id}/detail`,
        method: 'get'
    });
}

// export function publish(data) {
//     return request({
//         url: `/app/article/publish`,
//         method: 'post',
//         data
//     });
// }

// export function getPublishingProgress() {
//     return request({
//         url: `/app/article/publishingProgress`,
//         method: 'get'
//     });
// }

export function getStatistic() {
    return request({
        url: `/article/statistic`,
        method: 'get'
    });
}

export function audit(data) {
    return request({
        url: `/article/audit`,
        method: 'post',
        data
    });
}

// 保存草稿
// export function saveDraft(data) {
//     console.log('saveDraft：', data);
// }
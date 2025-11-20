import request from '@/utils/request';

// 获取角色列表
export function listAll() {
    return request({
        url: '/role/all',
        method: 'get'
    });
}

// 获取用户角色列表
export function getRolesByUserId(userId) {
    return request({
        url: `/user/${userId}/roles`,
        method: 'get'
    });
}

// 新增角色
export function save(data) {
    return request({
        url: '/role/save',
        method: 'post',
        data
    });
}

// 更新角色
export function update(data) {
    return request({
        url: '/role/update',
        method: 'post',
        data
    });
}

// 删除角色
export function del(data) {
    return request({
        url: `/role/del`,
        method: 'post',
        data
    });
}
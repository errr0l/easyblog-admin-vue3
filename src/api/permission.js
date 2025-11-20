import request from '@/utils/request';

// 获取角色权限
export function getRolePermissions(roleId) {
    return request({
        url: `/role/${roleId}/permissions`,
        method: 'get'
    });
}

// 获取权限列表（包含菜单、功能权限）
export function getPermissions() {
    return request({
        url: '/permission/all',
        method: 'get'
    });
}

export function getPermissionTree() {
    return request({
        url: '/permission/tree',
        method: 'get'
    });
}

// 添加权限
export function save(data) {
    return request({
        url: '/permission/save',
        method: 'post',
        data
    });
}

// 更新权限
export function update(data) {
    return request({
        url: '/permission/update',
        method: 'post',
        data
    });
}

// 更新权限
export function del(data) {
    return request({
        url: `/permission/del`,
        method: 'post',
        data
    });
}

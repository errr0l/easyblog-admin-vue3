import { getAccountPermissionList as _ } from "@/api/permission";
import { PERMISSION_MENU } from "@/constants/general";
import { computed, ref } from "vue";

// 获取账号权限
export function usePermission() {
    const list = ref([]);
    const success = ref(false);
    async function queryPermissions() {
        const resp = await _();
        if (resp?.code === 0) {
            list.value = resp.data;
            success.value = true;
        }
    }

    /**
     * 创建基于用户的菜单【404页面需要在最后添加】
     * 关于【菜单】的一个注意点：项目采用【若某个用户拥有某个页面的权限，则说明其同时拥有获取该页面下所有数据的权限】，以此来减少分配角色权限时的繁杂度
     * @param {Array} routes 动态路由
     * @param {Array} menuList 用户菜单权限
     * @returns {*[]}
     */
    function makeUserRoutes(routes, menuList) {
        const _routes = [];
        for (const route of routes) {
            // 用于前端开发新页面时，没有分配权限的情况
            // if (route.temporary) {
            //     _routes.push(route);
            //     continue;
            // }
            let menu = null;
            // 如果未标注value属性，则将其看作是常规路由
            if (route.value && !(menu = menuList.find((item) => item.value === route.value))) {
                continue;
            }

            // 目前只用到了【name这个属性】，如有需要，可继续使用其他属性，或者拓展「extra属性」
            if (menu) {
                route.meta.title = menu.name;
                route.value = menu.value;
            }

            // 若存在子路由，则继续匹配；
            if (route.children && route.children.length > 0) {
                route.children = makeUserRoutes(
                    route.children,
                    menuList
                );
            }
            _routes.push(route);
        }
        return _routes;
    }

    const menus = computed(() => {
        return list.value.filter(item => item.type === PERMISSION_MENU);
    });

    return { queryPermissions, list, menus, makeUserRoutes, success };
}
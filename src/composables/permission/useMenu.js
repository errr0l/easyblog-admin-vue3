import { PERMISSION_MENU } from "@/constants/general";
import { computed } from "vue";

/**
 * 菜单权限处理模块；
 * @param {Ref<Array<Object>>} permissions
 * @returns {{expanded: ComputedRef<unknown>, menu: ComputedRef<{children: *[], name: string, id: number, value: string, parentId: number}[]|*[]>, generateTree: ((function(Array<Object>): Array<Object>)|*), props: {children: string, label: string}}}
 */
export function useMenu({ permissions }) {
    const extraOption = {
        id: -1,
        value: "1",
        name: "根节点",
        parentId: -1,
        children: []
    };
    const props = {
        label: "name",
        children: "children",
    };
    /**
     * 生成树结构
     * @param {Array<Object>} permissionList
     * @returns {Array<Object>}
     */
    function generateTree(permissionList) {
        const tree = [];
        if (!permissionList.length) {
            return tree;
        }
        for (let item of permissionList) {
            if (item.type !== PERMISSION_MENU) {
                continue;
            }
            // 截止目前为止，权限数据里只有一个引用类型，其他均基本类型
            const { children, ...rest } = item;
            if (children && children.length) {
                rest.children = generateTree(children);
            }
            tree.push(rest);
        }
        return tree;
    }
    // 菜单
    const menu = computed(() => {
        const _menu = generateTree(permissions.value);
        console.log(_menu);
        return _menu.length ? [extraOption].concat(_menu) : [];
    });
    // 展开项
    const expanded = computed(() => {
        const keys = [];
        if (!menu.value.length) {
            return keys;
        }
        for (const item of menu.value) {
            keys.push(item.id);
        }
        return keys;
    });

    return { generateTree, menu, expanded, props };
}
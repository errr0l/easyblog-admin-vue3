// 树相关处理逻辑
export function useTree({ formData, popoverRef }) {

    // 新增菜单场景：当选择父级菜单时，更新表单数据
    function currentChange(row) {
        formData.parentId = row.id;
        formData.parentName = row.name;
        popoverRef.value.hide();
    }

    return { currentChange };
}
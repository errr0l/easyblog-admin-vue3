import { ref, watch } from "vue";

export function useDialog({ formData, resetFormData, setFormData }) {
    const dialogVisible = ref(false);
    const isEditing = ref(false);
    function showDialogForAdding(row) {
        dialogVisible.value = true;
        resetFormData(row);
    }

    // 有两种情况：
    // 1）从菜单列表处点击添加，此时传入当前节点信息；
    // 2）从飞菜单处点击点击（如左上角'添加'按钮），此时row为undefined；
    // dialogVisible.value赋值要在表单之前，否则会出现在nextTick中获取不到引用的问题，showDialogForAdding同理
    function showDialogForEditing(row) {
        dialogVisible.value = true;
        setFormData(row);
    }

    watch(() => formData.id, (_new, old) => {
        isEditing.value = !!_new;
    });

    return { showDialogForAdding, showDialogForEditing, dialogVisible, isEditing };
}
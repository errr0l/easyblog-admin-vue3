// 分类弹窗处理模块；
import { ref, watch } from "vue";

export function useCategoryDialog({ formData, resetFormData }) {
    const dialogVisible = ref(false);
    const isEditing = ref(false);
    function showDialogForEditing(row) {
        dialogVisible.value = true;
        Object.assign(formData, row);
    }
    function showDialogForAdding() {
        dialogVisible.value = true;
        resetFormData();
    }
    watch(() => formData.id, (_new, old) => {
        isEditing.value = !!_new;
    });

    return {
        showDialogForEditing, showDialogForAdding, dialogVisible, isEditing
    };
}
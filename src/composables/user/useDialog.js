import { ref, watch } from "vue";

export function useDialog({ formData, resetFormData, setFormData }) {
    const dialogVisible = ref(false);
    const isEditing = ref(false);

    function showDialogForAdding() {
        dialogVisible.value = true;
        resetFormData();
    }

    function showDialogForEditing(row) {
        dialogVisible.value = true;
        setFormData(row);
    }

    function hide() {
        dialogVisible.value = false;
    }

    watch(() => formData.id, (_new, old) => {
        isEditing.value = !!_new;
    });

    return { showDialogForAdding, showDialogForEditing,
        dialogVisible, isEditing, hide
    };
}
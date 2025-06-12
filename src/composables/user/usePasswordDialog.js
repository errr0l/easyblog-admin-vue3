import { ref } from "vue";

export function usePasswordDialog({ formData, defaultFormData }) {
    const passwordDialogVisible = ref(false);
    function showDialogForUpdatingPassword(row) {
        show();
        Object.assign(formData, { ...defaultFormData });
        formData.id = row.id;
    }

    function show() {
        passwordDialogVisible.value = true;
    }

    function hide() {
        passwordDialogVisible.value = false;
    }

    return { showDialogForUpdatingPassword, passwordDialogVisible, show, hide };
}
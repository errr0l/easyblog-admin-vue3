// import { ref } from "vue";

export function useProgressDialog({ progressDialogVisible, progress, refresh }) {
    // const progressDialogVisible = ref(false);
    // function show() {}
    function close() {
        progressDialogVisible.value = false;
        progress.status = null;
        progress.message = "";
        progress.percentage = 0;
        refresh();
    }
    return { close };
}
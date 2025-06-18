export function useProgressDialog({ progressDialogVisible, resetProgress, refresh }) {
    function close() {
        progressDialogVisible.value = false;
        resetProgress();
        refresh();
    }
    return { close };
}
import { ref } from "vue";

export function useDialog() {
    const auditingDialogVisible = ref(false);
    const settingsDialogVisible = ref(false);
    // 方法省略
    return { auditingDialogVisible, settingsDialogVisible };
}
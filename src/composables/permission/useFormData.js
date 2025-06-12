import { nextTick, ref } from "vue";
import { copyProperties } from "@/utils/common";
import { PERMISSION_MENU } from "@/constants/general";

// formData处理模块
export function useFormData({ formData, defaultFormData }) {
    const treeRef = ref({});
    function setFormData(row) {
        // 只复制指定属性
        const defaultFormData = {
            id: "",
            type: PERMISSION_MENU,
            value: "",
            name: "",
            path: "",
            parentId: -1,
            // extra: "",
            parentName: "",
        };
        Object.assign(formData, copyProperties(row, { ...defaultFormData }));
        if (formData.parentId) {
            nextTick(() => {
                treeRef.value?.setCurrentKey(formData.parentId);
                // 为什么这样获取name，直接在row获取不行吗？
                formData.parentName = (treeRef.value?.getCurrentNode() || {})["name"];
            });
        }
    }

    function resetFormData(row) {
        Object.assign(formData, defaultFormData);
        if (row) {
            formData.parentId = row.id;
            formData.parentName = row.name;
            nextTick(() => {
                treeRef.value?.setCurrentKey(formData.parentId);
            });
        }
        else {
            nextTick(() => {
                treeRef.value?.setCurrentKey(-1);
            });
        }
    }

    return { setFormData, treeRef, resetFormData };
}
import { onMounted } from 'vue';
import { USER } from "@/constants/general";

export function useImportMdStyle(type) {

    onMounted(() => {
        if (type === USER) {
            import("md-editor-v3/lib/style.css");
        }
        else {
            import('md-editor-v3/lib/preview.css');
        }
    });
}
import { ElMessage } from "element-plus";
import { useRouter } from "./useRouter";
import { audit as _ } from "@/api/article";
import { OPINION_APPROVAL } from "@/views/article/constants";
import { reactive } from "vue";

// 关于谁应该保持状态的问题：能自己保持就自己保持，像save和update，都用到了formData，所以应该在组件保持状态
export function useAudit({ dialogVisible, id }) {
    const { back } = useRouter();
    const defaultFormData = { id, remarks: "", opinion: OPINION_APPROVAL };
    const formData = reactive({ ...defaultFormData });
    // 审核文章
    async function audit() {
        const resp = await _(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            dialogVisible.value = false;
            back();
        }
    }

    return { audit, formData };
}
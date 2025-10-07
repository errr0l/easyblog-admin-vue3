import { reactive } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useRouter } from "./article/useRouter";
import * as articleService from "../api/article";
import { OPINION_APPROVAL } from "@/views/article/constants";


// 编辑文章[管理员]；
export function useEditArticle({ dialogVisible }) {
    const { back } = useRouter();
    const route = useRoute();
    const defaultFormData = { id: route.query.id, remarks: "", opinion: OPINION_APPROVAL };
    const formData = reactive({ ...defaultFormData });
    // 审核文章
    async function audit() {
        const resp = await articleService.audit(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            dialogVisible.value = false;
            back();
        }
    }
    return {
        audit, formData
    };
}
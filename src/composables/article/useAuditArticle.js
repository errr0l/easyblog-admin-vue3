import { reactive } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import * as articleService from "@/api/article";
import { OPINION_APPROVAL } from "@/views/article/constants";
import { useArticleNavigator } from "@/views/article/composables/useArticleNavigator";


// 审核文章[管理员]；
export function useAuditArticle({ dialogVisible }) {
    const { back } = useArticleNavigator();
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
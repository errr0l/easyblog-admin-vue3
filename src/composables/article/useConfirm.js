import * as accountArticleApi from "@/api/accountArticle";
import { ElMessage } from "element-plus";
import { WAITING_FOR_PUBLICATION } from "@/views/article/constants";

export function useConfirm() {
    // 确认文章，操作成功后进入待发布状态
    async function confirm(row) {
        const resp = await accountArticleApi.confirm({ id: row.id });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = WAITING_FOR_PUBLICATION;
        }
    }

    return { confirm };
}
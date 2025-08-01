import { confirm as _ } from "@/api/accountArticle";
import { ElMessage } from "element-plus";
import { WAITING_FOR_PUBLICATION } from "@/views/article/constants";

// 确认文章；操作成功后进入待发布状态
export function useConfirm() {
    async function confirm(row) {
        const resp = await _({ id: row.id });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = WAITING_FOR_PUBLICATION;
        }
    }

    return { confirm };
}
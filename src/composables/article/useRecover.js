import { recover as _ } from "@/api/accountArticle";
import { ElMessage, ElMessageBox } from "element-plus";
import { DRAFT } from "@/views/article/constants";

// 接口目前还不可用
export function useRecover() {
    function recover(row) {
        ElMessageBox.confirm("即将把文章恢复为【草稿】状态，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }).then(async () => {
            const resp = await _({ id: row.id });
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                row.state = DRAFT;
            }
        });
    }

    return { recover };
}
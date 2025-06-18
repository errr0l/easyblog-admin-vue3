import { ElMessage, ElMessageBox } from "element-plus";
import { DELETED } from "@/views/article/constants";
import { del as _del, doDel as _doDel } from "@/api/accountArticle";
import { del as __del } from "@/api/article";
import { USER } from "@/constants/general";

export function useDel({ refresh, type = USER }) {
    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(async () => {
            let resp;
            let deleted = row.state === DELETED;
            if (type === USER) {
                resp = deleted ? await _doDel({ id: row.id }) : await _del({ id: row.id });
            }
            else {
                if (deleted) {
                    return;
                }
                resp = await __del({ id: row.id });
            }
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                if (deleted) {
                    refresh();
                }
                else {
                    row.state = DELETED;
                }
            }
        });
    }

    return { del };
}
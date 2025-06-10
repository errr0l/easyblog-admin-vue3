import { ElMessage, ElMessageBox } from "element-plus";
import { DELETED } from "@/views/article/constants";
import { del as _del, doDel as _doDel } from "@/api/accountArticle";
import { del as __del } from "@/api/article";

export function useDel({ refresh }) {
    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(async () => {
            let resp;
            let deleted = row.state === DELETED;
            if (deleted) {
                resp = await _doDel({ id: row.id }).catch((error) => {
                    console.log(error);
                });
            }
            else {
                resp = await _del({ id: row.id }).catch((error) => {
                    console.log(error);
                });
            }
            if (resp.code === 0) {
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
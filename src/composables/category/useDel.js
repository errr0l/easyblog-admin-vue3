import { ElMessage, ElMessageBox } from "element-plus";
import { del as _ } from "@/api/category";

export function useDel({ refresh }) {
    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }).then(async () => {
            const resp = await _({ id: row.id }).catch((error) => {
                console.log(error);
            });
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                refresh();
            }
        });
    }

    return { del };
}
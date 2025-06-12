import { del as _ } from "@/api/role";
import { ElMessageBox, ElMessage } from "element-plus";

export function useDel({ refresh }) {
    function del(data) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }).then(async () => {
            const resp = await _({ id: data.id }).catch((error) => {
                console.log(error);
            });
            if (resp?.code !== 0) {
                ElMessage.error("操作失败");
                return;
            }
            ElMessage.success("操作成功");
            refresh();
        });
    }
    return { del };
}
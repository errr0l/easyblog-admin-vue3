import { ref } from "vue";
import { getAllUsers as getAllUsersApi, del as delApi } from "@/api/user";
import { ElMessage, ElMessageBox } from "element-plus";

export function useUser() {
    const list = ref([]);
    async function getAllUsers() {
        const resp = await getAllUsersApi();
        if (resp?.code === 0) {
            list.value = resp.data;
        }
    }

    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }).then(async () => {
            const resp = await delApi({ id: row.id });
            if (resp?.code !== 0) {
                ElMessage.error("操作失败");
                return;
            }
            ElMessage.success("操作成功");
            getAllUsers();
        });
    }

    return { getAllUsers, list, del };
}
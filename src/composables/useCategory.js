import { ElMessage, ElMessageBox } from "element-plus";
import * as categoryApi from "@/api/category";
import { ref } from "vue";

export function useCategory() {
    const list = ref([]);
    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }).then(async () => {
            const resp = await categoryApi.del({ id: row.id }).catch((error) => {
                console.log(error);
            });
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                listAll();
            }
        });
    }

    async function listAll(query) {
        const resp = await categoryApi.listAll(query);
        if (resp?.code === 0) {
            list.value = resp.data;
        }
    }

    async function create(category) {
        const resp = await categoryApi.create(category).catch((error) => {
            console.log(error);
        });
        if (resp?.code === 0) {
            dialogVisible.value = false;
            ElMessage.success("操作成功");
            listAll();
        }
    }

    async function update(category) {
        const resp = await categoryApi.update(category).catch((error) => {
            console.log(error);
        });
        if (resp?.code === 0) {
            dialogVisible.value = false;
            ElMessage.success("操作成功");
            listAll();
        }
    }

    return {
        listAll, list,
        del,
        update,
        create
    }
}
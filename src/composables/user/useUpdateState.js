import { updateState as _ } from "@/api/user";
import { ElMessage } from "element-plus";

export function useUpdateState({ refresh }) {
    const activated = 1;
    const banned = 2;
    async function updateState(formData) {
        const resp = await _(formData);
        if (resp?.code === 0) {
            refresh();
            ElMessage.success("操作成功");
        }
    }

    function activate(row) {
        updateState({ id: row.id, state: activated });
    }

    function ban(row) {
        updateState({ id: row.id, state: banned });
    }

    return { activate, ban };
}
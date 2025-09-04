import { ElMessage } from "element-plus";
import { refresh as _ } from "@/api/site-asset";

export function useRefreshFileList({ cache, queryList }) {
    async function refresh() {
        const resp = await _();
        if (resp?.code !== 0) {
            return;
        }
        // 删除缓存
        for (const key in cache) {
            delete cache[key];
        }
        queryList();
        ElMessage.success("操作成功");
    }

    return { refresh };
}
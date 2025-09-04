import { ElMessage } from "element-plus";
import { save as _ } from "@/api/site-asset";

export function useSaveFile({ content, cache, name }) {
    async function save() {
        if (content.value === cache[name.value]) {
            return ElMessage.warning('当前内容没有发生变化');
        }
        const formData = {
            name: name.value,
            content: content.value
        };
        const resp = await _(formData);
        if (resp?.code !== 0) {
            return;
        }
        // 更新缓存
        cache[name] = content;
        ElMessage.success("操作成功");
    }

    return { save };
}
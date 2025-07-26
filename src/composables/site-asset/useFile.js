import { loadResourceDetail as _ } from "@/api/site-asset";
import { ElMessage } from "element-plus";
import { reactive, ref, unref } from "vue";

export function useFile({ textareaRef }) {
    const fileReader = new FileReader();
    const content = ref("");
    const cache = reactive({});
    const fileName = ref("");
    async function queryFile(name) {
        const _content = cache[name];
        fileName.value = fileName;
        if (_content) {
            content.value = _content;
            return;
        }
        const params = {
            name
        };
        const resp = await _(params);
        if (resp?.code !== 0) {
            return ElMessage.error(resp.message);
        }
        const blob = new Blob([resp.data.content], { type: "text/plain" });

        fileReader.readAsText(blob);
        fileReader.onloadend = (event) => {
            content.value = event?.target.result;
            // 更新缓存；
            cache[name] = event?.target.result;
            unref(textareaRef).focus();
        }
    }

    return { queryFile, cache, content, fileName };
}
import axios from "axios";
import { baseUrlInterceptor, tokenInterceptor } from "@/utils/request";
import { ElMessage } from "element-plus";
import { ref } from "vue";

export function useDownloadWebsiteZip() {
    const btnDisabled = ref(false);
    async function downloadWebsiteZip() {
        btnDisabled.value = true;
        const instance = axios.create();
        instance.interceptors.request.use(baseUrlInterceptor);
        instance.interceptors.request.use(tokenInterceptor);
        const resp = await instance({
            url: "/app/websiteZip/download",
            method: "get",
            headers: {
                'Content-Type': "application/json;application/octet-stream",
            },
            responseType: "blob"
        });
        // 如果下载过程中出现错误，将会返回json格式的错误信息
        if (resp?.status !== 200 || resp?.headers['content-type'] === 'application/json') {
            ElMessage.error('下载失败');
            btnDisabled.value = false;
            return;
        }

        const blob = new Blob([resp.data], { type: "application/zip" });
        let fileName = "website.zip";
        for (const str of resp.headers['content-disposition'].split(';')) {
            if (str.indexOf('fileName') !== -1) {
                fileName = str.split("=")[1];
            }
        }
        const url = URL.createObjectURL(blob);;
        const a = document.createElement("a");
        a.href = url;
        a.style.display = "none";
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        // 移除对象
        a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);

        setTimeout(() => {
            btnDisabled.value = false;
        }, 5000);
    }
    return { downloadWebsiteZip, btnDisabled };
}
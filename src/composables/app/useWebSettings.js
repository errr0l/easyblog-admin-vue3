import request from "@/utils/request";

export function useWebSettings({ formData }) {
    async function queryWebSettings() {
        const resp = await request({
            url: "/app/webSetting",
            method: "get"
        });
        if (resp?.code === 0) {
            Object.assign(formData, resp.data);
        }
    }

    return { queryWebSettings };
}
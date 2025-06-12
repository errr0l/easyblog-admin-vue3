import { ElMessage } from "element-plus";
import request from "@/utils/request";
import { useHandler } from "@/composables/useHandler";

export function useSaveWebSettings({ formData, preHandlers }) {
    const archiveValidator = (rule, value, callback) => {
        if (value === 1) {
            return callback();
        }
        const { psbNo, icpProvince, icpDomain, icpNo } = formData;

        if (!icpNo || !icpDomain || !icpProvince || !icpNo || !psbNo) {
            return callback(new Error('备案信息不完整'));
        }
        callback();
    };
    // 如果开启评论时，需要配置gittalk
    const commentableOptsValidator = (rule, value, callback) => {
        if (value === 1) {
            return callback();
        }
        const { clientID, clientSecret, repo, owner } = formData.gittalk;
        if (!clientID || !clientSecret || !repo || !owner) {
            return callback(new Error('gittalk配置信息不完整'));
        }
        callback();
    };
    const rules = {
        archiveEnabled: [
            { validator: archiveValidator, trigger: '' }
        ],
        commentable: [
            { validator: commentableOptsValidator, trigger: '' }
        ]
    }
    async function saveWebSetting() {
        const resp = await useHandler({
            func: (_formData) => request({
                url: "/app/webSetting/save",
                method: "post",
                data: _formData
            }),
            preHandlers
        })(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
        }
    }

    return { saveWebSetting, rules };
}
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { OPINION_APPROVAL } from "./articleConstants";

/**
 * 文章详情处理
 * @param {Object} service 请求方法
 * @returns {{skipComparison: Ref<boolean>, getDetail: ((function((String|Number)): Promise<void>)|*), audit: ((function(): Promise<void>)|*), save: ((function(): Promise<void>)|*), saveDraft: ((function(): Promise<void>)|*), update: ((function(): Promise<void>)|*), formData: Reactive<{cover: string, summary: string, creationType: number, reprintUrl: string, id: string, tag: string, sort: string, title: string, content: string, categoryId: string, commentable: number}>, auditingFormData: Reactive<{id: string, remarks: string, opinion}>, auditingDialogVisible: Ref<boolean>, settingsDialogVisible: Ref<boolean>}}
 */
export function useArticleDetail({ service }) {
    const router = useRouter();
    const defaultFormData = {
        id: "",
        title: "",
        content: "",
        categoryId: "",
        cover: "",
        summary: "",
        tag: "",
        creationType: 0,
        reprintUrl: "",
        commentable: 0,
        sort: ""
    };
    const defaultAuditingFormData = { id: "", remarks: "", opinion: OPINION_APPROVAL };
    const formData = reactive({ ...defaultFormData });
    const auditingFormData = reactive({ ...defaultAuditingFormData });
    const original = ref(null);
    const skipComparison = ref(false);
    const auditingDialogVisible = ref(false);
    const settingsDialogVisible = ref(false);
    async function save() {
        const resp = await service.save(formData);
        if (resp.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }
    async function update() {
        const resp = await service.update(formData);
        if (resp.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }
    async function saveDraft() {
        const resp = await service.saveDraft(formData);
        if (resp.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    /**
     * 获取文章详情
     * @param {String|Number} id
     * @returns {Promise<void>}
     */
    async function getDetail(id) {
        const resp = await service.getDetail(id);
        if (resp.code === 0) {
            if (resp.data.creationType) {
                resp.data.creationType = +resp.data.creationType;
            }
            if (resp.data.commentable) {
                resp.data.commentable = +resp.data.commentable;
            }
            Object.assign(formData, resp.data);
            original.value = resp.data;
        }
    }
    function back() {
        const route = useRoute();
        const meta = route.meta;
        const activeMenu = meta.activeMenu;
        router.replace(activeMenu ? activeMenu : '/article');
    }
    // 审核文章
    async function audit() {
        auditingFormData.id = formData.id;
        const resp = await service.audit(auditingFormData);
        if (resp.code === 0) {
            ElMessage.success("操作成功");
            auditingDialogVisible.value = false;
            back();
        }
    }

    function saveOrUpdate() {
        if (formData.id) {
            update();
        }
        else {
            save();
        }
    }

    return {
        skipComparison, formData, auditingFormData, auditingDialogVisible, settingsDialogVisible,
        save, update, saveDraft, getDetail, audit, saveOrUpdate, back
    };
}
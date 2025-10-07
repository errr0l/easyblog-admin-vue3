import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { ORIGINAL } from "@/views/article/constants";
import * as accountArticleService from "../api/accountArticle";
import { ElMessage } from "element-plus";
import { useRouter } from "../composables/article/useRouter";
import { getDetail as __ } from "@/api/article";
import { USER } from "@/constants/general";


// 包括增改查
export function useEditMyArticle({ defaultFormData }) {
    const formData = reactive({ ...defaultFormData });
    const original = reactive({});
    const loading = ref(false);
    const skipComparison = ref(false);
    /**
     * 获取文章详情；
     * 分普通用户和管理员，如果其他接口也有这种使用场景时，也可以按照这种方式；
     * 按理说，最好的方式是，管理员用另一个界面
     * @param {String|Number} id
     * @returns {Promise<void>}
     */
    async function queryDetail(id, type) {
        loading.value = true;
        try {
            let resp = type === USER ? await accountArticleService.getDetail(id) : await __(id);
            if (resp?.code === 0) {
                resp.data.creationType = resp.data.creationType ? +resp.data.creationType : ORIGINAL;
                resp.data.commentable = resp.data.commentable ? +resp.data.commentable : 0;
                Object.assign(formData, resp.data);
                Object.assign(original, resp.data);
            }
        }
        catch(error) {
            loading.value = false;
        }
    }

    const { back } = useRouter();
    async function save() {
        const resp = await accountArticleService.save(formData);
        if (resp?.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    async function saveDraft() {
        const resp = await accountArticleService.saveDraft(formData);
        if (resp.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    async function update() {
        const resp = await accountArticleService.update(formData);
        if (resp?.code === 0) {
            ElMessage.success('操作成功');
            skipComparison.value = true;
            back();
        }
    }

    const route = useRoute();

    onMounted(async () => {
        const { id, type = USER } = route.query;
        if (id) {
            await queryDetail(id, type);
        }
        loading.value = false;
    });

    return {
        queryDetail, original, loading, skipComparison, formData,
        update, save, saveDraft, back
    };
}
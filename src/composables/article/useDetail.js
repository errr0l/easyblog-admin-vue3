import { ORIGINAL } from "@/views/article/constants";
import { getDetail as _ } from "@/api/accountArticle";
import { getDetail as __ } from "@/api/article";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { USER } from "@/constants/general";

export function useDetail({ formData, id, type }) {
    const original = ref(null);
    if (!id || !type) {
        const route = useRoute();
        id = route.query.id;
        type = route.query.type;
    }
    /**
     * 获取文章详情；
     * 分普通用户和管理员，目前只有这个接口进行了区分，如果其他接口也有这种使用场景时，也可以按照这种方式
     * @param {String|Number} id
     * @returns {Promise<void>}
     */
    async function queryDetail(id) {
        let resp;
        if (type === USER) {
            resp = await _(id)
        }
        else {
            resp = await __(id);
        }
        if (resp?.code === 0) {
            if (resp.data.creationType) {
                resp.data.creationType = +resp.data.creationType;
            }
            if (resp.data.commentable) {
                resp.data.commentable = +resp.data.commentable;
            }
            if (!formData.creationType) {
                formData.creationType = ORIGINAL;
            }
            Object.assign(formData, resp.data);
            original.value = resp.data;
        }
    }

    onMounted(() => {
        id && queryDetail(id);
    });

    return { queryDetail, original };
}
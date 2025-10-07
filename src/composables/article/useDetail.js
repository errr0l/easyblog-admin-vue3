// import { ORIGINAL } from "@/views/article/constants";
// import { getDetail as _ } from "@/api/accountArticle";
// import { getDetail as __ } from "@/api/article";
// import { onMounted, reactive, ref } from "vue";
// import { USER } from "@/constants/general";

// /**
//  * 获取文章详情处理模块；
//  * @param {Reactive<{ id, title, content, categoryId, cover, summary, tag, creationType, reprintUrl, commentable, sort }>} formData 表单
//  * @param {String|Number} id 文章id
//  * @param {String} type 用户类型
//  * @returns {{queryDetail: ((function((String|Number)): Promise<void>)|*), original: Reactive<{}>, loading: Ref<Boolean>}}
//  */
// export function useDetail({ formData, id, type }) {
//     const original = reactive({});
//     const loading = ref(true);
//     /**
//      * 获取文章详情；
//      * 分普通用户和管理员，如果其他接口也有这种使用场景时，也可以按照这种方式
//      * @param {String|Number} id
//      * @returns {Promise<void>}
//      */
//     async function queryDetail(id) {
//         let resp = type === USER ? await _(id) : await __(id);
//         if (resp?.code === 0) {
//             resp.data.creationType = resp.data.creationType ? +resp.data.creationType : ORIGINAL;
//             resp.data.commentable = resp.data.commentable ? +resp.data.commentable : 0;
//             Object.assign(formData, resp.data);
//             Object.assign(original, resp.data);
//         }
//     }

//     onMounted(async () => {
//         if (id) {
//             await queryDetail(id);
//         }
//         loading.value = false;
//     });

//     return { queryDetail, original, loading };
// }
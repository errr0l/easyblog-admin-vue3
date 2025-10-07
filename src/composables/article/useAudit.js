// import { ElMessage } from "element-plus";
// import { useRouter } from "./useRouter";
// import { audit as _ } from "@/api/article";
// import { OPINION_APPROVAL } from "@/views/article/constants";
// import { reactive } from "vue";

// /**
//  * 文章审核处理模块；
//  * @param {Ref<Boolean>} dialogVisible 模态框显示控制
//  * @param {String|Number} id 文章id
//  * @returns {{audit: ((function(): Promise<void>)|*), formData: Reactive<{id, remarks: string, opinion: number}>}}
//  */
// export function useAudit({ dialogVisible, id }) {
//     const { back } = useRouter();
//     const defaultFormData = { id, remarks: "", opinion: OPINION_APPROVAL };
//     const formData = reactive({ ...defaultFormData });
//     // 审核文章
//     async function audit() {
//         const resp = await _(formData);
//         if (resp?.code === 0) {
//             ElMessage.success("操作成功");
//             dialogVisible.value = false;
//             back();
//         }
//     }

//     return { audit, formData };
// }
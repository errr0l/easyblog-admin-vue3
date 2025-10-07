// import { submit as _submit } from "@/api/accountArticle";
// import { ElMessage } from "element-plus";
// import { WAITING_FOR_AUDITING } from "@/views/article/constants";

// export function useSubmit() {
//     /**
//      * 提交审核
//      * @param {Object} row 文章数据
//      * @returns {Promise<void>}
//      */
//     async function submit(row) {
//         const resp = await _submit({ id: row.id });
//         if (resp?.code === 0) {
//             ElMessage.success("操作成功");
//             row.state = WAITING_FOR_AUDITING;
//         }
//     }

//     return { submit };
// }
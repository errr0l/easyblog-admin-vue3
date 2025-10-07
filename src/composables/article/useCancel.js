// import { ElMessage, ElMessageBox } from "element-plus";
// import { ARTICLE_STATE_CONFIG, PENDING } from "@/views/article/constants";
// import { cancel as _cancel } from "@/api/accountArticle";

// // 文章撤回处理；
// // 只有处于[审核中]的文章，才可以[撤回]
// export function useCancel() {
//     function cancel(row) {
//         ElMessageBox.confirm(`文章[${ARTICLE_STATE_CONFIG[row.state].text}]，确认撤销吗？`, "提示", {
//             confirmButtonText: "确定",
//             cancelButtonText: "取消"
//         }).then(async () => {
//             const resp = await _cancel({ id: row.id });
//             if (resp?.code === 0) {
//                 ElMessage.success("操作成功");
//                 row.state = PENDING;
//             }
//         });
//     }

//     return { cancel };
// }
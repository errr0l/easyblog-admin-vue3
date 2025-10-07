// import { usePagination } from "./usePagination";
// import { useList } from "../user";
// import { onActivated, onMounted } from "vue";

// /**
//  * 获取文章分页处理模块；并且设置文章作者
//  * @param {Reactive<Object>} query 查询参数
//  * @returns {{total: Ref<number>, search: Function, queryPagination: function(): Promise<void>, list: Ref<[]>, currentChange: Function, searchByState: Function}}
//  */
// export function usePaginationWithAuthor({ query }) {
//     const { queryList, list: userList } = useList();
//     let map = null;
//     function setAuthor(resp) {
//         if (generateMap()) {
//             // 文章列表
//             for (const item of resp.data.records) {
//                 const author = map[item.authorId];
//                 item['authorName'] = author ? author.username : '-';
//             }
//         }
//     }
//     // 生成用户映射
//     function generateMap() {
//         if (map) {
//             return true;
//         }
//         else if (userList.value?.length) {
//             const _map = {};
//             for (const item of userList.value) {
//                 _map[item.id] = item;
//             }
//             map = _map;
//             return true;
//         }
//         else {
//             return false;
//         }
//     }
//     const { queryPagination, list, total, currentChange, search } = usePagination({ query, postHandlers: [setAuthor] });
//     function searchByState(state) {
//         query.states = [+state];
//         search();
//     }
//     onMounted(() => {
//         // 不加await好像也没什么问题
//         queryList();
//         queryPagination();
//     });
//     onActivated(() => {
//         queryPagination();
//     });

//     return { queryPagination, list, total, currentChange, search, searchByState };
// }
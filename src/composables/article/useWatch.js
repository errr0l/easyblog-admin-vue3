// import { watch } from "vue";
// import { DELETED } from "@/views/article/constants";
//
// export function useWatch() {
//     const watchQueryState = (query) => {
//         watch(() => query.states, (n, o) => {
//             if (n && n.includes(DELETED)) {
//                 query.excludedState = "";
//             }
//             else {
//                 query.excludedState = DELETED;
//             }
//         });
//     }
//
//     return { watchQueryState };
// }
import { usePagination } from "./usePagination";
import { useList } from "../user/useList";
import { onMounted } from "vue";

// 文章列表不返回作者名称，需要前端自己设置
export function usePaginationWithAuthor({ query }) {
    const { queryList, list: userList } = useList();
    let map = null;
    function setAuthor(resp) {
        if (generateMap()) {
            // 文章列表
            for (const item of resp.data.records) {
                const author = map[item.authorId];
                item['authorName'] = author ? author.username : '-';
            }
        }
    }
    // 生成用户映射
    function generateMap() {
        if (map) {
            return true;
        }
        else if (userList.value?.length) {
            const _map = {};
            for (const item of userList.value) {
                _map[item.id] = item;
            }
            map = _map;
            return true;
        }
        else {
            return false;
        }
    }
    const { queryPagination, list, total, currentChange, search } = usePagination({ query, postHandlers: [setAuthor] });

    function searchByState(state) {
        query.states = [+state];
        search();
    }
    onMounted(async () => {
        queryList();
        queryPagination();
    });

    return { queryPagination, list, total, currentChange, search, searchByState };
}
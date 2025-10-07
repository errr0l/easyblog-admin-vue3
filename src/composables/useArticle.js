import { onActivated, onMounted, reactive } from "vue";
import { DELETED, WAITING_FOR_AUDITING } from "@/views/article/constants";

import { useBasePagination } from "./useBasePagination";
import { useList } from "./user/useList";
import { setStatesIfNecessary, removeDeletedIfNecessary } from "./useMyArticle";
import { getPagination } from "../api/article";

// 文章处理模块；
export function useArticle() {
    const query = reactive({
        size: 10,
        current: 1,
        categoryId: "",
        states: [WAITING_FOR_AUDITING], // 一般情况下，管理员只要这俩即可
        creationType: "",
        title: "",
        excludedState: DELETED
    });

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
    const { queryPagination, list, total, currentChange, search } = useBasePagination({
        fetch: getPagination,
        query, 
        preHandlers: [removeDeletedIfNecessary, setStatesIfNecessary],
        postHandlers: [setAuthor]
    });
    function searchByState(state) {
        query.states = [+state];
        search();
    }
    onMounted(() => {
        // 不加await好像也没什么问题
        queryList();
        queryPagination();
    });
    onActivated(() => {
        queryPagination();
    });

    return { queryPagination, list, total, currentChange, search, searchByState, query };
}
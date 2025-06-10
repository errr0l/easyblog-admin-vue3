import { useBasePagination } from "@/composables/useBasePagination";
import * as accountArticleApi from "@/api/accountArticle";
import { DELETED } from "@/views/article/constants";

/**
 * 文章分页处理模块；
 * @param query
 * @param postHandlers
 * @returns {{total: Ref<UnwrapRef<number>, UnwrapRef<number> | number>, search: search, queryPagination: (function(): Promise<void>)|*, list: [null] extends [Ref] ? IfAny<null, Ref<null>, null> : Ref<UnwrapRef<null>, UnwrapRef<null> | null>, currentChange: currentChange}}
 */
export function usePagination({ query, postHandlers = [] }) {
    return useBasePagination({
        query,
        fetch: accountArticleApi.getPagination,
        preHandlers: [removeDeletedIfNecessary, setStatesIfNecessary],
        postHandlers
    });
}

function setStatesIfNecessary(_query) {
    if (_query && _query.states) {
        _query.states = _query.states.join(",");
    }
}

// 如果states中包含deleted，则将excludedState=DELETED置空
function removeDeletedIfNecessary(_query) {
    if (_query.states && _query.states.includes(DELETED)) {
        _query.excludedState = "";
    }
    else {
        _query.excludedState = DELETED;
    }
}
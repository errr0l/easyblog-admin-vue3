import { useBasePagination } from "@/composables/useBasePagination";
import * as accountArticleApi from "@/api/accountArticle";
import { DELETED } from "@/views/article/constants";

/**
 * 文章分页处理模块；
 * @param {Reactive<Object>} query 查询参数
 * @param {Array<Function>} postHandlers 后置处理器
 * @returns {{list: Ref<*[]>, total: Ref<Number>, queryPagination: (function(): Promise<void>), currentChange: Function, search: Function}}
 */
export function usePagination({ query, postHandlers = [] }) {
    return useBasePagination({
        query,
        fetch: accountArticleApi.getPagination,
        preHandlers: [removeDeletedIfNecessary, setStatesIfNecessary],
        postHandlers
    });
}

// 如果query中包含states，则将其处理为字符串
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
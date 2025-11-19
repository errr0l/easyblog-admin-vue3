import * as articleApi from "@/api/article";
import { reactive } from "vue";
import { usePagination } from "@/composables/usePagination";

// 将states处理为字符串
const stateHandler = (query) => {
    const states = query.states;
    if (states && states.length) {
        query.states = states.join(",");
    }
};

export function useArticlePagination() {
    const query = reactive({
        size: 10,
        current: 1,
        categoryId: "",
        creationType: "",
        title: "",
        states: [],
    });
    const { list, total, fetchData, currentChange, search } = usePagination(query, articleApi.list, [stateHandler]);

    function searchByState(state) {
        query.states = [+state];
        search();
    }
    return {
        list, total, fetchData, query, currentChange, search,
        searchByState
    };
}
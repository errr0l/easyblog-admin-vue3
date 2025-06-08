import { ref } from "vue";

/**
 * 分页处理模块
 * @param {Object} query 查询参数
 * @param {Function} getPagination 请求数据接口
 * @param {Array<Function>} queryHandlers 参数处理器；其中，在此处理的是query的副本
 * @returns {{list: Ref<Array>, total: Ref<number>, queryPagination: Function, currentChange: Function}}
 */
export function usePagination({ query, getPagination, queryHandlers= [] } = {}) {
    const list = ref([]);
    const total = ref(0);
    async function queryPagination() {
        const _query = { ...query };
        try {
            for (let queryHandler of queryHandlers) {
                queryHandler(_query);
            }
            const resp = await getPagination(_query);
            if (resp && resp.code === 0) {
                list.value = resp.data.records;
                total.value = resp.data.total;
            }
            else {
                console.log("获取分页失败, 未知原因.");
            }
        }
        catch (e) {
            console.log("获取分页失败：", e);
        }
    }
    function currentChange(current) {
        query = { ...query, current };
        queryPagination();
    }
    return { list, total, queryPagination, currentChange };
}
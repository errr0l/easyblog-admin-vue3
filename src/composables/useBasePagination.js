import { ref } from "vue";

/**
 * 基本分页处理模块
 * @param {Object} query 查询参数
 * @param {Function} fetch 请求数据方法
 * @param {Array<Function>} preHandlers 前置处理器；可对query(副本)进行处理
 * @param postHandlers 后置处理器；可对请求结果进行处理
 * @returns {{total: Ref<UnwrapRef<number>, UnwrapRef<number> | number>, search: search, queryPagination: ((function(): Promise<void>)|*), list: [null] extends [Ref] ? IfAny<null, Ref<null>, null> : Ref<UnwrapRef<null>, UnwrapRef<null> | null>, currentChange: currentChange}}
 */
export function useBasePagination({ query, fetch, preHandlers = [], postHandlers } = {}) {
    const list = ref(null);
    const total = ref(0);
    async function queryPagination() {
        const _query = { ...query };
        try {
            for (let handler of preHandlers) {
                handler(_query);
            }
            const resp = await fetch(_query);
            if (resp?.code === 0) {
                for (let handler of postHandlers) {
                    handler(resp);
                }
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
    // 分页接口参数中应该包含一个current，用于指代当前页码
    function currentChange(current) {
        query.current = current;
        queryPagination();
    }
    // 搜索
    function search() {
        currentChange(1);
    }
    return { list, total, queryPagination, currentChange, search };
}
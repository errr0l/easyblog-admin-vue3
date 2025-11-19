import { ref } from "vue";

/**
 * 分页处理模块
 * @param {Reactive<Object>} query 查询参数；
 * @param {Function} fetch 请求数据方法；
 * @param {Array<Function>} preHandlers 前置处理器；
 * @param {Array<Function>} postHandlers 后置处理器；
 * @returns
 */
export function usePagination(query, fetch, preHandlers = [], postHandlers = []) {
    const list = ref([]);
    const total = ref(0);
    async function fetchData() {
        const _query = { ...query };
        try {
            for (let handler of preHandlers) {
                await handler(_query);
            }
            const resp = await fetch(_query);
            if (resp?.code === 0) {
                for (let handler of postHandlers) {
                    await handler(resp);
                }
                list.value = resp.data?.records || [];
                total.value = resp.data.total;
            }
        }
        catch (e) {
            console.log("获取分页失败：", e);
        }
    }
    // 分页接口参数中应该包含一个current，用于指代当前页码
    function currentChange(current) {
        query.current = current;
        fetchData(query, fetch, preHandlers, postHandlers);
    }
    // 搜索；
    // 关键词在外部控制；
    function search() {
        currentChange(1);
    }
    return { list, total, fetchData, currentChange, search };
}
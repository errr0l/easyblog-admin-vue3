import { ref } from "vue";

/**
 * 列表处理模块；跟分页差不多
 * @param {Reactive<Object>|Object} query 查询参数
 * @param {Function} fetch 请求方法
 * @param {Array<Function>} preHandlers
 * @returns {{list: Ref<UnwrapRef<*[]>, UnwrapRef<*[]> | *[]>, queryList: ((function(): Promise<void>)|*)}}
 */
export function useBaseList({ query, fetch, preHandlers = []} = {}) {
    const list = ref(null);
    async function queryList() {
        const _query = { ...query };
        try {
            for (let handler of preHandlers) {
                handler(_query);
            }
            const resp = await fetch(_query);
            if (resp && resp.code === 0) {
                list.value = resp.data;
            }
            else {
                console.log("获取列表失败, 未知原因.");
            }
        }
        catch (e) {
            console.log("获取列表失败：", e);
        }
    }
    return { list, queryList };
}
import { reactive } from "vue";
import * as accountArticleService from "../api/accountArticle";
import { ElMessage, ElMessageBox } from "element-plus";
import { ARTICLE_STATE_CONFIG, WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION, DELETED, PENDING, DRAFT } from "@/views/article/constants";
import { useBasePagination } from "@/composables/useBasePagination";

export function useMyArticle() {
    // 查询参数
    const query = reactive({
        size: 10,
        current: 1,
        categoryId: "",
        states: [],
        creationType: "",
        keyword: "",
        excludedState: DELETED
    });

    const { list, total, queryPagination, currentChange, search } = useBasePagination({
        query,
        fetch: accountArticleService.getPagination,
        preHandlers: [removeDeletedIfNecessary, setStatesIfNecessary],
    });
    /**
     * 提交审核
     * @param {Object} row 文章数据
     * @returns {Promise<void>}
     */
    async function submit(row) {
        const resp = await accountArticleService.submit({ id: row.id });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = WAITING_FOR_AUDITING;
        }
    }

    async function confirm(row) {
        const resp = await accountArticleService.confirm({ id: row.id });
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            row.state = WAITING_FOR_PUBLICATION;
        }
    }

    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(async () => {
            let resp;
            let deleted = row.state === DELETED;
            resp = deleted ? await accountArticleService.doDel({ id: row.id }) : await accountArticleService.del({ id: row.id });
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                if (deleted) {
                    queryPagination();
                }
                else {
                    row.state = DELETED;
                }
            }
        });
    }

    function cancel(row) {
        ElMessageBox.confirm(`文章[${ARTICLE_STATE_CONFIG[row.state].text}]，确认撤销吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(async () => {
            const resp = await accountArticleService.cancel({ id: row.id });
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                row.state = PENDING;
            }
        });
    }

    function recover(row) {
        ElMessageBox.confirm("即将把文章恢复为【草稿】状态，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }).then(async () => {
            const resp = await accountArticleService.recover({ id: row.id });
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                row.state = DRAFT;
            }
        });
    }

    return {
        list, total, queryPagination, currentChange, search, query,
        confirm, recover, cancel, del, submit
    };
}

// 如果query中包含states，则将其处理为字符串
export function setStatesIfNecessary(_query) {
    if (_query && _query.states) {
        _query.states = _query.states.join(",");
    }
}

// 如果states中包含deleted，则将excludedState=DELETED置空
export function removeDeletedIfNecessary(_query) {
    if (_query.states && _query.states.includes(DELETED)) {
        _query.excludedState = "";
    }
    else {
        _query.excludedState = DELETED;
    }
}
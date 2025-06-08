import { cancel as _cancel, confirm as _confirm, del as _del, doDel, submit as _submit } from "@/api/accountArticle";
import { USER } from "@/constants/general";
import { WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION, ARTICLE_STATE_CONFIG, PENDING, DELETED } from "./articleConstants";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

/**
 * 文章列表处理模块；目前该模块只用于user
 * @param {function} getPagination 分页
 * @returns {{confirm: ((function(*): Promise<void>)|*), add: add, cancel: cancel, submit: ((function(Object): Promise<void>)|*), edit: ((function(*): Promise<void>)|*), del: del}}
 */
export function useArticleList({ getPagination }) {
    const router = useRouter();

    /**
     * 提交审核
     * @param {Object} row 文章数据
     * @returns {Promise<void>}
     */
    async function submit(row) {
        const resp = await _submit({ id: row.id });
        if (resp.code === 0) {
            ElMessage.success("操作成功");
            row.state = WAITING_FOR_AUDITING;
        }
    }

    // 确认文章，操作成功后进入待发布状态
    async function confirm(row) {
        const resp = await _confirm({ id: row.id });
        if (resp.code === 0) {
            ElMessage.success("操作成功");
            row.state = WAITING_FOR_PUBLICATION;
        }
    }

    // 只有处于[审核中]的文章，才可以[撤回]
    function cancel(row) {
        ElMessageBox.confirm(`文章[${ARTICLE_STATE_CONFIG[row.state].text}]，确认撤销吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(async () => {
            const resp = await _cancel({ id: row.id });
            if (resp.code === 0) {
                ElMessage.success("操作成功");
                row.state = PENDING;
            }
        });
    }

    // 跳转至编辑页面
    function add() {
        router.push(`/article/editor?type=${USER}`);
    }

    // 跳转至编辑页面
    async function edit(row) {
        const state = row.state;
        if (state === WAITING_FOR_PUBLICATION || state === WAITING_FOR_AUDITING) {
            try {
                await ElMessageBox.confirm(`文章处于[${ARTICLE_STATE_CONFIG[state].text}]状态，是否继续吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                });
            } catch (e) {
                return;
            }
        }
        router.push({
            path: "/article/editor",
            query: {
                id: row.id,
                type: USER
            }
        });
    }

    // 如果处于删除状态，再点击删除时，将进行物理删除
    function del(row) {
        ElMessageBox.confirm("确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(async () => {
            let resp;
            let deleted = row.state === DELETED;
            if (deleted) {
                resp = await doDel({ id: row.id }).catch((error) => {
                    console.log(error);
                });
            }
            else {
                resp = await _del({ id: row.id }).catch((error) => {
                    console.log(error);
                });
            }
            if (resp.code === 0) {
                ElMessage.success("操作成功");
                if (deleted) {
                    getPagination();
                }
                else {
                    row.state = DELETED;
                }
            }
        });
    }

    return { submit, confirm, add, cancel, del, edit };
}
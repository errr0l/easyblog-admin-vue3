import { useRoute, useRouter as _useRouter } from "vue-router";
import { ADMIN, USER } from "@/constants/general";
import { ARTICLE_STATE_CONFIG, WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION } from "@/views/article/constants";
import { ElMessageBox } from "element-plus";

// 如果使用时有歧义，就设别名吧
export function useRouter() {
    const router = _useRouter();
    const route = useRoute();
    // 添加
    function add() {
        router.push(`/article/editor?type=${USER}`);
    }

    // 返回
    function back() {
        const meta = route.meta;
        const activeMenu = meta.activeMenu;
        router.replace(activeMenu ? activeMenu : '/article');
    }

    // 编辑
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

    function audit(row) {
        router.push({
            path: "/article/editor",
            query: {
                id: row.id,
                type: ADMIN
            }
        });
    }

    return { add, back, edit, audit };
}
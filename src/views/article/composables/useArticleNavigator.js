import { useRoute, useRouter } from "vue-router";
import { ARTICLE_ALL } from "@/constants/general";
import { ARTICLE_STATE_CONFIG, WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION } from "@/views/article/constants";
import { ElMessageBox } from "element-plus";

// 如果使用时有歧义，就设别名吧
export function useArticleNavigator() {
    const router = useRouter();
    const route = useRoute();
    // 添加
    function add() {
        router.push(`/article/editor?from=my`);
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
                from: "my"
            }
        });
    }

    // 管理员的[编辑]，实际上是[审核]
    function audit(row) {
        router.push({
            path: "/article/editor",
            query: {
                id: row.id,
                from: ARTICLE_ALL
            }
        });
    }

    return { add, back, edit, audit };
}
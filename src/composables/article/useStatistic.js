import { onMounted, reactive } from "vue";
import { getStatistic as _ } from "@/api/article";

export function useStatistic() {
    // 文章统计
    const statistic = reactive({});
    async function getStatistic() {
        const resp = await _();
        if (resp?.code === 0) {
            const _statistic = {};
            for (const item of resp.data) {
                _statistic[item.state] = item.count;
            }
            Object.assign(statistic, _statistic);
        }
    }

    onMounted(() => {
        getStatistic();
    });

    return { getStatistic, statistic };
}
import { getCategoryList } from "@/api/article";
import { ref } from "vue";

// 分类处理模块
export function useCategory() {
    const categoryList = ref([]);

    async function queryCategoryList() {
        const resp = await getCategoryList();
        if (resp.code === 0) {
            categoryList.value = resp.data;
        }
    }
    return {
        categoryList,
        queryCategoryList
    };
}
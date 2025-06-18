import { updateAccountInfo as _ } from "@/api/account";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";

/**
 * 更新账号信息；
 * @param {Reactive<Object>} formData 表单数据
 * @param {Function} refresh 刷新
 * @param {Function} compare 比较
 * @param {Ref<Object>} original 原始数据
 * @returns {{updateAccountInfo: ((function(): Promise<void>))}}
 */
export function useUpdateAccountInfo({ formData, refresh, compare, original }) {
    const userStore = useUserStore();
    async function updateAccountInfo() {
        if (!formData.username || !formData.introduction || !formData.email) {
            ElMessage.warning("username、email、introduction不能为空");
            return;
        }
        if (compare(formData, original.value) === 0) {
            ElMessage.success("操作成功")
            return;
        }
        const resp = await _(formData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            // 因为调用接口后，服务器的数据与当前显示的数据可能不一致（图片路径），所以重新调用接口获取最新数据
            await refresh();
            userStore.cache({ data: { user: formData } });
        }
    }

    return { updateAccountInfo };
}
import { updateAccountInfo as _ } from "@/api/account";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";

export function useUpdateAccountInfo({ formData, refresh, compare, original }) {
    const userStore = useUserStore();
    async function updateAccountInfo() {
        if (!formData.username || !formData.introduction || !formData.email) {
            return ElMessage.warning("username、email、introduction不能为空");
        }
        if (compare(formData, original.value) === 0) {
            return ElMessage.success("操作成功");
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
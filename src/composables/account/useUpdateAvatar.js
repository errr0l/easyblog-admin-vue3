import { useElUpload } from "@/composables/useElUpload";
import { addIdentityForImagePath } from "@/utils/common";
import { ref } from "vue";
import { updateAvatar as _ } from "@/api/account";
import { useUserStore } from "@/store/user";
import { ElMessage } from "element-plus";

export function useUpdateAvatar({ formData }) {
    const avatar = ref("");

    const userStore = useUserStore();
    const { createHttpRequest, onSuccess } = useElUpload();
    async function updateAvatar(ctx) {
        const httpRequest = createHttpRequest({
            path: avatar,
            postHandler: addIdentityForImagePath,
            type: 2,
        });
        await httpRequest(ctx);
        const resp = await _({ avatar: avatar.value });
        if (resp?.code === 0) {
            const _imagePath = resp.data.avatar;
            formData.avatar = _imagePath;
            const user = userStore.user;
            user.avatar = _imagePath;
            userStore.cache({ data: { user } });
            ElMessage.success("操作成功");
        }
    }

    return { updateAvatar, onSuccess };
}
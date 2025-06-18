import { useElUpload } from "@/composables/useElUpload";
import { addIdentityForImagePath } from "@/utils/common";
import { ref } from "vue";
import { updateAvatar as _ } from "@/api/account";
import { useUserStore } from "@/store/user";

/**
 * 更新头像
 * @param {Reactive<Object>} formData 表单数据
 * @param {Ref<Object>} original 原始数据
 * @returns {{updateAvatar: ((function(): Promise<void>)), onSuccess: Function}}
 */
export function useUpdateAvatar({ formData, original }) {
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
            original.value.avatar = _imagePath;
            const user = userStore.user;
            user.avatar = _imagePath;
            userStore.cache({ data: { user } });
        }
    }

    return { updateAvatar, onSuccess };
}
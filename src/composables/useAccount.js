import { computed, ref, reactive } from "vue";

import * as accountService from "@/api/account";
import { addIdentityForImagePath } from "@/utils/common";
import { PERMISSION_MENU } from "@/constants/general";
import { ElMessage } from "element-plus";
import { useReminder } from "@/composables/useReminder";
import { useElUpload } from "@/composables/useElUpload";
import { getAccountPermissionList } from "@/api/permission";

/**
 * 账号相关处理模块；
 */
export function useAccount({ userStore } = {}) {
    const defaultAccountFormData = {
        username: "",
        email: "",
        introduction: "",
        avatar: ""
    };
    const accountFormData = reactive({ ...defaultAccountFormData });
    const originalAccountFormData = ref({});
    async function queryAccountInfo() {
        const resp = await accountService.getAccountInfo();
        if (resp?.code === 0) {
            originalAccountFormData.value = resp.data;
            Object.assign(accountFormData, resp.data);
        }
    }

    const permissions = ref(null);
    async function queryPermissions() {
        const resp = await getAccountPermissionList();
        if (resp?.code === 0) {
            permissions.value = resp.data;
        }
    }

    const menus = computed(() => {
        return permissions.value?.filter(item => item.type === PERMISSION_MENU) || [];
    });

    const { hasChanged } = useReminder({ keysChecked: Object.keys(defaultAccountFormData), o1: accountFormData, o2: originalAccountFormData });
    async function updateAccountInfo() {
        if (!accountFormData.username || !accountFormData.introduction || !accountFormData.email) {
            ElMessage.warning("username、email、introduction不能为空");
            return;
        }
        if (!hasChanged()) {
            ElMessage.success("操作成功")
            return;
        }
        const resp = await accountService.updateAccountInfo(accountFormData);
        if (resp?.code === 0) {
            ElMessage.success("操作成功");
            // 因为调用接口后，服务器的数据与当前显示的数据可能不一致（图片路径），所以重新调用接口获取最新数据
            await queryAccountInfo();
            userStore?.cache({ data: { user: accountFormData } });
        }
    }

    const { createHttpRequest, onSuccess } = useElUpload();
    const avatar = ref("");
    async function updateAvatar(ctx) {
        const httpRequest = createHttpRequest({
            path: avatar,
            postHandler: addIdentityForImagePath,
            type: 2,
        });
        await httpRequest(ctx);
        const resp = await accountService.updateAvatar({ avatar: avatar.value });
        if (resp?.code === 0) {
            const _imagePath = resp.data.avatar;
            accountFormData.avatar = _imagePath;
            originalAccountFormData.value.avatar = _imagePath;
            const user = userStore.user;
            user.avatar = _imagePath;
            userStore?.cache({ data: { user } });
        }
    }
    const defaultPasswordFormData = {
        original: "",
        password: "",
        confirmation: ""
    };
    const passwordFormData = reactive({ ...defaultPasswordFormData });
    const passwordFormRef = ref(null);
    async function updatePassword() {
        passwordFormRef.value?.validate(async (valid) => {
            if (!valid) {
                return false;
            }
            const resp = await accountService.updatePassword(passwordFormData);
            if (resp?.code === 0) {
                ElMessage.success("操作成功");
                Object.assign(passwordFormData, { ...defaultPasswordFormData });
            }
        });
    }

    return {
        queryAccountInfo, accountFormData, originalAccountFormData,
        queryPermissions, permissions, menus,
        updateAccountInfo,
        updateAvatar, onUploadSuccess: onSuccess,
        updatePassword, passwordFormData, passwordFormRef
    };
}
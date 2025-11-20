import { computed } from "vue";
import { useAuth } from "@/store/useAuth";

/**
 * 账号相关处理模块；
 */
export function useAccount() {
    const { authTokens, updateAuthToken } = useAuth();

    // 按照责任划分来说，用户资料应该属于"账号"的一部分，而不属于"认证";
    const userDetails = computed(() => authTokens.baseInfo || {});

    const updateUserDetailFromAccountFormData = (accountFormData) => {
        // 浅复制
        const newUserDetails = { ...userDetails.value };
        updateAuthToken('baseInfo', Object.assign(newUserDetails, accountFormData));
    };

    return {
        userDetails, updateUserDetailFromAccountFormData
    };
}
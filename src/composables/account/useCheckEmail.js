import { checkEmail as _ } from "@/api/account";

export function useCheckEmail() {
    async function checkEmail(email) {
        const resp = await _(email);
        return resp?.data.existed;
    }

    return { checkEmail };
}
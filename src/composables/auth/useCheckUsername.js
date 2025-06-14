import { checkUsername as _ } from "@/api/auth";

export function useCheckUsername() {
    async function checkUsername(username) {
        const resp = await _(username);
        if (resp?.code === 0) {
            return resp.data.existed;
        }
    }

    return { checkUsername };
}
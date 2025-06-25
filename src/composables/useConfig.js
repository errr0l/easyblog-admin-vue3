import { useAppStore } from "@/store/app";

// 获取项目配置；
// 从nginx中获取而非接口服务器
export async function useConfig() {
    const appStore = useAppStore();
    const configUrl = "/easyblog/config.json";
    try {
        const resp = await fetch(configUrl)
            .then(res => res.json());
        appStore.setConfig({ config: resp });
        appStore.userStore.init({ prefix: resp.PREFIX });
        return true;
    } catch (error) {
        return false;
    }
}
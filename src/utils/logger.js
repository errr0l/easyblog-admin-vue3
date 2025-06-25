import { useAppStore } from "@/store/app";

const defaultOptions = {
    level: "log",
    name: ""
};

export function getLogger(options) {
    const opts = Object.assign({}, defaultOptions, options);
    let appStore;
    return (messages, level) => {
        function handler() {
            if (!appStore) {
                appStore = useAppStore();
            }
            if (!appStore.config.DEBUG) {
                return;
            }
            const date = new Date();
            const _messages = [`${date.toLocaleString()} -`];
            opts.name && _messages.push(`${opts.name} -`);
            if (Array.isArray(messages)) {
                _messages.push(...messages);
            }
            else {
                _messages.push(messages);
            }
            console[level || opts.level](..._messages);
        }
        if (opts.delay) {
            setTimeout(() => {
                handler();
            }, opts.delay);
            return;
        }
        handler();
    }
}
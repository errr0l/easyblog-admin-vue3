import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import '@/styles/index.scss';
import '@/styles/normalize.css';
import "@/styles/theme/1.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App";
import router from "./router";

import "@/permission";
import defaultImage from "@/assets/images/default-cover.jpg";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

app.provide("getDefaultImage", () => defaultImage);
app.use(ElementPlus, {
    locale: zhCn
});
app.use(createPinia());
app.use(router);

// 组成ep图标；在菜单中使用时，可以直接提对应了组件名的icon名称（大写）
for (const key in ElementPlusIconsVue) {
    const component = ElementPlusIconsVue[key];
    app.component(key, component);
}

app.mount("#app");
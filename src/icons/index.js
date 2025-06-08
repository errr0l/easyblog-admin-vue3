// import Vue from 'vue'
import SvgIcon from "@/components/SvgIcon/index"; // svg component

// register globally
// Vue.component('svg-icon', SvgIcon)

// const req = require.context('./svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys().map(requireContext)
// requireAll(req)

// plugins/i18n.js
export default {
    install: (app, options) => {
        // 在这里编写插件代码
        app.component("svg-icon", SvgIcon);
        const svgIconsContext = import.meta.glob("./svg/*.svg");
        for (const path in svgIconsContext) {
            // 可以在这里做一些处理，比如注册图标名到某个图标库中
            const iconName = path.match(/\.\/.*\/(.*).svg$/)?.[1];
            if (iconName) {
                // 示例：你可以将这些图标保存在一个图标映射表中供后续使用
                // window.iconMap = window.iconMap || {}
                // const module = await svgIconsContext[path]()
                // iconMap[iconName] = module.default
                console.log(`Loaded SVG: ${iconName}`);
            }
        }
    }
};

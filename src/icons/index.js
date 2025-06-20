import SvgIcon from "@/components/SvgIcon/index"; // svg component

export default {
    install: (app, options) => {
        app.component("svg-icon", SvgIcon);
        import.meta.glob("./svg/*.svg");
        // const svgIconsContext = import.meta.glob("./svg/*.svg");
        // for (const path in svgIconsContext) {
        //     const iconName = path.match(/\.\/.*\/(.*).svg$/)?.[1];
        //     if (iconName) {
        //         console.log(`Loaded SVG: ${iconName}`);
        //     }
        // }
    }
};

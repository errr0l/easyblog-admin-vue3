<script lang="jsx">
import { getCurrentInstance, h } from 'vue'
const pattern = /^[A-Z]/;
export default {
    name: "MenuItem",
    functional: true,
    props: {
        icon: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        }
    },
    render() {
        // const { icon, title } = context.props;
        const { icon, title } = this;
        const vnodes = [];

        if (icon) {
            // 如果以大写字母开头，则认为是element plus的图标，并且使用<el-icon><icon /></el-icon>进行渲染
            // if (icon.includes("el-icon")) {
            //     vnodes.push(<i class={[icon, "sub-el-icon"]}/>);
            // }
            if (pattern.test(icon)) {
                const instance = getCurrentInstance();
                const component = instance.appContext.components[icon];
                vnodes.push(
                    <el-icon>
                        {h(component)}
                    </el-icon>
                );
            }
            else {
                vnodes.push(<svg-icon icon-class={icon}/>);
            }
        }

        if (title) {
            vnodes.push(<span slot="title">{(title)}</span>);
        }
        return vnodes;
    },
};
</script>

<style scoped>
.sub-el-icon {
    color: currentColor;
    width: 1em;
    height: 1em;
}
</style>

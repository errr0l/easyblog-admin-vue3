<template>
    <div v-if="!item.hidden">
        <template
            v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, 1)">
                <el-menu-item :index="resolvePath(onlyOneChild.path, 2)" :class="{'submenu-title-noDropdown':!isNest}">
                    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title"/>
                </el-menu-item>
            </app-link>
        </template>

        <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path, 3)" popper-append-to-body>
<!--            <template slot="title">-->
            <template #title>
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"/>
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path, 4)"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>

<script>
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
// import FixiOSBug from './FixiOSBug';
function _resolve(base, target) {
    return '/' + [base.replace(/^\/+|\/+$/g, ''), target.replace(/^\/+|\/+$/g, '')]
        .filter(Boolean)
        .join('/')
}
export default {
    name: "SidebarItem",
    components: { Item, AppLink },
    // mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ""
        }
    },
    data() {
        // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
        // TODO: refactor with render function
        this.onlyOneChild = null;
        return {};
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false;
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item;
                    return true;
                }
            });

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true;
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
                return true;
            }

            return false;
        },
        resolvePath(routePath) {
            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(this.basePath)) {
                return this.basePath;
            }
            // return path.resolve(this.basePath, routePath);
            return _resolve(this.basePath, routePath);
        }
    }
};
</script>

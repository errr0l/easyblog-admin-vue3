<template>
    <section class="app-main">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" v-if="cached" :key="key" />
            </keep-alive>
            <component :is="Component" v-if="!cached" :key="key" />
        </router-view>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 计算属性：key
const key = computed(() => route.path);

// 计算属性：cached
const cached = computed(() => {
    return !!route.meta?.cached;
});
</script>

<style scoped>
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    /* background-color: #fcfcfc; */
    background-color: #f5f5f5;
}
.fixed-header + .app-main {
    padding-top: 50px;
}
</style>
// global.d.ts

import * as Vue from 'vue'

declare global {
    type Ref<T = any> = Vue.Ref<T>
    type Reactive<T = any> = Vue.Reactive<T>
    type ComputedRef<T = any> = Vue.ComputedRef<T>
    type WatchStopHandle = Vue.WatchStopHandle
    type SetupContext<E = Vue.EmitsOptions, M extends Vue.SetupContextMacros = {}> = Vue.SetupContext<E, M>
    type Component<P = any> = Vue.Component<P>
    type DefineComponent<T = any> = Vue.DefineComponent<T>
    type VNode = Vue.VNode
    type PropType<T> = Vue.PropType<T>
    type UnwrapRef<T> = Vue.UnwrapRef<T>
    type ToRefs<T = any> = Vue.ToRefs<T>
}
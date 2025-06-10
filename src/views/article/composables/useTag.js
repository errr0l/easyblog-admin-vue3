import { computed, nextTick, ref } from "vue";

// 标签处理模块
export function useTag({ formData }) {
    const tag = ref("");
    const tags = computed(() => {
        if (formData.tag) {
            return formData.tag.split(',');
        }
        return [];
    });
    const tagInputVisible = ref(false);
    const tagInput = ref(null);
    // 移除标签；
    function removeTag(index) {
        const _tags = [...tags.value];
        _tags.splice(index, 1);
        formData.tag = _tags.join(",");
    }
    // 添加标签；
    function addTag() {
        if (tag.value) {
            formData.tag += `,${tag.value}`;
        }
        tagInputVisible.value = false;
        tag.value = '';
    }
    function showTagInput() {
        tagInputVisible.value = true;
        nextTick(() => {
            if (tagInput.value) {
                const node = tagInput.value.$refs?.input;
                if (node) {
                    node.focus();
                }
            }
        });
    }

    return {
        tags, tag, tagInput, tagInputVisible,
        showTagInput, addTag, removeTag
    };
}
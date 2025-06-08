import { computed, nextTick, ref } from "vue";

// 标签处理模块
export function useTag({ formData }) {
    const tag = ref("");
    const tags = computed(() => formData.tag.split(','));
    const tagInputVisible = ref(false);
    const tagInput = ref(null);
    // 移除标签；
    function removeTag(tag, index) {
        const pattern = new RegExp(tag + ',?');
        formData.tag = formData.tag.replace(pattern, '');
    }
    // 添加标签；
    function addTag() {
        if (tag.value) {
            formData.tag += tag.value;
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
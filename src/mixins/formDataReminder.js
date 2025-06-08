export const formDataReminder = {
    data() {
        return {
            skipComparison: false,
            formData: null,
            original: null,
            contentField: 'content'
        }
    },
    mounted() {
        if (this.$refs.tuiEditor) {
            this.$refs.tuiEditor.invoke('addHook', 'addImageBlobHook', this.imageBlobHook);
        }
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    },
    destroyed() {
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
    },
    beforeRouteLeave(to, from, next) {
        // 比较整个表单字段
        const r = this.compare(this.formData, this.original);
        if (r === 0) {
            next();
        }
        else {
            this.alert(next);
        }
    },
    methods: {
        imageBlobHook() {},
        beforeUnloadHandler(e) {
            const r = this.compare(this.formData, this.original);
            if (r === 0) {
                return;
            }
            e.returnValue = "内容尚未保存。";
        },
        alert(next) {
            this.$confirm('内容尚未保存，改动部分将会被丢弃，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                next();
            }).catch(() => {
                next(false);
            });
        },
        // 0放行
        // 20240522还有问题；有些文章会提示
        compare(o1, o2) {
            const equal = 0;
            const notEqual = -1;
            // 跳过比较；比如，已经提交保存了的情况下
            if (this.skipComparison) {
                return equal;
            }
            // 比较整个表单字段
            // const r = this.compare(this.formData, this.original);
            if (o1 === null || o2 === null) {
                return equal;
            }
            for (let key of this.keysChecked || []) {
                if (o1[key] !== o2[key]) {
                    return notEqual;
                }
            }
            // 将markdown文本读取进markdown编辑器后，即经markdown编辑器处理文本后，文本可能会出现变化；
            // 写文章时，注意删除多余的空格即可
            if (this.$refs.tuiEditor) {
                let content = (this.$refs.tuiEditor.invoke('getMarkdown') || "").trim();
                let _content = (this.formData[this.contentField] || "").trim();
                if (!content && !_content) {
                    return equal;
                }
                if (content.length !== _content.length || content !== _content) {
                    return notEqual;
                }
            }
            return equal;
        },
    }
};

import { uploadImage } from "@/api/file";
import { addIdentityForImagePath } from "@/utils/common";

export const uploadMixin = {
    data() {
        return {
            imagePath: ""
        }
    },
    methods: {
        async requstHandler(ctx) {
            const formData = new FormData();
            formData.append([ctx.filename], ctx.file);
            const resp = await uploadImage(formData, this.imageParams || {});
            if (resp.code === 0) {
                this.imagePath = addIdentityForImagePath(resp.data.path);
            }
            return this.imagePath;
        },
        successHandler(response, file, fileList) {
            this.$message.success("上传成功");
        },
        exceedHandler() {
            this.$message.warning("上传图片超出限制");
        },
    },
};
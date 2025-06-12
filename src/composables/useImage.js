import { uploadImage } from "@/api/file";

/**
 * 图片处理模块；包含上传、删除图片
 * @returns {{upload: ((function(Object): Promise<String>)|*), remove: remove}}
 */
export function useImage() {
    /**
     * 上传图片
     * @param {Object} options
     * @typedef {Object} options
     * @property {File} file 文件数据
     * @property {String} fileName 文件名称
     * @returns {Promise<String>}
     */
    async function upload(options) {
        const { file, fileName = 'file', ...others } = options;
        const formData = new FormData();
        formData.append(`${fileName}`, file);
        const resp = await uploadImage(formData, others);
        if (resp.code === 0) {
            return resp.data.path;
        }
        return "";
    }

    function remove() {}

    return {
        upload, remove
    };
}
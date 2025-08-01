import { ElMessage } from "element-plus";
import { useImage } from "./useImage";

/**
 * Element Plus上传组件处理模块
 * @returns {{createHttpRequest: (function({path: Ref<String>, postHandler: Function, type: Number}): function(*): Promise<void>), onSuccess: onSuccess}}
 */
export function useElUpload(ElUploadOptions = {}) {
    const { upload } = useImage();
    /**
     * 创建Upload组件上传图片方法（自主上传）
     * @param {Object} httpRequestOptions
     * @typedef {Object} httpRequestOptions
     * @property {Ref<String>} path 图片路径
     * @property {function} postHandler 图片路径处理器
     * @property {Number} type 上传图片类型；1=后台图片，11=后台头像，2=前台图片（跟文章相关的都属于前台）
     * @returns {(function(*): Promise<void>)|*}
     */
    function createHttpRequest(httpRequestOptions) {
        const { path, postHandler, type = 2 } = httpRequestOptions;
        return async (options) => {
            const _path = await upload({ file: options.file, fileName: options.filename, type });
            if (_path) {
                path.value = postHandler ? postHandler(_path) : _path;
            }
        }
    }

    // 简便的通知；如果需要更复杂的可以另外定义
    function onSuccess() {
        const { message = "上传成功" } = ElUploadOptions;
        ElMessage.success(message);
    }

    return { createHttpRequest, onSuccess };
}
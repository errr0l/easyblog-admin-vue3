import { useImage } from "./useImage";

/**
 * markdown编辑器相关逻辑处理模块；
 * 当前的markdown编辑器为：md-editor-v3；
 * @returns {{createOnUploadImg: (function(*): function(*, *): Promise<void>)}}
 */
export function useMarkdownEditor() {
    const { upload } = useImage();
    // 只支持单传；
    function createOnUploadImg(onUploadImgOptions) {
        const { path, pathHandler, type = 2 } = onUploadImgOptions;
        return async (files, callback) => {
            const file = files[0];
            const _path = await upload({ file, type });
            if (_path) {
                path.value = pathHandler ? pathHandler(_path) : _path;
                callback([{ url: path.value, alt: 'image' }]);
            }
            else {
                callback([new Error("上传失败")]);
            }
        }
    }
    return {
        createOnUploadImg
    };
}
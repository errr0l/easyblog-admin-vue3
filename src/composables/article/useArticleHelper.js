
import { readFileContent, removeMarkdownTags, extractMarkdownTitle } from "../../utils/common";

export function useArticleHelper() {
    // 取文章内容的200个字符
    function createSummary(content) {
        return removeMarkdownTags(content.slice(0, 200)) + '...';
    }

    return {
        readFileContent,
        removeMarkdownTags,
        extractMarkdownTitle,
        createSummary
    };
}
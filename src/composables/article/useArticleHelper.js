
import { readFileContent, removeMarkdownTags, extractMarkdownTitle } from "../../utils/common";

export function useArticleHelper() {
    // 取文章内容的120个字符
    function createSummary(content) {
        return removeMarkdownTags(content.slice(0, 120)) + '...';
    }

    return {
        readFileContent,
        removeMarkdownTags,
        extractMarkdownTitle,
        createSummary
    };
}
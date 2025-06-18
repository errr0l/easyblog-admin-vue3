export const DRAFT = 0;
export const PENDING = 1;
export const WAITING_FOR_AUDITING = 2;
export const WAITING_FOR_CONFIRMATION = 3;
export const WAITING_FOR_PUBLICATION = 31;
const PUBLISHED = 4;
const REJECTED = 5;
export const DELETED = 6;

export const ARTICLE_STATE_CONFIG = {
    [DRAFT]: {
        type: 'info',
        text: '草稿',
        effect: 'plain'
    },
    [PENDING]: {
        type: 'info',
        text: '待提交',
        effect: 'plain'
    },
    [WAITING_FOR_AUDITING]: {
        type: 'warning',
        text: '待审核',
        effect: 'plain'
    },
    [WAITING_FOR_CONFIRMATION]: {
        type: 'warning',
        text: '待确认',
        effect: 'plain'
    },
    [WAITING_FOR_PUBLICATION]: {
        type: 'warning',
        text: '待发布',
        effect: 'plain'
    },
    [PUBLISHED]: {
        type: 'primary',
        text: '已发布',
        effect: 'dark'
    },
    [REJECTED]: {
        type: 'info',
        text: '审核不通过',
        effect: 'dark'
    },
    [DELETED]: {
        type: 'info',
        text: '已删除',
        effect: 'dark'
    }
};

// 文章创作类型
export const ORIGINAL = 0;
export const REPRINT = 1;

// 审核意见
export const OPINION_APPROVAL = 1;
export const OPINION_REJECTION = 0;

export const CREATION_TYPE_CONFIG = {
    [ORIGINAL]: {
        text: '原创'
    },
    [REPRINT]: {
        text: '转载'
    }
};

export const OPINION_CONFIG = {
    [OPINION_APPROVAL]: {
        text: '通过',
        value: OPINION_APPROVAL
    },
    [OPINION_REJECTION]: {
        text: '不通过',
        value: OPINION_REJECTION
    }
};

// 当作为对象key时，已经被转换为了字符串，因此要将其转回数字
export const articleStates = Object.keys(ARTICLE_STATE_CONFIG).map(item => ({ id: +item, name: ARTICLE_STATE_CONFIG[item].text }));

export const creationTypes = [ORIGINAL, REPRINT].map(item => ({
    id: item,
    name: CREATION_TYPE_CONFIG[item].text
}));

// export function useArticleConstants() {
//     return {
//         creationTypes, articleStates, DELETED, ARTICLE_STATE_CONFIG, CREATION_TYPE_CONFIG,
//         PENDING, WAITING_FOR_AUDITING, WAITING_FOR_CONFIRMATION
//     };
// }
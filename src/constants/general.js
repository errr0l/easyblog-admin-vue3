// 文章状态
// export const DRAFT = 0;
// export const PENDING = 1;
// export const WAITING_FOR_AUDITING = 2;
// export const WAITING_FOR_CONFIRMATION = 3;
// export const WAITING_FOR_PUBLICATION = 31;
// export const PUBLISHED = 4;
// export const REJECTED = 5;
// export const DELETED = 6;

// export const ARTICLE_STATE_TEXTS = {
//     [DRAFT]: '草稿',
//     [PENDING]: "待提交",
//     [WAITING_FOR_AUDITING]: "待审核",
//     [WAITING_FOR_CONFIRMATION]: "待确认",
//     [WAITING_FOR_PUBLICATION]: "待发布",
//     [PUBLISHED]: "已发布",
//     [REJECTED]: "审核不通过",
//     [DELETED]: "已删除"
// };

// 文章创作类型
// export const ORIGINAL = 0;
// export const REPRINT = 1;

// export const CREATION_TYPE_TEXTS = {
//     [ORIGINAL]: "原创",
//     [REPRINT]: "转载"
// };

// 权限类型
export const PERMISSION_MENU = 1;
export const PERMISSION_OPERATION = 2;

// 用户类型
export const USER = "user"; // 普通用户
export const ADMIN = "admin"; // 管理员

// 审核意见
// export const OPTION_APPROVAL = 1;
// export const OPTION_REJECTION = 0;

// 项目标识
export const IDENTITY = "project=easyblog";

export const EXCEPTION = "exception";
export const SUCCESS = "success";
// export default {
//     ARTICLE_STATE_TEXTS, CREATION_TYPE_TEXTS,
//     ORIGINAL, REPRINT,
//     PENDING, WAITING_FOR_AUDITING, WAITING_FOR_PUBLICATION, PUBLISHED, DELETED
// }
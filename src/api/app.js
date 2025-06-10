import request from "@/utils/request";

export function publish(data) {
    return request({
        url: `/app/article/publish`,
        method: 'post',
        data
    });
}

export function getPublishProgress() {
    return request({
        url: `/app/article/publishingProgress`,
        method: 'get'
    });
}
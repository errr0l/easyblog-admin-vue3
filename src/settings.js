// module.exports = {
import application from "./application.json";

export default {
    title: application.title,

    /**
     * @type {boolean} true | false
     * @description Whether fix the header
     */
    fixedHeader: true,

    /**
     * @type {boolean} true | false
     * @description Whether show the logo in sidebar
     */
    sidebarLogo: true,
    copyright: application.copyright,
    logo: new URL(application.logo, import.meta.url).href,
    // 登录、注册左边图片
    cover: new URL(application.cover, import.meta.url).href,
    registerGreeting: application.registerGreeting,
    loginGreeting: application.loginGreeting,
};
// module.exports = {
// import application from "./application.json";
import appConfig from 'virtual:json-assets/appConfig';

export default {
    title: appConfig.title,

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
    copyright: appConfig.copyright,
    logo: appConfig.logo,
    // 登录、注册左边图片
    cover: appConfig.cover,
    registerGreeting: appConfig.registerGreeting,
    loginGreeting: appConfig.loginGreeting,
};
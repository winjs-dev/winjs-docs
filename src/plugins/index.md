# 简介

## 插件可以做什么

WinJS 的所有功能都是通过插件系统实现的，这意味着 WinJS 中的所有能力是都对开发者开放的。开发者可以通过编写插件来扩展更多功能，适配复杂场景，包括但不限于：

- 注册命令
- 修改 WinJS 配置、配置校验 Schema
- 修改编译时的 Webpack/Babel/Less/Sass/Tailwind CSS/... 配置
- 修改运行时需要渲染的 Vue 组件
- 修改页面路由
- 自定义动态 HTML 模版
- 自定义 Vue 组件客户端
- ...

当 WinJS 暂时没有覆盖到你所需要的功能或场景时，可以开发一个自定义插件，来实现适配特殊场景的相关功能。

## 插件和插件集

<img src="/images/plugins/plugins.png" alt="plugins"/>

WinJS 支持插件和插件集，通过这张图应该很好理解到他们的关系，通过插件集我们把插件收敛依赖然后支持不同的业务类型。插件是为了扩展一个功能，而插件集是为了扩展一类业务。比如要支持
vue2，我们可以有 @winner-fed/preset-vue2，包含 vue 2.x 相关的构建和运行时；比如要支持 h5 的应用类型，可以有
@winner-fed/preset-pc，把 pc 相关的功能集合到一起。

如果要类比，插件集和 babel 的 preset，以及 eslint 的 config 都类似。

## 插件列表

| 插件                                                                       | 介绍                                                                                                 |
|--------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| [@winner-fed/plugins/dist/mf](./mf.md)                                   | 集成 webpack5 新特性 Module Federation 功能                                                               | 
| [@winner-fed/plugin-request](./request.md)                               | 基于 `Axios` 封装的 request，及 `vue-hooks-plus` 提供的强大管理网络请求能力 `useRequest` Hook 函数。内置防止重复请求、请求节流、错误处理等功能 | 
| [@winner-fed/plugin-locale](./i18n.md)                                   | 基于 [Vue I18n](https://vue-i18n.intlify.dev/guide/)，提供国际化能力，适用于 vue3                                | 
| [@winner-fed/plugin-keepalive](./keepalive.md)                           | 配置需要状态保持的路由，适用于 vue3                                                                               | 
| [@winner-fed/plugin-access](./access.md)                                 | 提供对页面资源的权限配置能力，适用于 vue3                                                                            |
| [@winner-fed/plugin-vant](./uiframework.md#vant)                         | vant 组件库，适用于 vue2 和 vue3                                                                           |                                                                                 
| [@winner-fed/plugin-element-ui](./uiframework.md#elementui)              | element-ui 组件库，适用于 vue2                                                                            
| [@winner-fed/plugin-hui](./uiframework.md#hui)                           | HUI 组件库，适用于 vue2                                                                                   
| [@winner-fed/plugin-element-plus](./uiframework.md#elementplus)          | element-plus 组件库，适用于 vue3                                                                          | 
| [@winner-fed/plugin-antdv](./uiframework.md#antdv)                       | ant-design-vue 组件库，适用于 vue2 和 vue3                                                                 | 
| [@winner-fed/plugin-winui](./uiframework.md#winui)                       | WinUI 组件库，适用于 vue2 和 vue3                                                                          | 
| [@winner-fed/plugins/dist/mobile-layout](./mobilelayout.md)              | 移动端布局方案，适用于 vue3                                                                                   | 
| [@winner-fed/plugin-web-update-notification](./webupdatenotification.md) | 检测网页更新通知更新插件                                                                                       | 
| [@winner-fed/plugin-css-assets-local](./cssassetslocal.md)               | CSS 资源本地化                                                                                          | 
| [@winner-fed/plugin-watermark](./watermark.md)                           | 水印                                                                                                 | 
| [@winner-fed/plugin-assets-retry](./assetsretry.md)                      | 静态资源加载失败时自动发起重试请求                                                                                  | 
| [@winner-fed/plugin-wconsole](./wconsole.md)                             | 移动端调试工具                                                                                            | 
| [@winner-fed/plugin-build-huipro](./buildhuipro.md)                      | 构建Hui pro 1.0 子系统插件                                                                                |
| [@winner-fed/plugin-hui-micro-app](./huimicroapp.md)                     | 适配 HUI 2.0 微前端                                                                                     | 
| [@winner-fed/plugin-qiankun](./qiankun.md)                               | 适配乾坤微前端                                                                                            | 
| [@winner-fed/plugin-remove-console](./removeconsole.md)                  | 在生产模式下自动移除构建产物的调试信息                                                                                |
| [@winner-fed/plugin-icons-legacy](./iconslegacy.md)                      | 针对 Vue2 的 icons 的遗留方案                                                                              | 
| [@winner-fed/plugin-openapi](./openapi.md)                               | 将 Swagger 文档生成前端所需的接口请求、Mock 文件和文档说明                                                               | 
| [@winner-fed/plugin-unicons](./unicons.md)                               | icons 的统一解决方案                                                                                      | 
| [@winner-fed/plugin-viewport](./viewport.md)                             | 视窗单位适配的解决方案                                                                                        | 
| [@winner-fed/plugin-security](./security.md)                             | 子资源完整性 Subresource Integrity（SRI）的解决方案                                                             |
| [@winner-fed/plugin-check-syntax](./checksyntax.md)                      | 用于分析产物的语法兼容性，判断是否存在导致兼容性问题的高级语法                                                             | 

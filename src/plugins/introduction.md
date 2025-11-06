# Introduction

## What Plugins Can Do

All functionality in WinJS is implemented through the plugin system, which means all capabilities in WinJS are open to developers. Developers can extend more functionality and adapt to complex scenarios by writing plugins, including but not limited to:

- Registering commands
- Modifying WinJS configuration and configuration validation schemas
- Modifying compile-time configurations for Webpack/Babel/Less/Sass/Tailwind CSS/...
- Modifying Vue components that need to be rendered at runtime
- Modifying page routes
- Customizing dynamic HTML templates
- Customizing Vue component clients
- ...

When WinJS doesn't yet cover the functionality or scenarios you need, you can develop a custom plugin to implement functionality that adapts to special scenarios.

## Plugins and Plugin Presets

<img src="/images/plugins/plugins.jpeg" alt="plugins"/>

WinJS supports both plugins and plugin presets. This diagram clearly illustrates their relationship - through plugin presets, we consolidate plugin dependencies to support different business types. Plugins are designed to extend a single feature, while plugin presets are designed to extend a category of business functionality. For example, to support Vue 2, we can have @winner-fed/preset-vue2, which includes Vue 2.x related build and runtime features; to support H5 application types, we can have @winner-fed/preset-pc, which brings together PC-related functionality.

To draw an analogy, plugin presets are similar to Babel presets and ESLint configs.

## Plugin List

| Plugin                                                                    | Description                                                                                                                             |
|---------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| [@winner-fed/plugin-request](./request.md)                               | Request wrapper based on `Axios` and powerful network request management `useRequest` Hook from `vue-hooks-plus`. Built-in features include duplicate request prevention, request throttling, and error handling | 
| [@winner-fed/plugin-locale](./i18n.md)                                   | Internationalization capabilities based on [Vue I18n](https://vue-i18n.intlify.dev/guide/), compatible with Vue 3                                | 
| [@winner-fed/plugin-keepalive](./keepalive.md)                           | Configure routes that require state persistence, compatible with Vue 3                                                                               | 
| [@winner-fed/plugin-access](./access.md)                                 | Provides permission configuration capabilities for page resources, compatible with Vue 3                                                                            |
| [@winner-fed/plugin-vant](./uiframework.md#vant)                         | Vant UI component library, compatible with Vue 2 and Vue 3                                                                           |                                                                                 
| [@winner-fed/plugin-element-ui](./uiframework.md#elementui)              | Element UI component library, compatible with Vue 2                                                                            
| [@winner-fed/plugin-hui](./uiframework.md#hui)                           | HUI component library, compatible with Vue 2                                                                                   
| [@winner-fed/plugin-element-plus](./uiframework.md#elementplus)          | Element Plus component library, compatible with Vue 3                                                                          | 
| [@winner-fed/plugin-antdv](./uiframework.md#antdv)                       | Ant Design Vue component library, compatible with Vue 2 and Vue 3                                                                 | 
| [@winner-fed/plugin-winui](./uiframework.md#winui)                       | WinUI component library, compatible with Vue 2 and Vue 3                                                                          | 
| [@winner-fed/plugins/dist/mobile-layout](./mobilelayout.md)              | Mobile layout solution, compatible with Vue 3                                                                                   | 
| [@winner-fed/plugin-web-update-notification](./webupdatenotification.md) | Web update detection and notification plugin                                                                                       | 
| [@winner-fed/plugin-css-assets-local](./cssassetslocal.md)               | CSS asset localization                                                                                          | 
| [@winner-fed/plugin-watermark](./watermark.md)                           | Watermark functionality                                                                                                 | 
| [@winner-fed/plugin-assets-retry](./assetsretry.md)                      | Automatically retry requests when static asset loading fails                                                                                  | 
| [@winner-fed/plugin-wconsole](./wconsole.md)                             | Mobile debugging tools                                                                                            |
| [@winner-fed/plugin-qiankun](./qiankun.md)                               | Qiankun microfrontend integration                                                                                            | 
| [@winner-fed/plugin-remove-console](./removeconsole.md)                  | Automatically remove debug information from build artifacts in production mode                                                                                |
| [@winner-fed/plugin-icons-legacy](./iconslegacy.md)                      | Legacy icon solution for Vue 2                                                                              | 
| [@winner-fed/plugin-openapi](./openapi.md)                               | Generate frontend API requests, Mock files, and documentation from Swagger specifications                                                               | 
| [@winner-fed/plugin-unicons](./unicons.md)                               | Unified icon solution                                                                                      | 
| [@winner-fed/plugin-viewport](./viewport.md)                             | Viewport unit adaptation solution                                                                                        | 
| [@winner-fed/plugin-security](./security.md)                             | Subresource Integrity (SRI) solution                                                             |
| [@winner-fed/plugin-check-syntax](./checksyntax.md)                      | Analyze build artifact syntax compatibility to detect advanced syntax that may cause compatibility issues                                                             |

For more plugins, visit [https://github.com/winjs-dev](https://github.com/winjs-dev) 

# 构建工具

**WinJS 的构建能力由 WinJS Builder 提供。**

WinJS Builder 是 WinJS 体系的核心组件之一，它是一个基于 Webpack 的 Web 构建工具，可以脱离 WinJS 被独立使用。WinJS Builder 同时支持 Webpack、Vite、Rsbuild 打包工具，默认情况下使用最成熟的 Webpack 进行打包。

## 构建架构

从构建的角度看，WinJS 分为三层架构，从上到下依次是：

- 上层研发框架：WinJS。
- 通用构建工具：WinJS Builder。
- 底层打包工具：Webpack、Vite、Rsbuild。

![builder](/images/guide/builder-layers.jpg)

## 构建配置

WinJS 的配置继承自 WinJS Builder，因此你可以在 WinJS 中使用 WinJS Builder 提供的所有构建配置。

以 WinJS Builder 的 `title` 配置项为例，你可以直接在 `config.ts` 文件中使用该配置项，它会被自动传递给 WinJS Builder。

```ts 
export default {
  title: 'example',
};
```

关于构建配置的详细说明，请参考 [「WinJS Builder - Builder 配置」](../config/config.md)。

## 构建能力

WinJS Builder 提供了丰富的构建能力，包括 JavaScript 编译、CSS 编译、静态资源处理、代码热更新、代码压缩、TS 类型检查等几十种能力。
 
## 扩展

### Bundler
指 Webpack、Vite、Rsbuild 等模块打包工具。

打包工具的主要目标是将 JavaScript、CSS 等文件打包在一起，打包后的文件可以在浏览器、Node.js 等环境中使用。当 Bundler 处理 Web 应用时，它会构建一个依赖关系图，其中包含应用需要的各个模块，然后将所有模块打包成一个或多个 bundle。

### Builder
WinJS Builder 指的是 WinJS 的构建工具，它的目标是「复用构建工具的最佳实践」。

因为 Webpack 等打包工具是比较底层的，如果我们基于 Webpack 来构建一个项目，需要充分理解 Webpack 的各个配置项和三方插件，并进行繁琐的配置组合和调试工作。

而 Builder 比 Bundler 的封装程度更高，并默认集成代码转换、代码压缩等能力。通过接入 Builder，你可以快速获得构建 Web 应用的能力。

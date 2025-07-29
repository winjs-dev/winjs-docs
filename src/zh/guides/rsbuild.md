# Rsbuild 模式 <Badge type="tip" text=">=0.9.4" />

[Rsbuild](https://rsbuild.dev/) 是一个现代的前端构建工具，它基于 Rust 语言开发，旨在提供更快的构建速度和更优的资源使用效率。Rsbuild 的设计目标是成为一种能够替代现有 JavaScript 构建工具（如 Webpack、Rollup 等）的解决方案。底层由 [Rspack](https://rspack.dev/) 驱动的高性能构建工具，它默认包含了一套精心设计的构建配置，提供开箱即用的开发体验，并能够充分发挥出 Rspack 的性能优势。

## 开启 Rsbuild 模式

在配置文件 `.winrc` 中进行以下配置启用 Rsbuild 模式：

- **类型**：`{ removeConsole: boolean | ConsoleType[], lightningcssLoader: boolean | Rspack.LightningcssLoaderOptions | Function }`
- **默认值**：`false`

rsbuild 的相关配置选项：

- removeConsole: 在生产环境 build 阶段构建时，是否自动移除代码中的 `console.[methodName]`。默认为 `false`。 当
  removeConsole 被设置为 true 时，会移除所有类型的 `console.[methodName]`。
- lightningcssLoader: 参考 [lightningcssLoader](https://rsbuild.dev/zh/config/tools/lightningcss-loader)。默认为 `true`。

```ts
export default {
  rsbuild: {
    removeConsole: true
  }
}
```

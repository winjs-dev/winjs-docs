# 代码拆分指南

WinJS 默认 按页拆包、按需加载。

### 使用分包策略

WinJS 内置了不同的代码拆分策略 ( [codeSplitting](../config/config#codesplitting) ) ，通过配置开启：

```ts
// .winrc.ts
export default {
  codeSplitting: {
    jsStrategy: 'granularChunks'
  }
}
```

这会按照一定的优化策略进行自动分包，若需手动进行更细致的分包，请参见下文。

### 手动拆分

当你的产物体积变大时，可进一步手动拆包。

通常情况下，我们会手动拆分引用了较大第三方库的组件，实现按需加载。

### 分析产物构成

通过指定 [ANALYZE](./env-variables#analyze) 环境变量可以分析产物构成，根据分析结果来修改代码和进一步决策。

## 使用 Dynamic Import 拆包

除了 `chunkSplit` 配置，使用 dynamic import 拆包也是一项重要的优化手段，它可以有效减少首屏的包体积。

:::tip 关于 dynamic import
Dynamic import 是 ECMAScript 2020 引入的一个新特性，它允许你动态地加载一些 JavaScript 模块。
:::

当打包工具遇到 `import()` 语法时，它会自动将相关的代码分割成一个新的 chunk，并在运行时按需加载。

例如，项目中有一个大的模块 `bigModule.ts`（也可以是一个第三方依赖），你可以使用 dynamic import 来按需加载它：

```js
// 在某个需要使用 bigModule 的地方
import('./bigModule.ts').then((bigModule) => {
  // 使用 bigModule
});
```

当你运行构建命令时，`bigModule.ts` 就会被自动分割成一个新的 chunk，并在运行时按需加载。

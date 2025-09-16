# 使用 Vue2 {#withVue2}

本文介绍如何在 WinJS 使用 Vue2 , WinJS Vue2 大部分配置和 Vue3 的相同。

::: warning 注意
这里重点提下，这里 Vue2 的版本分为 **2.7.x** 和 **2.6.x及以下** 两个版本。文档中所列出的相关配置及API都是适用于 `2.7.x`，`2.6.x及以下`部分兼容。
:::

## 启动方式

### 安装

```bash
pnpm add @winner-fed/preset-vue2 -D
```

### 安装 Vue2 版本

```bash
pnpm add vue@">=2.7.14"
```

```json
{
  "dependencies": {
    "vue": "^2.7.14" // [!code ++]
  }
}
```

::: warning 注意
在项目工程中显示安装所需要的 Vue2 版本（具体安装的版本根据项目需要决定即可）。不过，WinJS 也会自动安装 `^2.7.14`。
:::

### 配置预设

注意：从 `0.18.0` 开始，WinJS 不用**显示配置**有关 Vue2 和 Vue3 的预设，因此下面这段配置可以移除。

```ts
// .winrc.ts or config/config.ts 中
export default {
  presets: [require.resolve('@winner-fed/preset-vue2')],
};
```

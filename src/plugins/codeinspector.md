# 页面开发提效工具

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-code-inspector?style=flat-square&colorB=646cff)

点击页面上的 DOM，它能够自动打开你的 IDE 并将光标定位到 DOM 对应的源代码位置。

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-code-inspector -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-code-inspector -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-code-inspector -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-code-inspector -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-code-inspector')],
  codeInspector: {}
});
```

## 配置和参数

参考：[CodeInspector](https://inspector.fe-dev.cn/guide/introduction.html)

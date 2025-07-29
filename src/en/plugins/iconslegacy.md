# icons 遗留方案

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-icons-legacy?style=flat-square&colorB=646cff)

icons 的遗留方案，主要提供 Vue2 使用。使用 SvgIcon 组件。默认 src/icons 目录的 svg 文件采用此方案。该方案底层依赖了 svg-sprite-loader 实现，所以 bundler 不支持 vite。

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-icons-legacy -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-icons-legacy -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-icons-legacy -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-icons-legacy -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-icons-legacy')],
  iconsLegacy: {
    include: []
  }
});
```
 
## 配置
 
### include
- **类型**：`Array<string>` 
- **默认值**：`[]`

用于额外需要使用此方案解析的 svg 文件。注意需要使用**绝对路径**。

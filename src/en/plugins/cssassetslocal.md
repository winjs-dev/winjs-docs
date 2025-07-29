# CSS 资源本地化

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-css-assets-local?style=flat-square&colorB=646cff)

组件代码里有可能会依赖一些远程 CDN 的字体文件等，某些情况下网站运行时可能访问不了。该插件提供在构建部署时将 CSS 中的网络资源本地化能力，例如字体文件等。

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-css-assets-local -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-css-assets-local -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-css-assets-local -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-css-assets-local -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts 
import { defineConfig } from 'win';

export default defineConfig(() => ({
  plugins: ['@winner-fed/plugin-css-assets-local'],
  cssAssetsLocal: {
    outputPath: 'assets'
  }
}));
```

## 配置

### `outputPath`

提取后的静态文件目录前缀

- 类型: `string`
- 默认值: `assets`

### `relativeCssPath`

提取的文件后相对于 CSS 的路径

- 类型: `string`
- 默认值: `../`

### `enableInDev`

本地调试时是否启用插件

- 类型: `boolean`
- 默认值: `false`

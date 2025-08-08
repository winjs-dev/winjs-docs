# 适配微前端-乾坤

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-qiankun?style=flat-square&colorB=646cff)

构建的产物适配乾坤

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-qiankun -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-qiankun -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-qiankun -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-qiankun -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-qiankun')],
  qiankun: {
    child: {}
  }
});
```

# 移除 console

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-remove-console?style=flat-square&colorB=646cff)

在 **生产模式(production mode)** 下自动移除构建产物的`[log|warn|error|info|debug]` 和 `debugger`。

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-remove-console -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-remove-console -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-remove-console -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-remove-console -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-remove-console')],
  removeConsole: {}
});
```

## 配置

```js
removeConsole({
  // don't remove console.([log|warn|error|info|debug]) and debugger these module
  external: [],

  // remove console type of these module
  // enum: ['log', 'warn', 'error', 'info', 'debug']
  consoleType: ['log'],

  // filters for transforming targets
  include: [/\.[jt]sx?$/, /\.vue\??/],
  exclude: [/node_modules/, /\.git/],
})
```

## 示例
可参考 [with-remove-console](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/-/tree/dev/examples/with-remove-console)

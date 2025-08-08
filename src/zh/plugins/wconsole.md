# 移动端调试工具

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-wconsole?style=flat-square&colorB=646cff)

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-wconsole -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-wconsole -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-wconsole -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-wconsole -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-wconsole')],
  wconsole: {
    // 三者使用其一即可或全部使用均可
    vconsole: {},
    eruda: {},
    pagespy: {}
  },
  appConfig: {
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // 调试工具启用开关
      IS_OPEN_VCONSOLE: true
    },
  }
});
```

## 介绍 

WinJS 项目的常用的移动端调试工具集合。目前涵盖了 [vConsole](https://github.com/Tencent/vConsole)、[eruda](https://github.com/liriliri/eruda)、[PageSpy](https://github.com/HuolalaTech/page-spy)。
 

::: warning 注意
为了保证和之前项目开启调试工具的一致性，在启用插件前，需要在项目的配置文件中添加 `IS_OPEN_VCONSOLE` 属性。即在 `window.LOCAL_CONFIG` 挂载 `IS_OPEN_VCONSOLE` 属性，且其值设置为 `true`。
:::

## 配置

### vConsole

```js
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-wconsole')],
  wconsole: {
    vconsole: {
      defaultPlugins: Array(string),
      onReady: Function,
      disableLogScrolling: Boolean,
      theme: String,
      url: String
    },
  }
});

```

键名                  | 类型      | 可选     | 默认值                                       | 描述
--------------------- | -------- | -------- | ------------------------------------------- | -------------------
defaultPlugins        | Array(String) | true     | ['system', 'network', 'element', 'storage'] | 需要自动初始化并加载的内置插件。 
onReady               | Function | true     |                                             | 回调方法，当 vConsole 完成初始化并加载完内置插件后触发。
disableLogScrolling   | Boolean  | true     |                                             | 若为 `false`，有新日志时面板将不会自动滚动到底部。
theme                 | String   | true     | 'light'                                     | 主题颜色，可选值为 'light' | 'dark'。
url                 | String   | true     | 'https://cdnjs.cloudflare.com/ajax/libs/vConsole/3.14.7/vconsole.min.js'                                     | 加载的 vConsole 文件地址。

可以参考[这里](https://github.com/Tencent/vConsole/blob/dev/doc/public_properties_methods_CN.md)
   

### edura  

```js
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-wconsole')],
  wconsole: {
    edura: {
      container: String,
      tool: Array(String),
      autoScale: Boolean,
      useShadowDom: Boolean,
      defaults: Object,
      url: String
    },
  }
});

```
 键名                  | 类型            | 可选     | 默认值                                                               | 描述
--------------------- |---------------| -------- |-------------------------------------------------------------------| -------------------
container        | String        | true     | 用于插件初始化的 Dom 元素，如果不设置，默认创建 div 作为容器直接置于 html 根结点下面。               
tool               | Array(String) | true     |                                                                   | 指定要初始化哪些面板，默认加载所有。
autoScale   | Boolean       | true     | true                                                              | 不同的视窗下自动缩放
useShadowDom                 | Boolean       | true     | true                                                              | 使用 Shadow DOM 实现 CSS 封装
defaults                 | Object        | true     | `{ displaySize: 50, transparency: 0.9, theme: 'Monokai Pro' }`    | 默认设置。
url                 | String        | true     | 'https://cdnjs.cloudflare.com/ajax/libs/eruda/3.0.1/eruda.min.js' | 加载的 edura 文件地址。
 
可以参考[这里](https://github.com/liriliri/eruda/blob/master/doc/API.md)

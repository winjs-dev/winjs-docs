# TypeScript {#typescript}

WinJS 默认开启 TypeScript，如果使用官方脚手架创建项目，内置的文件就是使用 TypeScript。

如果想要使用 JavaScript 进行开发，可以直接将项目中用到的 `.(ts|tsx)` 文件改为 `.(js|jsx)` 文件，并使用 JavaScript 语法进行开发。

## TypeScript 版本要求

自 1.0.0 起，WinJS 官方包的产物类型面按 **TypeScript >= 4.9** 实测声明（建议使用 5.x）。低于 4.9 的项目升级 TypeScript 后即可获得完整类型提示。

::: tip 说明
实测口径为 `skipLibCheck: true`（社区主流配置）。若项目关闭 `skipLibCheck`，部分三方依赖（如 `@rsbuild/core`）自带的类型声明可能产生与 WinJS 无关的报错。
:::

## 配置中的 Typescript 提示

如果想要在配置时也有 TypeScript 的语法提示，可以在配置的地方包一层 `defineConfig`, 这样配置的时候就可以有语法提示了：

```ts
// .winrc.ts
import { defineConfig } from 'win';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
```

## TypeScript Vue

使用 `win lint` 作代码检测工具的时候，在当前项目中的 `.eslintrc.js` 文件中需要添加以下配置：

```js
module.exports = {
  extends: [
    '@winner-fed/eslint-config-win',
    '@winner-fed/eslint-config-win/vue3',
    '@winner-fed/eslint-config-win/typescript',
    './.eslintrc-auto-import.json'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser'
    }
  }
};
```

注意：`@winner-fed/f2elint` 版本需要 `>=2.1.0`。

# 状态管理 {#statemanagement}

::: warning 注意
此插件只适用于 Vue3。Vue2 需要自定义引入，可以参考示例工程如下：
- Vuex，可以参考 [with-vue2-vuex](https://gitlab.hundsun.com/WhaleFE/winner-others/tree/winjs-examples/with-vue2-vuex)。
- Pinia，可以参考 [with-vue2-pinia](https://gitlab.hundsun.com/WhaleFE/winner-others/tree/winjs-examples/with-vue2-pinia)。
:::

## 介绍
集成了 Vue 常用的两种状态管理库 [pinia](https://pinia.vuejs.org/) 和 [vuex](https://vuex.vuejs.org/) 。一键开启状态管理的能力，封装一些胶水代码，可以直接定义 store 使用。*官方推荐使用 pinia*。

约定定义放在 `stores` 或 `src/stores` 目录下，无需额外配置，定义即可用。

```
.
├── package.json
├── plugin.ts
├── public
│   └── loading.js
├── src
│   ├── assets
│   │   └── img
│   │       └── logo.png
│   ├── layouts
│   │   └── index.vue
│   ├── pages
│   │   └── index.vue
│   └── stores    # 使用这里导出的模块
│       └── count.ts
├── tsconfig.json
└── typings.d.ts
```
 
## Pinia Plugin {#pinia}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-pinia?style=flat-square&colorB=646cff)

集成 pinia 插件。遵循 autoImport 的研发模式。

### 启用方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-pinia -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-pinia -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-pinia -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-pinia -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-pinia')],
  /**
   * @name pinia
   * @description 开启 pinia
   * @doc http://172.27.24.2:7788/winjs-document/plugins/statemanagement.html#pinia
   */
  pinia: {}
});
```
 
使用 Demo 示例可以参考：[with-pinia](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/-/tree/dev/examples/with-pinia)

## Vuex Plugin {#vuex}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-vuex?style=flat-square&colorB=646cff)

集成 vuex 插件。
**注意：在使用相关的 api 时需要手动引入 `vuex`**，如

可以通过调用 useStore 函数，来在 setup 钩子函数中访问 store。

```js
import { useStore } from 'vuex';

const store = useStore();
const { commit, dispatch } = store;
```

### 启用方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-vuex -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-vuex -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-vuex -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-vuex -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-vuex')],
  /**
   * @name vuex
   * @description 开启 vuex
   * @doc http://172.27.24.2:7788/winjs-document/plugins/statemanagement.html#vuex
   */
  vuex: {}
});
```

::: tip 说明
插件为了方便开发使用，同时也提供了获取实例化的 store 对象。可以再 app.j[t]s 文件获取该 store。

```js
import { useVuexStore } from 'winjs';

const store = useVuexStore();

console.log('store', store.state);
```
:::

使用 Demo 示例可以参考：[with-vuex](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/-/tree/dev/examples/with-vuex)
    

## 扩展

**autoImport** 的研发模式是基于 unplugin-auto-import 插件实现的，它是一个用于自动导入模块的插件，它的作用是根据你的代码中的引用自动添加相应的导入语句。对于同时引入 Vuex 和 Pinia，由于它们都是用于状态管理的库，可能会存在一些冲突。

Vuex 是 Vue.js 官方提供的状态管理库，而 Pinia 是一个基于 Vue 3 Composition API 的状态管理库。它们在实现上有一些不同，包括 API 和用法。

当你使用 unplugin-auto-import 并同时引入 Vuex 和 Pinia 时，可能会出现以下冲突或问题：

- 命名冲突：Vuex 和 Pinia 都提供了一些相似的概念和函数名，例如 state、getters、mutations 等。如果自动导入时自动生成相同的名称，可能会导致命名冲突。

- API 不兼容：Pinia 的 API 是基于 Vue 3 Composition API 构建的，而 Vuex 则是基于 Vue 2 的选项式 API。它们之间存在一些不同的函数和用法。自动导入可能会引入与当前库不兼容的函数或用法，导致代码错误。

为了避免这些冲突，你可以采取以下措施：

- 手动导入：不使用 unplugin-auto-import，而是手动导入和管理 Vuex 和 Pinia 的引用，确保避免冲突。

- 按需导入：只导入你需要的具体函数或对象，而不是整个库。例如，只导入 Vuex 的 createStore 函数或 Pinia 的 createPinia 函数。

- 使用别名：通过为 Vuex 或 Pinia 的导入语句添加别名，可以避免命名冲突。例如，给其中一个库添加别名，如 import { createStore as createVuexStore } from 'vuex' 或 import { createPinia as createPiniaStore } from 'pinia'。

- 检查冲突：在使用自动导入时，确保检查自动生成的导入语句是否正确，并手动处理任何冲突或错误。

综上所述，尽管可以同时引入 Vuex 和 Pinia，但在使用 unplugin-auto-import 自动导入时可能会存在一些冲突。为了避免问题，建议手动导入或按需导入，并检查和处理可能的冲突。

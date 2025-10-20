# State Management {#statemanagement}

::: warning Note
This plugin is only compatible with Vue 3. Vue 2 requires custom integration.
:::

## Introduction
Integrates two commonly used Vue state management libraries: [pinia](https://pinia.vuejs.org/) and [vuex](https://vuex.vuejs.org/). Enable state management capabilities with one click, wrapping boilerplate code so you can directly define and use stores. *Official recommendation is to use Pinia*.

By convention, definitions are placed in the `stores` or `src/stores` directory. No additional configuration needed - define and use.

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

Integrates the Pinia plugin. Follows the autoImport development pattern.

### Setup

1. Install the plugin

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

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-pinia')],
  /**
   * @name pinia
   * @description Enable pinia
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/statemanagement.html#pinia
   */
  pinia: {}
});
```

## Vuex Plugin {#vuex}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-vuex?style=flat-square&colorB=646cff)

Integrates the Vuex plugin.
**Note: You need to manually import `vuex` when using related APIs**, for example:

You can access the store in setup hooks by calling the useStore function.

```js
import { useStore } from 'vuex';

const store = useStore();
const { commit, dispatch } = store;
```

### Setup

1. Install the plugin

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

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-vuex')],
  /**
   * @name vuex
   * @description Enable vuex
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/statemanagement.html#vuex
   */
  vuex: {}
});
```

::: tip Note
For development convenience, the plugin also provides access to the instantiated store object. You can get this store in the app.j[t]s file.

```js
import { useVuexStore } from 'winjs';

const store = useVuexStore();

console.log('store', store.state);
```
:::

## Extensions

The **autoImport** development pattern is implemented based on the unplugin-auto-import plugin, which is a plugin for automatically importing modules. Its purpose is to automatically add corresponding import statements based on references in your code. When importing both Vuex and Pinia simultaneously, conflicts may arise since both are state management libraries.

Vuex is the official state management library provided by Vue.js, while Pinia is a state management library based on Vue 3 Composition API. They have some implementation differences, including APIs and usage patterns.

When using unplugin-auto-import and importing both Vuex and Pinia simultaneously, the following conflicts or issues may occur:

- Naming conflicts: Both Vuex and Pinia provide similar concepts and function names, such as state, getters, mutations, etc. Auto-import may generate identical names, potentially causing naming conflicts.

- API incompatibility: Pinia's API is built on Vue 3 Composition API, while Vuex is based on Vue 2's Options API. There are different functions and usage patterns between them. Auto-import might introduce functions or usage incompatible with the current library, leading to code errors.

To avoid these conflicts, you can take the following measures:

- Manual imports: Don't use unplugin-auto-import, but manually import and manage Vuex and Pinia references to ensure conflicts are avoided.

- On-demand imports: Only import the specific functions or objects you need, rather than the entire library. For example, only import Vuex's createStore function or Pinia's createPinia function.

- Use aliases: Add aliases to Vuex or Pinia import statements to avoid naming conflicts. For example, add aliases to one of the libraries, such as import { createStore as createVuexStore } from 'vuex' or import { createPinia as createPiniaStore } from 'pinia'.

- Check for conflicts: When using auto-import, ensure you check that auto-generated import statements are correct and manually handle any conflicts or errors.

In summary, while it's possible to import both Vuex and Pinia simultaneously, there may be conflicts when using unplugin-auto-import for automatic imports. To avoid issues, it's recommended to use manual imports or on-demand imports, and check and handle potential conflicts.

# UI Component Libraries

To help developers quickly integrate common UI component libraries and eliminate tedious configurations, we've developed accompanying plugin functionality that supports UI components such as `vant`, `element-plus`, `element-ui`, `ant-design-vue`, `winUI`, and more.

## Vant

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-vant?style=flat-square&colorB=646cff)

Compatible with Vue 2 and Vue 3                                                                 

### Setup
 
1. Installation

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-vant -D
# Vue3
$ npm add vant
# Vue2
$ npm add vant@2.x
```

```bash [YARN]
$ yarn add @winner-fed/plugin-vant -D
# Vue3
$ yarn add vant
# Vue2
$ yarn add vant@2.x
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-vant -D
# Vue3
$ pnpm add vant
# Vue2
$ pnpm add vant@2.x
```

```bash [BUN]
$ bun add @winner-fed/plugin-vant -D
# Vue3
$ bun add vant
# Vue2
$ bun add vant@2.x
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-vant'],
  /**
   * @name vant plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/uiframework.html#vant
   */
  vant: {
    // No need to configure this property when using `Vant4.x`
    legacyFunction: ['Toast']
  }
});
```

::: warning Note

The `legacyFunction` property is designed to handle individual components in `Vant2.x` that are provided as functions, including `Toast`, `Dialog`, `Notify`, and `ImagePreview` components. When using function components, `unplugin-vue-components` cannot automatically import corresponding styles, so special handling is implemented (these special components will be globally imported in the generated plugin-vant/runtime.tsx, which has several benefits. Using Dialog as an example: 1) Prevents style issues, such as occasional animation anomalies when dialog pops up 2) Allows using this.$dialog in Vue files 3) Allows direct use of Dialog.alert(...) in JS files). The default value is []. The array only recognizes `Toast`, `Dialog`, `Notify`, `ImagePreview`.

After configuring in the .winrc configuration file, you no longer need to import components and styles when using components in business code. For example:

```diff
// 1. Need to remove this explicit import
- import { Dialog } from 'vant';

// 2. Use in JS files (cannot be used directly in app.js) or in script tags of Vue files
Dialog.confirm({
  title: 'Title',
  message: 'Dialog content',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

Tip: You should not use "full import" and "on-demand import" simultaneously in a single project, as this will cause code duplication and style conflicts.
:::
 
## Antdv

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-antdv?style=flat-square&colorB=646cff)

Compatible with Vue 2 and Vue 3

### Setup

1. Installation

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-antdv -D
# Vue 3
$ npm add ant-design-vue
# Vue 2
$ npm add ant-design-vue@1.x
```

```bash [YARN]
$ yarn add @winner-fed/plugin-antdv -D
# Vue 3
$ yarn add ant-design-vue
# Vue 2
$ yarn add ant-design-vue@1.x
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-antdv -D
# Vue 3
$ pnpm add ant-design-vue
# Vue 2
$ pnpm add ant-design-vue@1.x
```

```bash [BUN]
$ bun add @winner-fed/plugin-antdv -D
# Vue 3
$ bun add ant-design-vue
# Vue 2
$ bun add ant-design-vue@1.x
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-antdv'],
  /**
   * @name ant-design-vue plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/uiframework.html#antdv
   */
  antdv: {}
});
```

## ElementUI

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-element-ui?style=flat-square&colorB=646cff)

Compatible with Vue 2

### Setup

1. Installation

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-element-ui -D
$ npm add element-ui
```

```bash [YARN]
$ yarn add @winner-fed/plugin-element-ui -D
$ yarn add element-ui
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-element-ui -D
$ pnpm add element-ui
```

```bash [BUN]
$ bun add @winner-fed/plugin-element-ui -D
$ bun add element-ui
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-element-ui')],
  /**
   * @name element-ui plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/uiframework.html#elementui
   */
  elementUI: {}
});
```

## ElementPlus

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-element-plus?style=flat-square&colorB=646cff)

Compatible with Vue 3

### Setup

1. Installation

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-element-plus -D
$ npm add element-plus 
```

```bash [YARN]
$ yarn add @winner-fed/plugin-element-plus -D
$ yarn add element-plus 
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-element-plus -D
$ pnpm add element-plus
```

```bash [BUN]
$ bun add @winner-fed/plugin-element-plus -D
$ bun add element-plus 
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-element-plus'],
  /**
   * @name element-plus plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/uiframework.html#elementplus
   */
  elementPlus: {}
});
```

::: warning Note

When using component APIs in element-plus, such as ElMessage, ElMessageBox, ElNotification, ElLoading, you must manually import the corresponding component styles, for example:

```js
// Manually import these styles
import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';
```
:::

## WinUI

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-winui?style=flat-square&colorB=646cff)

Compatible with Vue 2 and Vue 3

### Setup

1. Installation

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-winui -D
# vue3
$ npm add @winner-fed/win-ui
# vue2
$ npm add @winner-fed/win-ui@1.x
```

```bash [YARN]
$ yarn add @winner-fed/plugin-winui -D
# vue3
$ yarn add @winner-fed/win-ui
# vue2
$ yarn add @winner-fed/win-ui@1.x
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-winui -D
# vue3
$ pnpm add @winner-fed/win-ui
# vue2
$ pnpm @winner-fed/win-ui@1.x
```

```bash [BUN]
$ bun add @winner-fed/plugin-winui -D
# vue3
$ bun add @winner-fed/win-ui
# vue2
$ bun add @winner-fed/win-ui@1.x
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-winui'],
  /**
   * @name winUI plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/uiframework.html#winui
   */
  winUI: {
    // No need to configure this property when using `WinUI 3.x`
    legacyFunction: ['Toast']
  }
});
```

::: warning Note

The `legacyFunction` property is designed to handle individual components in `WinUI1.x` that are provided as functions, including `Toast`, `Dialog`, `Notify`, and `ImagePreview` components. When using function components, `unplugin-vue-components` cannot automatically import corresponding styles, so special handling is implemented. The default value is []. The array only recognizes `Toast`, `Dialog`, `Notify`, `ImagePreview`.

After configuring in the .winrc configuration file, you no longer need to import components and styles when using components in business code. For example:

```diff
// 1. Need to remove this explicit import
- import { Dialog } from '@winner-fed/win-ui';

// 2. Use in JS files (cannot be used directly in app.js) or in script tags of Vue files
Dialog.confirm({
  title: 'Title',
  message: 'Dialog content',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

Tip: You should not use "full import" and "on-demand import" simultaneously in a single project, as this will cause code duplication and style conflicts.
:::  

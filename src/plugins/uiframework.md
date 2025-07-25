# UI 组件库

为了方便开发者快速集成常用的 UI 组件库，省略一些繁琐的配置，开发了配套的插件功能，支持的 UI 组件如 `vant`、`element-plus`、`element-ui`、`ant-design-vue`、`winUI` 等。

使用示例可以参考：[winjs-plugins/examples]( https://gitlab.hundsun.com/WhaleFE/winjs-plugins/examples)

## Vant

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-vant?style=flat-square&colorB=646cff)

适用于 Vue2 和 Vue3                                                                 

### 开启方式
 
1. 安装

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-vant'],
  /**
   * @name vant 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/uiframework.html#vant
   */
  vant: {
    // 使用 `Vant4.x` 无须配置该属性
    legacyFunction: ['Toast']
  }
});
```

::: warning 注意

`legacyFunction`属性是为了处理 `Vant2.x` 有个别组件是以函数的形式提供的，包括 `Toast`，`Dialog`，`Notify` 和 `ImagePreview` 组件。在使用函数组件时，`unplugin-vue-components` 无法自动引入对应的样式，因此做了特殊处理（这几个特殊组件会再生成的 plugin-vant/runtime.tsx 里进行全局引入，有几个好处，以 Dialog 为例说明，1）防止样式出现问题，如 dialog 弹出时动画效果偶现异常 2）在 vue 文件中，可以使用 this.$dialog 3）在js文件中直接使用 Dialog.alert(...)）。默认值是 []。数组里的值只识别 `Toast`,`Dialog`,`Notify`,`ImagePreview`。

在配置文件 .winrc 里配置后，这样在业务代码中使用组件时，便不再需要引入组件和样式了。如

```diff
// 1. 需要移除这段显示引用
- import { Dialog } from 'vant';

// 2. 在 js 文件（不能直接在 app.js 里使用）或 vue 文件的 script 标签里使用
Dialog.confirm({
  title: '标题',
  message: '弹窗内容',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

提示：在单个项目中不应该同时使用「全量引入」和「按需引入」，否则会导致代码重复、样式错乱等问题。
:::
 
## Antdv

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-antdv?style=flat-square&colorB=646cff)

适用于 Vue2 和 Vue3

### 开启方式

1. 安装

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-antdv'],
  /**
   * @name ant-design-vue 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/uiframework.html#antdv
   */
  antdv: {}
});
```

## ElementUI

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-element-ui?style=flat-square&colorB=646cff)

适用于 Vue2

### 开启方式

1. 安装

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-element-ui')],
  /**
   * @name element-ui 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/uiframework.html#elementui
   */
  elementUI: {}
});
```

## ElementPlus

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-element-plus?style=flat-square&colorB=646cff)

适用于 Vue3

### 开启方式

1. 安装

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-element-plus'],
  /**
   * @name element-plus 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/uiframework.html#elementplus
   */
  elementPlus: {}
});
```

::: warning 注意

使用 element-plus 里的组件 API 时，比如 ElMessage, ElMessageBox, ElNotification, ElLoading，一定要手动引入组件对应的样式，如：

```js
// 需手动引入该样式
import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';
```
:::

## WinUI

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-winui?style=flat-square&colorB=646cff)

适用于 Vue2 与 Vue3

### 开启方式

1. 安装

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-winui'],
  /**
   * @name winUI 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/uiframework.html#winui
   */
  winUI: {
    // 使用 `WinUI 3.x` 无须配置该属性
    legacyFunction: ['Toast']
  }
});
```

::: warning 注意

`legacyFunction`属性是为了处理 `WinUI1.x` 有个别组件是以函数的形式提供的，包括 `Toast`，`Dialog`，`Notify` 和 `ImagePreview` 组件。在使用函数组件时，`unplugin-vue-components` 无法自动引入对应的样式，因此做了特殊处理。默认值是 []。数组里的值只识别 `Toast`,`Dialog`,`Notify`,`ImagePreview`。

在配置文件 .winrc 里配置后，这样在业务代码中使用组件时，便不再需要引入组件和样式了。如

```diff
// 1. 需要移除这段显示引用
- import { Dialog } from '@winner-fed/win-ui';

// 2. 在 js 文件（不能直接在 app.js 里使用）或 vue 文件的 script 标签里使用
Dialog.confirm({
  title: '标题',
  message: '弹窗内容',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

提示：在单个项目中不应该同时使用「全量引入」和「按需引入」，否则会导致代码重复、样式错乱等问题。
:::  

## HUI

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-hui?style=flat-square&colorB=646cff)

适用于 Vue2

### 开启方式

1. 安装

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-hui -D
$ npm add h_ui
```

```bash [YARN]
$ yarn add @winner-fed/plugin-hui -D
$ yarn add h_ui
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-hui -D
$ pnpm add h_ui
```

```bash [BUN]
$ bun add @winner-fed/plugin-hui -D
$ bun add h_ui
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-hui'],
  /**
   * @name HUI 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/uiframework.html#hui
   */
  hui: {
    // 配置需要通过 Vue.use 安装的函数组件
    legacyFunction: ['Message', 'Notice', 'LoadingBar', 'Spin', 'MsgBox', 'MsgBoxSafe', 'MessageSafe']
  }
});
```

3. 函数组件插件安装

配置 `legacyFunction` 后，插件会自动生成运行时代码，使用 Vue.use 方式安装这些函数组件：

```javascript
// 自动生成的运行时代码
import Vue from 'vue';
import 'h_ui/dist/lib/theme-chalk/common/index.css';
import Message from 'h_ui/dist/lib/Message';
import Notice from 'h_ui/dist/lib/Notice';
import LoadingBar from 'h_ui/dist/lib/LoadingBar';
// ... 其他函数组件

// 自动导入对应的样式文件
import 'h_ui/dist/lib/theme-chalk/message.css';
import 'h_ui/dist/lib/theme-chalk/notice.css';
import 'h_ui/dist/lib/theme-chalk/loadingbar.css';
// ... 其他样式文件

// 使用 Vue.use 方式安装函数组件
Vue.use(Message);
Vue.use(Notice);
Vue.use(LoadingBar);
// ... 其他安装
```

然后在组件中可以直接使用（根据 h_ui 组件的具体 API）：

```vue
<script>
export default {
  methods: {
    showMessage() {
      this.$hMessage('这是一条消息');
    },
    showNotice() {
      this.$hNotice({
        title: '通知',
        content: '这是一条通知'
      });
    }
  }
}
</script>
```

::: warning 注意
该插件的实现底层依赖于 `unplugin-vue-components`。而 `unplugin-vue-components` 插件主要是通过静态分析Vue文件中的模板语法来自动引入组件的。这意味着，如果组件是在运行时动态生成的，比如在渲染函数(render函数)中通过条件判断或循环动态创建的组件，该插件可能无法识别这些动态组件并自动导入它们，因为这些信息在静态分析阶段是不可见的。因此，请确保在 render 函数中使用静态的组件引入方式，例如直接导入组件并在 render 函数中使用。
```js
// 需要手动引入该组件
import Button from 'h_ui/dist/lib/Button';

export default {
  data() {
    return {
      columns: [
        {
          title: '操作',
          key: 'operation',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h(Button, {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation();
                  }
                }
              }, '编辑'),
              h(Button, {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation();
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    };
  }
};

```
:::

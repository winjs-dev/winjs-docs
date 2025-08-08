---
outline: deep
---

# Directory Structure {#directory-structure}

This lists the conventional (or recommended) directory structure in WinJS projects. Please organize your code according to this directory structure during project development.

:::tip Tip
One of the design principles of the WinJS framework is [Convention over Configuration](https://en.wikipedia.org/wiki/Convention_over_configuration). In most cases, you can write code directly according to conventions without any configuration.
:::

```bash
.
├── config
│   └── config.ts
├── dist
├── mock
│   └── app.ts｜tsx
├── public
├── src
│   ├── .win
│   ├── .win-production
│   ├── layouts
│   │   ├── BasicLayout.vue
│   │   ├── index.less
│   ├── models
│   │   ├── global.ts
│   │   └── index.ts
│   ├── pages
│   │   ├── index.less
│   │   └── index.vue
│   ├── utils // Recommended directory
│   │   └── index.ts
│   ├── services // Recommended directory
│   │   └── api.ts
│   ├── app.(ts|tsx)
│   ├── constant.(ts|js)
│   ├── global.ts
│   ├── global.(css|less|sass|scss)
│   ├── overrides.(css|less|sass|scss)
│   └── favicon.(ico|gif|png|jpg|jpeg|svg|avif|webp)
├── node_modules
│   └── .cache
│       ├── bundler-webpack
│       ├── mfsu
│       └── mfsu-deps
├── .env
├── .editorconfig // Editor coding style configuration
├── .eslintignore // ESLint validation ignore file
├── .eslintrc.js // ESLint validation configuration
├── .gitignore // Git ignore file
├── .npmrc // NPM source address configuration
├── .markdownlint.json // Markdown lint tool
├── .markdownlintignore // Markdown lint ignore file
├── .prettierignore // Prettier code formatting ignore file
├── .prettierrc.js // Prettier code formatting configuration
├── .stylelintrc.js // Stylelint CSS code standards configuration
├── .stylelintignore // Stylelint CSS ignore file
├── commitlint.config.js // Git commit standards configuration
├── f2elint.config.js // F2ELint configuration file
├── plugin.ts 
├── .winrc.ts // Choose one between this and config/config file
├── package.json
├── tsconfig.json
└── typings.d.ts
```
## Root Directory

### package.json

WinJS does not automatically register plugins and presets starting with `@winner-fed/preset-`, `@winner-fed/plugin-`, `win-preset-`, and `win-plugin-` in `package.json`. If you need to customize additional plugins and presets, you need to manually configure them in [`plugins`](../config/config#plugins).

### .env

Environment variables, for example:

```text
PORT=8888
COMPRESS=none
```

### .winrc.ts

> Has the same functionality as the `config/config.ts` file, choose one. The `.winrc.ts` file has higher priority.

Configuration file containing all [non-runtime configurations](../config/config) for WinJS (runtime configurations are generally defined in [`app.ts`](#apptstsx)).

If you need to load different configurations in different environments, this is implemented in WinJS based on [`WIN_ENV`](./env-variables#win-env) or [`WIN_APP_ENV`](./env-variables#win-app-env). An example of starting in different environments:

```json
// package.json
{
  "scripts": {
    "dev": "win dev",
    "dev:pre": "cross-env WIN_ENV=pre win dev"
  }
}
```

### config/config.ts

> 与 `.winrc.ts` 文件功能相同，2 选 1 。`.winrc.ts` 文件优先级较高

与 [`.winrc.ts`](#winrcts) 相同，区别是你可以单独在一个 `config` 文件夹下集中管理所有的配置，保持项目根目录整洁。

### dist 目录

执行 `win build` 后产物的默认输出文件夹。可通过 [`outputPath`](../config/config#outputpath) 配置修改产物输出文件夹。

### mock 目录

存放 mock 文件，此目录下所有 `.ts` / `.js` 文件会被 mock 服务加载，从而提供模拟数据，使用方法详见 [Mock](mock) 。

### node_modules/.cache

WinJS 在构建时生成的缓存文件目录，存放 `babel` 缓存，`MFSU` 缓存等

::: tip 提示

如果 `MFSU` 构建异常，可以删除 `.cache` 目录，它将会在再次构建的时候重新生成。
也可以直接执行 `win cache clean` 进行清除。

:::

### public 目录

`public/` 目录作为框架默认的静态资源目录，除了存放页面模版 `index.html` 文件之外，不被工程构建工具进行编译的资源都可以放在该目录下。 

比如 `favicon.ico` 文件，我们并不希望该文件名编译（默认静态资源文件名在编译后会生成独立 hash，`favicon.ico` 希望保持原有文件名），在使用时直接在 html 模版中进行引用：

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="icon" href="/favicon.ico" />
  </head>
</html>
```

另外像不被源码引入的资源也存放在 `public` 目录下，比如设置 externals 后的 umd 链接，在不使用 CDN 的情况下，同样可以直接放在 `public` 目录下。

`public` 目录中的资源在开发时能直接通过 / 根路径访问到，并且打包时会被完整复制到目标目录的根目录下。

::: warning 注意
- 请避免在源代码中通过 import 来引用 public 目录下的文件，正确的方式是通过 URL 引用。
- 通过 URL 引用 public 目录中的资源时，请使用绝对路径，而不是相对路径。
- 在生产环境构建过程中，public 目录中的文件将会被拷贝到构建产物目录（默认为 dist）下，请注意不要和产物文件出现名称冲突。在构建器「Rsbuild」下， 当 public 下的文件和产物重名时，构建产物具有更高的优先级，会覆盖 public 下的同名文件。这个功能可以通过将 server.publicDir.copyOnBuild 设置为 false 来禁用。
:::

### src 目录

#### .win 目录

::: warning 警告
**不要提交 `.win` 临时文件到 git 仓库，默认已在 `.gitignore` 被忽略。**
:::

dev 时的临时文件目录，比如入口文件、路由等，都会被临时生成到这里。

#### .win-production 目录

::: warning 警告
**不要提交 `.win-production` 临时文件到 git 仓库，默认已在 `.gitignore` 被忽略。**
:::

build 时的临时文件目录，是整个 WinJS 项目的发动机。临时目录和文件是 WinJS 中非常重要的一部分，框架或插件会根据你的代码生成临时文件，比如入口文件、路由等。因为它的临时性，每次启动 WinJS 时都会被删除并重新生成。

#### app.[ts｜tsx]

[运行时配置](../config/runtime-config) 文件，可以在这里扩展运行时的能力，比如修改路由、修改 render 方法等。

运行时配置带来的逻辑会在浏览器中运行，因此当有远程配置、动态内容时，这些我们在本地开发时还不确定，不能写死，所以需要在浏览器实际运行项目时动态获取他们。

#### constant.(js|ts)
定义常量（大驼峰，单词之间以下划线连接）。编写业务程序时，会有一些所需要的常量值，比如订单状态，1,2,3...。一般情况下，这些值都是固定不变的。如果直接将这些值硬编码到代码里，就可以理解成“魔法值”。魔法值的存在，从语法上来说是合理的，但是从业务上却让人无法理解其中 0，1，2，3 的含义。对于这些魔法值，我们往往需要通过上下文推断出来逻辑，如果是非常复杂的业务或者 10 年前的代码那就更惨了，搞不好连文档注释也没有。为了可读性，所以我们要尽量避免出现魔法值。
举个例子，如下

```vue
<!-- 服务期限 -->
<div class="card-subscription viability-info">
  <div class="header">
    <span>服务期限</span>
  </div>
  <div class="content">
    <div v-if="+combinePrice.farePerMonth !== 999999999"
         class="viability-box"
         :class="{active: viability === '1' }"
         @click="viability = '1'">
      <p>1个月</p>
      <p class="price"><b>￥</b>{{combinePrice.farePerMonth}}</p>
    </div>
    <div v-if="+combinePrice.farePerQuarter !== 999999999"
         class="viability-box"
         :class="{active: viability === '3' }"
         @click="viability = '3'">
      <p>3个月</p>
      <p class="price"><b>￥</b>{{combinePrice.farePerQuarter}}</p>
    </div>
    <div v-if="+combinePrice.farePerHalfyear !== 999999999"
         class="viability-box"
         :class="{active: viability === '6' }"
         @click="viability = '6'">
      <p>6个月</p>
      <p class="price"><b>￥</b>{{combinePrice.farePerHalfyear}}</p>
    </div>
</div>
```

`999999999` 是什么玩意。。。
```javascript
// constant.js
...
// 中台与前端做的协定
// 特殊 999999999 价格，不做界面展示
const SPECIAL_PRICE = 999999999;

export {
  ...
  SPECIAL_PRICE
};
```

#### layouts/index.vue

全局布局，默认会在所有路由下生效，比如有以下路由关系：

```
[
  { path: '/', component: '@/pages/index' },
  { path: '/users', component: '@/pages/users' },
]
```

输出为：

```jsx
<Layout>
  <Page>index</Page>
  <Page>users</Page>
</Layout>
```

当你需要关闭 layout 时可以使用 `layout: false` ，当你需要更多层 layout 时，可以考虑使用 [`wrappers`](./routes#wrappers) ，仅在配置式路由可用：

```ts
  routes: [
    { path: '/', component: './index', layout: false },
    { 
      path: '/users', 
      component: './users', 
      wrappers: ['@/wrappers/auth']
    }
  ]
```

#### pages 目录

约定式路由默认以 `pages/*` 文件夹的文件层级结构来生成路由表。

在配置式路由中，`component` 若写为相对路径，将从该文件夹为起点开始寻找文件：

```ts
  routes: [
    // `./index` === `@/pages/index`
    { path: '/', component: './index' }
  ]
```

##### 基础路由

假设 `pages` 目录结构如下：

```
+ pages/
  + users/
    - index.tsx
  - index.tsx
```

那么，会自动生成路由配置如下：

```ts
[
  { path: '/', component: '@/pages/index.tsx' },
  { path: '/users/', component: '@/pages/users/index.tsx' },
]
```

##### 动态路由

约定带 `$` 前缀的目录或文件为动态路由。若 `$` 后不指定参数名，则代表 `*` 通配，比如以下目录结构：

```
+ pages/
  + foo/
    - $slug.tsx
  + $bar/
    - $.tsx
  - index.tsx
```

会生成路由配置如下：

```ts
[
  { path: '/', component: '@/pages/index.tsx' },
  { path: '/foo/:slug', component: '@/pages/foo/$slug.tsx' },
  { path: '/:bar/*', component: '@/pages/$bar/$.tsx' },
]
```

##### pages/404.tsx

在使用约定式路由时，该文件会自动被注册为全局 404 的 fallback 页面。若你使用配置式路由，需要自行配置兜底路由到路由表最后一个：

```ts
  routes: [
    // other routes ...
    { path: '/*', component: '@/pages/404.tsx' }
  ]
```

#### services 目录

网络请求库的封装。对 HTTP 协议接口做的封装。

- autoMatchBaseUrl.js - 项目中若存在多个服务端接口的对接，则需要在 config.local.js 里定义多个接口请求路径，此文件就是针对配置不同的 prefix，做自动适配的。可参考下面一段示例： _autoMatchBaseUrl 与 config.local.js 配合使用_
- request.js - 针对 axios 的封装，主要函数是 URL, URL, formData)
- RESTFULURL.js - 所有服务端接口的映射表，对应的 value 值不建议添加接口具体的 path，可参考下面一段示例： _RESTFULURL.js_ 示例， 如标准的 URL `http://xx.com/v1/func_get_user_info`
  - HTTP 协议路径 [http://xx.com/](http://xx.com/)
  - path 路径：v1/
  - 接口名：`[func_get_user_info](http://xx.com/v1/func_get_user_info)`
  - 因为有时候开发环境和生产环境接口对应 path 会有修改，所以在配置 API_HOME 的时候，尽量是 HTTP 协议路径 + path 路径。

```javascript
// autoMatchBaseUrl与config.local.js配合使用
// config.local.js
window.LOCAL_CONFIG = {
  API_HOME: 'http://api.github.com/',
  CLINET_API_HOME: 'http://client.github.com/',
  MALL_API_HOME: 'http://mall.github.com/'
};

// constant.js
const QUOTE_PREFIX = 'v1/';
const CLIENT_PREFIX = 'client/';
const MALL_PREFIX = 'shop/';
export { QUOTE_PREFIX, CLIENT_PREFIX, MALL_PREFIX };

// autoMatchBaseUrl.js
export default function autoMatchBaseUrl(prefix) {
  const options = {};
  switch (prefix) {
    case QUOTE_PREFIX:
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      options.baseUrl = window.LOCAL_CONFIG.QUOTE_HOME + QUOTE_PREFIX;
      break;
    case CLIENT_PREFIX:
      options.data = {
        user_token: store.getters.clientToken
      };
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      options.baseUrl = window.LOCAL_CONFIG.IFS_API_HOME + CLIENT_PREFIX;
      break;
    case MALL_PREFIX:
      options.data = {
        fansToken: encrypt.encrypt(store.getters.userInfo.fundAccount)
      };
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      options.baseUrl = window.LOCAL_CONFIG.MALL_API_HOME + MALL_PREFIX;
      break;
    default:
      // 默认
      options.data = {
        user_token: store.getters.apiToken
      };
      options.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      };
      options.baseUrl = window.LOCAL_CONFIG.API_HOME + HOME_PREFIX;
  }

  return options;
}
```

```javascript
// RESTFULURL.js
export default {
  ...
  getUserInfo: 'func_get_user_info'
  ...
}
``` 

> HTTP，HTTPS 或自定义协议组成部分,可以参考如下：

![schema](/images/guide/schema.png)

#### global.(j|t)sx?

全局前置脚本文件。

WinJS 区别于其他前端框架，没有显式的程序主入口（如 `src/index.ts`），所以当你有需要在应用前置、全局运行的逻辑时，优先考虑写入 `global.ts` 。

当你需要添加全局 Context 、修改应用运行时，请使用 [`app.tsx`](#apptstsx) 。

#### global.(css|less|sass|scss)

全局样式文件。

当你有需要全局使用的样式时，请考虑加入此文件。

::: tip 提示
需要注意的是，此文件的优先级在第三方组件库的样式之后，所以当你有覆盖第三方库样式的需求时，请使用 [`overrides.css`](#overridescsslesssassscss) 。
:::

#### overrides.(css|less|sass|scss)

高优先级全局样式文件。

该文件一般专用于覆盖第三方库样式，其中所有 CSS 选择器都会附加 `body` 前缀以抬高优先级。

### plugin.ts 

项目级 WinJS 插件。

当你有 WinJS 定制需求时，往往会用到 [插件 API](../api/plugin-api) （比如 [修改产物 html](../api/plugin-api#modifyhtml)），此时可创建该文件进行自定义：

```ts
import type { IApi } from 'win';

export default (api: IApi) => {
  api.onDevCompileDone((opts) => {
    opts;
    // console.log('> onDevCompileDone', opts.isFirstCompile);
  });
  api.modifyHTML(($) => {
    $;
  });
  api.chainWebpack((memo) => {
    memo;
  });
};

```

### favicon

站点 `favicon` 图标文件。

当存在 `src/favicon.(ico|gif|png|jpg|jpeg|svg|avif|webp)` 文件时，将会自动在产物中添加站点 `favicon` ：

```html
<link rel="shortcut icon" href="/favicon.png">
```

若使用外部资源等，可以使用 [favicons](../config/config#favicons) 手动配置站点图标，配置值优先于约定。

### .editorconfig
该文件是一套用于统一代码格式的解决方案，可以帮助开发者在不同的编辑器和 IDE 之间定义和维护一致的代码风格。常见的 IDE 如 WebStorm 都可以配置。可以参考 [editorconfig](https://editorconfig.org/)


### prettier.config.js[.prettierrc.js]
prettier 配置文件，用于代码格式化，如 .vue，.js，.ts，.css，.less 等文件

```javascript
module.exports = {
  ...require('@winner-fed/prettier-config-win'),
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-packagejson']
}

```

检测命令：
```bash
prettier --write \"src/**/*.{js,jsx,json,ts,tsx,css,less,scss,vue,html,md}\"
```

### stylelint.config.js
样式编码规范的配置文件，用于检测 .less，.css 等样式文件
```javascript
module.exports = {
  extends: '@winner-fed/stylelint-config-win'
};
```

### .eslintrc.js
JavaScript 编码规范，用于检测 .vue，.js，.ts 等文件
```javascript
module.exports = {
  extends: ['@winner-fed/win', '@winner-fed/win/vue']
};
```

### f2elint.config.js
[F2ELint](./f2elint) 是《前端规约》的配套 Lint 工具，可用于为项目一键接入规约、一键扫描和修复规约问题，保障项目的编码规范和代码质量。

```javascript
 module.exports = {
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true
};
```

### .markdownlint.json
配套的 markdownlint 可共享配置。可参考 [@winner-fed/markdownlint-config-win](https://www.npmjs.com/package/@winner-fed/markdownlint-config-win)

```json
 {
  "extends": "@winner-fed/markdownlint-config-win"
}
```

### commitlint.config.js
commitlint 配置文件，用于对 git commit message 进行校验。继承 [@winner-fed/commitlint-config-win](https://www.npmjs.com/package/@winner-fed/commitlint-config-win)

```javascript
 module.exports = {
  extends: ['@winner-fed/commitlint-config-win']
};
```

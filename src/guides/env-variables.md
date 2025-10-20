---
outline: deep
---

# Environment Variables {#env-variables}

WinJS can complete some special configurations and functions through environment variables, and can also implement the function of passing parameters to build or runtime.

## How to Set Environment Variables

### Set When Executing Commands

For example, to change the port of the `win dev` development server, you can use the following command.

```bash
# OS X, Linux
$ PORT=3000 win dev

# Windows (cmd.exe)
$ set PORT=3000&&win dev
```

If you need to use environment variables on different operating systems simultaneously, it's recommended to use the tool [cross-env](https://github.com/kentcdodds/cross-env)

```bash
$ pnpm install cross-env -D
$ cross-env PORT=3000 win dev
```
You can also modify the startup commands in `package.json` to add corresponding environment variables.

Example code is as follows:

```json
{
/** Omitted configuration items */
  "scripts": {
    /** Omitted configuration items */
    // Add WIN_ENV environment variable in dev command
    "dev": "cross-env WIN_ENV=dev win dev",
    "dev:test": "cross-env WIN_ENV=test MOCK=none win dev"
    /** Omitted configuration items */
  }
/** Omitted configuration items */
}
```

### Set in .env File

If your environment variables need to be shared among developers, it's recommended to set them in the `.env` file in the project root directory, for example:

```text
# file .env
PORT=3000
BABEL_CACHE=none
```

Then execute:

```bash
$ win dev
```

WinJS will start the dev server on port 3000 and disable babel caching.

如果你有部分环境变量的配置在本地要做特殊配置，可以配置在 `.env.local` 文件中去覆盖 `.env` 的配置。比如在之前的 `.env` 的基础上, 你想本地开发覆盖之前 3000 端口, 而使用 4000 端口，可以做如下定义。

```text
# file .env.local
PORT=4000
```

WinJS 会以 4000 端口启动 dev server，同时保持禁用 babel 的缓存。

此外 WinJS 中的 `.env` 文件中还支持变量的方式来配置环境变量。例如：

```
# file .env.local
FOO=foo
BAR=bar

CONCAT=$FOO$BAR # CONCAT=foobar
```

WinJS 不支持 .env.development / .env.production 的环境变量配置文件，如需在不同的环境下有不同的变量值，请使用 cross-env 在不同的启动命令上区分，或定义在各个 WIN_ENV 对应的 WinJS 配置文件内。 

注意：

* 不建议将 `.env.local` 加入版本管理中。
 
::: tip 说明

定义在 `.env` 文件中的变量，只能在 node 环境中使用，比如在 `.winrc.ts` 中，在项目中是用不了的。
 
:::

### 在浏览器中使用环境变量

所有通过 `.env` 环境变量文件 或 命令行注入 的环境变量均默认只在 WinJS 配置文件 (Node.js 环境) 内生效，在浏览器中无法直接通过 `process.env.VAR_NAME` 方式使用，通过进一步配置 [`define`](../config/config.md#define) 来注入到浏览器环境中：

```bash
# .env
MY_TOKEN="xxxxx"
```

<br />

```ts
// .winrc.ts
define: { 'process.env.MY_TOKEN': process.env.MY_TOKEN }
```

注：我们约定所有以 `WIN_APP_` 开头的环境变量会默认注入到浏览器中，无需配置 `define` 手动注入。

::: tip 说明
`WIN_APP_` 开头的变量会被自动加载到你的项目（client）里，其他的变量需要通过 define 声明才能注入到你的项目（client）里。请避免在 `WIN_APP` 开头的变量中包含敏感信息。

`WIN_APP_` 开头的变量替换 client 代码中的标识符的范围包含：
- JavaScript 文件，以及能转换为 JavaScript 代码的文件，比如 `.js`，`.jsx`，`.ts`，`.tsx`，`.vue` 等。

注意，但不会替换以下文件中的标识符：

- CSS 文件，比如 `.css`, `.scss`, `.less` 等。
  :::

## 使用环境变量
在 WinJS 中，环境变量的使用场景分构建时与运行时两种类型。

特别注意：环境变量在使用时的类型都是 `string`，特别是设置为 `true` 或 `false` 时需要注意判断为字符串类型：

```js
// WIN_DISABLE_FOO=false
if (process.env.WIN_DISABLE_FOO === 'false') {
  // ...
}
```

### 构建时

默认情况下，所有设置的环境变量都会被注入到构建环境，你可以在 `winrc` 文件或其它构建插件中通过 `process.env` 变量访问。

```js
const port = process.env.PORT;
// ...
```

### 运行时

默认情况下环境变量是不能在运行时访问的，如若需要在浏览器环境中访问，可以在设置环境变量时增加前缀：`WIN_ENV_`，如：

```shell
# File .env
WIN_ENV_APP_ID=123456
```

在运行时代码中访问：

```js

export default function AppID() {
  return <h1>AppId is {process.env.WIN_ENV_APP_ID}.</h1>
}
```  

## 多运行环境管理

在开发中经常会有一些需求，根据应用运行的不同环境进行不同的逻辑处理。

比如，`dev` 环境使用 `dev` 的对应的 Url，而线上则使用 `prod` 对应的 Url。 或者，在某些特定的环境需要打开只有在该环境下才会生效的功能。

### 获取当前运行环境名称

WinJS 提供了一个环境变量 `WIN_APP_ENV`，该变量代表当前应用所处环境的具体名称。如 development、test、uat、production 等。

如若需要在 `config` 外的非 node 环境文件中使用该环境变量，则需要在 `config` 导出默认 `defineConfig()` 时配置 `define{}`。

示例代码如下：

```tsx 
// config/config.ts
const { WIN_APP_ENV } = process.env;

export default defineConfig({
  define: {
    WIN_APP_ENV: WIN_APP_ENV || 'development'
  }
});
```

使用该变量，示例代码如下：

```vue
<script lang="ts" setup>
  console.log('API_URL', API_URL);
</script>
```

### 多环境多份配置文件

在 WinJS 内可通过指定 `WIN_ENV` 环境变量来区分不同环境的配置文件，`WIN_ENV` 需要在 `package.json` 内配置。

示例配置如下：

```json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=1 win build",
    "build": "win build",
    "build:dev": "cross-env WIN_APP_ENV=development WIN_ENV=dev win build",
    "build:test": "cross-env WIN_APP_ENV=test WIN_ENV=test win build",
    "build:uat": "cross-env WIN_APP_ENV=uat WIN_ENV=uat win build",
    "build:prod": "cross-env WIN_APP_ENV=production WIN_ENV=prod win build",
    "dev": "npm run start:dev",
    "start": "cross-env WIN_APP_ENV=development WIN_ENV=dev win dev",
    "start:dev": "cross-env WIN_APP_ENV=development WIN_ENV=dev MOCK=none win dev",
    "start:no-mock": "cross-env WIN_APP_ENV=development WIN_ENV=dev MOCK=none win dev",
    "start:uat": "cross-env WIN_APP_ENV=uat WIN_ENV=uat MOCK=none win dev",
    "start:test": "cross-env WIN_APP_ENV=test WIN_ENV=test MOCK=none win dev"
  }
}
```

WinJS 配置文件中的 `appConfig` 属性添加对应的配置即可：

```js
import { defineConfig } from 'win';

export default defineConfig({
  appConfig: {
    // WIN_APP_ENV 就是 development, test, uat, production
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    test: {
      API_HOME: 'https://test.github.com/',
      API_UPLOAD: 'https://test.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    uat: {
      API_HOME: 'https://uat.github.com/',
      API_UPLOAD: 'https://uat.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    }
  },
})
```

当 `WIN_ENV` 为 `test` 时，则可以在 config 目录下配置 `config.test.ts` 文件来管理 `test` 环境下的不同变量，WinJS 框架会在 deep merge 后形成最终配置。

示例代码如下：

```tsx | pure
// config/config.test.ts test环境对应的配置文件
import { defineConfig } from 'win';

/**
 * 导出的多环境变量命名约定：一律大写且采用下划线分割单词
 * 注意：在添加变量后，需要在src/typing.d.ts内添加该变量的声明，否则在使用变量时IDE会报错。
 */
export default defineConfig({
  define: {
    API_URL: 'https://api-test.xxx.com', // API地址
    API_SECRET_KEY: 'XXXXXXXXXXXXXXXX', // API调用密钥
  },
});
```

变量使用示例：

```tsx
import { request } from 'winjs';

export async function query() {
  // 使用API密钥调用用户接口
  return request('${API_URL}/api/users', {
    API_SECRET_KEY,
  });
}
```

配置文件夹 config 下的结构：

```bash
├── config
│   ├── config.dev.ts
│   ├── config.test.ts
│   ├── config.pre.ts
│   ├── config.prod.ts
│   ├── config.ts
│   ├── proxy.ts
│   ├── routes.ts
│   ├── defaultSettings.ts
...
```

### 报错的处理方式

由于环境变量是直接使用，不会通过 window 对象的方式来使用，在 eslint 和 TypeScript 中都会报错。

eslint 中可以通过增加 [`globals`](https://eslint.org/docs/user-guide/configuring#specifying-globals) 的配置来处理报错。代码看起来是这样的

```tsx
{
  "globals": {
    "page": true
  }
}
```

在 TypeScript 可以在项目中的声明文件，如 `typings.d.ts` 中进行定义：

示例代码如下：

```tsx
// src/typings.d.ts
declare const WIN_APP_ENV: 'test' | 'development' | 'uat' | 'production' | undefined;
// 以下变量声明对应config.[env].ts文件内define的变量
declare const API_URL: string;
declare const API_SECRET_KEY: string;
```

## process.env 替换方式

在使用属性配置 `define` 时，请避免替换整个 `process.env` 对象，比如下面的用法是不推荐的：

```js
export default {
  define: {
    'process.env': JSON.stringify(process.env),
  },
};
```

如果你采用了上述用法，将会导致如下问题：

1. 额外注入了一些未使用的环境变量，导致开发环境的环境变量被泄露到前端代码中。
2. 由于每一处 `process.env` 代码都会被替换为完整的环境变量对象，导致前端代码的包体积增加，性能降低。

因此，请按照实际需求来注入 `process.env` 上的环境变量，避免全量替换。  

## Tree Shaking

`define` 还可以用于标记死代码以协助 WinJS 进行 tree shaking 优化。

例如通过将 `process.env.LANGUAGE` 替换为具体值来实现针对不同语言的产物进行差异化构建：

```ts 
export default {
  define: {
    'process.env.LANGUAGE': JSON.stringify(process.env.LANGUAGE),
  },
};
```

对于一段国际化代码：

```js
const App = () => {
  if (process.env.LANGUAGE === 'en') {
    return <EntryFoo />;
  } else if (process.env.LANGUAGE === 'zh') {
    return <EntryBar />;
  }
};
```

指定环境变量 `LANGUAGE=zh` 并执行构建，得到的产物会移除多余的代码：

```js
const App = () => {
  if (false) {
  } else if (true) {
    return <EntryBar />;
  }
};
```

未用到的组件不会被打包，它们的外部依赖也会对应地被移除，最终可以得到体积更小的构建产物。     

## 内置环境变量列表

按字母顺序排列。

### APP_ROOT

指定项目根目录。

注意：

* APP_ROOT 不能配在 .env 中，只能在命令行里添加


### ANALYZE

用于分析 bundle 构成，默认关闭。

比如：

```bash
$ ANALYZE=1 win dev
# 或者
$ ANALYZE=1 win build
```

可以通过 `ANALYZE_PORT` 环境变量自定义端口或 [`analyze`](../config/config#analyze) 选项自定义配置。

### BABEL_POLYFILL

默认会根据 targets 配置打目标浏览器的全量补丁，设置为 `none` 禁用内置的补丁方案。

### COMPRESS

默认压缩 CSS 和 JS，值为 none 时不压缩，build 时有效。

### DID_YOU_KNOW


设置为 `none` 会禁用「你知道吗」提示。

### ERROR_OVERLAY

设置为 `none` 会禁用「Error Overlay」，在调试 Error Boundary 时会有用。

### WIN_LOGGER

默认会开启保存物理日志，值为 none 时不保存，同时针对 webcontainer 场景（比如 stackbliz）暂不保存。

### HMR

默认开启 HMR 功能，值为 none 时关闭。

### HOST

默认是 `0.0.0.0`。

### PORT

指定端口号，默认是 `8000`。

### STRICT_PORT

如果设置，当端口被占用时，会提示用户使用其他端口，并退出进程。

```bash
$ STRICT_PORT=8000 win dev
```

### SOCKET_SERVER

指定用于 HMR 的 socket 服务器。比如：

```bash
$ SOCKET_SERVER=http://localhost:8000/ win dev
```

### SPEED_MEASURE

分析 Webpack 编译时间，支持 `CONSOLE` 和 `JSON` 两种格式，默认是 `CONSOLE`。

```bash
$ SPEED_MEASURE=JSON win dev
```

### WIN_ENV

当指定 `WIN_ENV` 时，会额外加载指定值的配置文件，优先级为：

 - `config.ts`

 - `config.${WIN_ENV}.ts`

 - `config.${dev | prod | test}.ts`

 - `config.${dev | prod | test}.${WIN_ENV}.ts`

 - `config.local.ts`

若不指定 `WIN_ENV` ，则只会加载当前环境对应的配置文件，越向下的越具体，优先级更高，高优的配置可以往下移动。

注：根据当前环境的不同，`dev`, `prod`, `test` 配置文件会自动加载，不能将 `WIN_ENV` 的值设定成他们。

### WIN_APP_ENV

主要是用来区分当前不同的运行环境来加载不同的配置（如运行时的 proxy, config.local.js 配置等），取值可以自定义。如 'test'、'development'、'uat'、'production'。

### WIN_PLUGINS

指定 `win` 命令执行时额外加载的插件的路径，使用 `,` 隔开。

```bash
$ WIN_PLUGINS=./path/to/plugin1,./path/to/plugin2 win dev
```

### WIN_PRESETS

指定 `win` 命令执行时额外加载插件集的路径，使用 `,` 隔开。

```bash
$ WIN_PRESETS=./path/to/preset1,./path/to/preset2 win dev
```

### WEBPACK_FS_CACHE_DEBUG

开启 webpack 的物理缓存 debug 日志。

```bash
$ WEBPACK_FS_CACHE_DEBUG=1 win dev
```

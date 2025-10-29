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

If you have environment variables that need special configuration locally, you can configure them in the `.env.local` file to override the `.env` configuration. For example, based on the previous `.env` configuration, if you want to override the previous port 3000 and use port 4000 for local development, you can define it as follows:

```text
# file .env.local
PORT=4000
```

WinJS will start the dev server on port 4000 while keeping babel cache disabled.

Additionally, the `.env` file in WinJS also supports variable interpolation for configuring environment variables. For example:

```
# file .env.local
FOO=foo
BAR=bar

CONCAT=$FOO$BAR # CONCAT=foobar
```

WinJS does not support `.env.development` / `.env.production` environment variable configuration files. If you need different variable values in different environments, please use cross-env to distinguish between different startup commands, or define them in the corresponding WinJS configuration files for each WIN_ENV.

Note:

* It is not recommended to include `.env.local` in version control.
 
::: tip Note

Variables defined in the `.env` file can only be used in the Node.js environment, such as in `.winrc.ts`, and cannot be used in the project client code.
 
:::

### Using Environment Variables in Browser

All environment variables injected through the `.env` environment variable file or command line are only effective in the WinJS configuration file (Node.js environment) by default. They cannot be directly used in the browser through `process.env.VAR_NAME`. You need to further configure [`define`](../config/config.md#define) to inject them into the browser environment:

```bash
# .env
MY_TOKEN="xxxxx"
```

<br />

```ts
// .winrc.ts
define: { 'process.env.MY_TOKEN': process.env.MY_TOKEN }
```

Note: By convention, all environment variables starting with `WIN_APP_` will be automatically injected into the browser without the need to manually configure `define`.

::: tip Note
Variables starting with `WIN_APP_` will be automatically loaded into your project (client). Other variables need to be declared through `define` to be injected into your project (client). Avoid including sensitive information in variables starting with `WIN_APP_`.

The scope of identifier replacement for `WIN_APP_` prefixed variables in client code includes:
- JavaScript files, and files that can be transformed into JavaScript code, such as `.js`, `.jsx`, `.ts`, `.tsx`, `.vue`, etc.

Note that identifiers in the following files will not be replaced:

- CSS files, such as `.css`, `.scss`, `.less`, etc.
  :::

## Using Environment Variables
In WinJS, environment variable usage scenarios are divided into two types: build time and runtime.

Important note: The type of environment variables when used is always `string`. Especially when set to `true` or `false`, you need to check them as string types:

```js
// WIN_DISABLE_FOO=false
if (process.env.WIN_DISABLE_FOO === 'false') {
  // ...
}
```

### Build Time

By default, all set environment variables will be injected into the build environment. You can access them through the `process.env` variable in `winrc` files or other build plugins.

```js
const port = process.env.PORT;
// ...
```

### Runtime

By default, environment variables cannot be accessed at runtime. If you need to access them in the browser environment, you can add the prefix `WIN_ENV_` when setting environment variables, for example:

```shell
# File .env
WIN_ENV_APP_ID=123456
```

Access in runtime code:

```js

export default function AppID() {
  return <h1>AppId is {process.env.WIN_ENV_APP_ID}.</h1>
}
```  

## Multi-Environment Management

During development, there are often requirements to perform different logic processing based on the different environments in which the application runs.

For example, the `dev` environment uses the corresponding URL for `dev`, while production uses the corresponding URL for `prod`. Or, in certain specific environments, you need to enable features that only work in that environment.

### Getting Current Environment Name

WinJS provides an environment variable `WIN_APP_ENV`, which represents the specific name of the environment where the current application is located, such as development, test, uat, production, etc.

If you need to use this environment variable in non-Node.js environment files outside of `config`, you need to configure `define{}` when exporting the default `defineConfig()` in `config`.

Example code:

```tsx 
// config/config.ts
const { WIN_APP_ENV } = process.env;

export default defineConfig({
  define: {
    WIN_APP_ENV: WIN_APP_ENV || 'development'
  }
});
```

To use this variable, example code:

```vue
<script lang="ts" setup>
  console.log('API_URL', API_URL);
</script>
```

### Multiple Configuration Files for Different Environments

In WinJS, you can use the `WIN_ENV` environment variable to distinguish configuration files for different environments. `WIN_ENV` needs to be configured in `package.json`.

Example configuration:

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

You can add the corresponding configuration in the `appConfig` property of the WinJS configuration file:

```js
import { defineConfig } from 'win';

export default defineConfig({
  appConfig: {
    // WIN_APP_ENV can be development, test, uat, production
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: true
    },
    test: {
      API_HOME: 'https://test.github.com/',
      API_UPLOAD: 'https://test.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: true
    },
    uat: {
      API_HOME: 'https://uat.github.com/',
      API_UPLOAD: 'https://uat.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: true
    },
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: true
    }
  },
})
```

When `WIN_ENV` is `test`, you can configure a `config.test.ts` file in the config directory to manage different variables under the `test` environment. The WinJS framework will form the final configuration after deep merge.

Example code:

```tsx | pure
// config/config.test.ts - configuration file for test environment
import { defineConfig } from 'win';

/**
 * Multi-environment variable naming convention: all uppercase with underscores separating words
 * Note: After adding variables, you need to add the variable declaration in src/typing.d.ts, otherwise the IDE will report an error when using the variable.
 */
export default defineConfig({
  define: {
    API_URL: 'https://api-test.xxx.com', // API address
    API_SECRET_KEY: 'XXXXXXXXXXXXXXXX', // API call secret key
  },
});
```

Variable usage example:

```tsx
import { request } from 'winjs';

export async function query() {
  // Call user interface using API secret key
  return request('${API_URL}/api/users', {
    API_SECRET_KEY,
  });
}
```

Config folder structure:

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

### Handling Errors

Since environment variables are used directly and not through the window object, errors will occur in both eslint and TypeScript.

In eslint, you can handle errors by adding [`globals`](https://eslint.org/docs/user-guide/configuring#specifying-globals) configuration. The code looks like this:

```tsx
{
  "globals": {
    "page": true
  }
}
```

In TypeScript, you can define them in a declaration file in the project, such as `typings.d.ts`:

Example code:

```tsx
// src/typings.d.ts
declare const WIN_APP_ENV: 'test' | 'development' | 'uat' | 'production' | undefined;
// The following variable declarations correspond to variables defined in config.[env].ts files
declare const API_URL: string;
declare const API_SECRET_KEY: string;
```

## process.env Replacement Approach

When using the `define` property configuration, please avoid replacing the entire `process.env` object. For example, the following usage is not recommended:

```js
export default {
  define: {
    'process.env': JSON.stringify(process.env),
  },
};
```

If you adopt the above usage, it will cause the following issues:

1. Additional unused environment variables are injected, causing development environment variables to be leaked into the frontend code.
2. Since every occurrence of `process.env` code will be replaced with the complete environment variable object, it leads to an increase in the frontend code bundle size and performance degradation.

Therefore, please inject environment variables on `process.env` according to actual needs and avoid full replacement.

## Tree Shaking

`define` can also be used to mark dead code to assist WinJS in tree shaking optimization.

For example, by replacing `process.env.LANGUAGE` with a specific value, you can achieve differentiated builds for different languages:

```ts 
export default {
  define: {
    'process.env.LANGUAGE': JSON.stringify(process.env.LANGUAGE),
  },
};
```

For an internationalization code:

```js
const App = () => {
  if (process.env.LANGUAGE === 'en') {
    return <EntryFoo />;
  } else if (process.env.LANGUAGE === 'zh') {
    return <EntryBar />;
  }
};
```

Specify the environment variable `LANGUAGE=zh` and execute the build. The resulting output will remove unnecessary code:

```js
const App = () => {
  if (false) {
  } else if (true) {
    return <EntryBar />;
  }
};
```

Unused components will not be bundled, and their external dependencies will also be removed accordingly, ultimately resulting in a smaller build output.

## Built-in Environment Variables List

Listed in alphabetical order.

### APP_ROOT

Specifies the project root directory.

Note:

* APP_ROOT cannot be configured in .env, it can only be added in the command line


### ANALYZE

Used for analyzing bundle composition, disabled by default.

For example:

```bash
$ ANALYZE=1 win dev
# or
$ ANALYZE=1 win build
```

You can customize the port through the `ANALYZE_PORT` environment variable or customize the configuration through the [`analyze`](../config/config#analyze) option.

### BABEL_POLYFILL

By default, full polyfills for the target browser are bundled based on the targets configuration. Set to `none` to disable the built-in polyfill solution.

### COMPRESS

CSS and JS are compressed by default. When the value is none, compression is disabled, effective during build.

### DID_YOU_KNOW


Setting to `none` disables the "Did You Know" tips.

### ERROR_OVERLAY

Setting to `none` disables the "Error Overlay", which is useful when debugging Error Boundary.

### WIN_LOGGER

Physical logging is enabled by default. When the value is none, logging is not saved. Also, logging is temporarily not saved for webcontainer scenarios (such as stackbliz).

### HMR

HMR functionality is enabled by default. Set to none to disable.

### HOST

Default is `0.0.0.0`.

### PORT

Specifies the port number, default is `8000`.

### STRICT_PORT

If set, when the port is occupied, it will prompt the user to use another port and exit the process.

```bash
$ STRICT_PORT=8000 win dev
```

### SOCKET_SERVER

Specifies the socket server for HMR. For example:

```bash
$ SOCKET_SERVER=http://localhost:8000/ win dev
```

### SPEED_MEASURE

Analyzes Webpack compilation time, supports `CONSOLE` and `JSON` formats, default is `CONSOLE`.

```bash
$ SPEED_MEASURE=JSON win dev
```

### WIN_ENV

When `WIN_ENV` is specified, configuration files with the specified value will be additionally loaded. The priority order is:

 - `config.ts`

 - `config.${WIN_ENV}.ts`

 - `config.${dev | prod | test}.ts`

 - `config.${dev | prod | test}.${WIN_ENV}.ts`

 - `config.local.ts`

If `WIN_ENV` is not specified, only the configuration file corresponding to the current environment will be loaded. The further down the list, the more specific it is, the higher the priority. Higher priority configurations can be moved down.

Note: Depending on the current environment, `dev`, `prod`, `test` configuration files are automatically loaded, so you cannot set the value of `WIN_ENV` to them.

### WIN_APP_ENV

Mainly used to distinguish different runtime environments to load different configurations (such as runtime proxy, config.local.js configuration, etc.). The value can be customized, such as 'test', 'development', 'uat', 'production'.

### WIN_PLUGINS

Specifies the path of additional plugins to be loaded when the `win` command is executed, separated by `,`.

```bash
$ WIN_PLUGINS=./path/to/plugin1,./path/to/plugin2 win dev
```

### WIN_PRESETS

Specifies the path of additional plugin sets to be loaded when the `win` command is executed, separated by `,`.

```bash
$ WIN_PRESETS=./path/to/preset1,./path/to/preset2 win dev
```

### WEBPACK_FS_CACHE_DEBUG

Enables webpack filesystem cache debug logging.

```bash
$ WEBPACK_FS_CACHE_DEBUG=1 win dev
```

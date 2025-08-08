# Remove Console

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-remove-console?style=flat-square&colorB=646cff)

Automatically removes `[log|warn|error|info|debug]` and `debugger` statements from build artifacts in **production mode**.

## Setup

1. Install the plugin

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

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-remove-console')],
  removeConsole: {}
});
```

## Configuration

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

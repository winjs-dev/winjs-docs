# Micro-Frontend Integration - Qiankun

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-qiankun?style=flat-square&colorB=646cff)

Build artifacts are adapted for Qiankun micro-frontend framework.

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-qiankun -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-qiankun -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-qiankun -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-qiankun -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-qiankun')],
  qiankun: {
    child: {}
  }
});
```

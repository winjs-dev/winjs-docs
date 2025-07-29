# Page Development Efficiency Tool

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-code-inspector?style=flat-square&colorB=646cff)

Click on any DOM element on the page, and it will automatically open your IDE and position the cursor to the source code location corresponding to that DOM element.

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-code-inspector -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-code-inspector -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-code-inspector -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-code-inspector -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-code-inspector')],
  codeInspector: {}
});
```

## Configuration and Parameters

Reference: [CodeInspector](https://inspector.fe-dev.cn/guide/introduction.html)

# Icons Legacy Solution

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-icons-legacy?style=flat-square&colorB=646cff)

Legacy solution for icons, primarily provided for Vue 2 usage. Uses the SvgIcon component. SVG files in the src/icons directory use this solution by default. This solution relies on svg-sprite-loader implementation, so the bundler does not support Vite.

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-icons-legacy -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-icons-legacy -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-icons-legacy -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-icons-legacy -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-icons-legacy')],
  iconsLegacy: {
    include: []
  }
});
```
 
## Configuration
 
### include
- **Type**: `Array<string>` 
- **Default**: `[]`

Used for additional SVG files that need to be parsed using this solution. Note that **absolute paths** must be used.

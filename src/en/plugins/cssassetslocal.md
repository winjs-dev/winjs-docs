# CSS Asset Localization

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-css-assets-local?style=flat-square&colorB=646cff)

Component code may depend on some remote CDN font files, etc., which may be inaccessible when the website is running in certain situations. This plugin provides the ability to localize network resources in CSS during build and deployment, such as font files.

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-css-assets-local -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-css-assets-local -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-css-assets-local -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-css-assets-local -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts 
import { defineConfig } from 'win';

export default defineConfig(() => ({
  plugins: ['@winner-fed/plugin-css-assets-local'],
  cssAssetsLocal: {
    outputPath: 'assets'
  }
}));
```

## Configuration

### `outputPath`

Directory prefix for extracted static files

- Type: `string`
- Default: `assets`

### `relativeCssPath`

Path of extracted files relative to CSS

- Type: `string`
- Default: `../`

### `enableInDev`

Whether to enable the plugin during local debugging

- Type: `boolean`
- Default: `false`

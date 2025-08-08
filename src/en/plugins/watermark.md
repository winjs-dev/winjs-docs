# Watermark {#watermark}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-watermark?style=flat-square&colorB=646cff)

Watermark adds watermark effects to pages.

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-watermark -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-watermark -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-watermark -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-watermark -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-watermark'],
  /**
   * @name Watermark plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/watermark.html
   */
  watermark: {},
});
```

3. Import and use in your project

```ts
import { Watermark, WatermarkOptions } from 'winjs';

const watermark = new Watermark({
  container: document.body,
  text: 'Test Watermark',
} as WatermarkOptions);

watermark.show();
```

## API

### Basic Parameters

| **Parameter** | **Description** | **Type** | **Default** |
| --- | --- | --- | --- |
| container | Watermark mount node | `HTMLElement` \| `string` | \- |
| image | Image source, recommend exporting 2x or 3x images, image rendering takes priority | `string` | \- |
| text | Watermark text, array indicates multi-line watermark | `string` \| `string\[\]` | \- |
| zIndex | Watermark z-index | `number` | `9999` |
| width | Single watermark width | `number` | `120` |
| height | Single watermark height | `number` | `64` |
| opacity | Watermark opacity | `number` | `0.15` |
| rotate | Rotation angle | `number` | `-22` |
| fontSize | Font size | `number` | `16` |
| fontWeight | Font weight | `number` \| `string` | `normal` |
| fontStyle | Font style | `string` | `normal` |
| fontVariant | Font variant | `string` | `normal` |
| fontColor | Font color | `string` | `#000` |
| fontFamily | Watermark text font family | `string` | `sans-serif` |
| blindText | Blind watermark text | `string` | \- |
| blindOpacity | Blind watermark opacity | `number` | `0.005` |

### Advanced Parameters

| **Parameter** | **Description** | **Type** | **Default** |
| --- | --- | --- | --- |
| monitor | Whether to enable protection mode | `boolean` | `true` |
| mode | Display mode, interval means staggered display | `string` | `interval` |
| gapX | Horizontal spacing between watermarks | `number` | `100` |
| gapY | Vertical spacing between watermarks | `number` | `100` |
| offsetLeft | Horizontal offset for watermark drawing on canvas | `number` | `0` |
| offsetTop | Vertical offset for watermark drawing on canvas | `number` | `0` |
| pack | Whether to use watermark component to wrap content | `boolean` | `true` |

### Methods

| **Name** | **Description** | **Type** |
| --- | --- | --- |
| update | Update watermark configuration and re-render | `(opts: WatermarkOptions) => void` |
| show | Show watermark | `() => void` |
| hide | Hide watermark | `() => void` |
| destroy | Destroy watermark | `() => void` |

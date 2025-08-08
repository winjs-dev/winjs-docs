# Mobile Debugging Tools

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-wconsole?style=flat-square&colorB=646cff)

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-wconsole -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-wconsole -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-wconsole -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-wconsole -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-wconsole')],
  wconsole: {
    // You can use any one of the three or all of them
    vconsole: {},
    eruda: {},
    pagespy: {}
  },
  appConfig: {
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // Debug tools enable switch
      IS_OPEN_VCONSOLE: true
    },
  }
});
```

## Introduction 

A collection of commonly used mobile debugging tools for WinJS projects. Currently includes [vConsole](https://github.com/Tencent/vConsole), [eruda](https://github.com/liriliri/eruda), and [PageSpy](https://github.com/HuolalaTech/page-spy).
 

::: warning Note
To ensure consistency with enabling debug tools in previous projects, you need to add the `IS_OPEN_VCONSOLE` property to your project's configuration file before enabling the plugin. This means mounting the `IS_OPEN_VCONSOLE` property on `window.LOCAL_CONFIG` and setting its value to `true`.
:::

## Configuration

### vConsole

```js
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-wconsole')],
  wconsole: {
    vconsole: {
      defaultPlugins: Array(string),
      onReady: Function,
      disableLogScrolling: Boolean,
      theme: String,
      url: String
    },
  }
});

```

Property Name         | Type          | Optional | Default Value                                | Description
--------------------- | ------------- | -------- | ------------------------------------------- | -------------------
defaultPlugins        | Array(String) | true     | ['system', 'network', 'element', 'storage'] | Built-in plugins that need to be automatically initialized and loaded. 
onReady               | Function      | true     |                                             | Callback method triggered when vConsole completes initialization and loads built-in plugins.
disableLogScrolling   | Boolean       | true     |                                             | If `false`, the panel will not automatically scroll to the bottom when there are new logs.
theme                 | String        | true     | 'light'                                     | Theme color, options are 'light' | 'dark'.
url                   | String        | true     | 'https://cdnjs.cloudflare.com/ajax/libs/vConsole/3.14.7/vconsole.min.js' | vConsole file URL to load.

Reference: [here](https://github.com/Tencent/vConsole/blob/dev/doc/public_properties_methods_CN.md)
   

### eruda  

```js
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-wconsole')],
  wconsole: {
    eruda: {
      container: String,
      tool: Array(String),
      autoScale: Boolean,
      useShadowDom: Boolean,
      defaults: Object,
      url: String
    },
  }
});

```
Property Name         | Type           | Optional | Default Value                                                        | Description
--------------------- |----------------|----------|----------------------------------------------------------------------|-------------------
container             | String         | true     | DOM element for plugin initialization. If not set, a div container is created by default and placed directly under the HTML root node. |               
tool                  | Array(String)  | true     |                                                                      | Specify which panels to initialize, loads all by default.
autoScale             | Boolean        | true     | true                                                                 | Auto scale under different viewports
useShadowDom          | Boolean        | true     | true                                                                 | Use Shadow DOM for CSS encapsulation
defaults              | Object         | true     | `{ displaySize: 50, transparency: 0.9, theme: 'Monokai Pro' }`      | Default settings.
url                   | String         | true     | 'https://cdnjs.cloudflare.com/ajax/libs/eruda/3.0.1/eruda.min.js'   | eruda file URL to load.
 
Reference: [here](https://github.com/liriliri/eruda/blob/master/doc/API.md)

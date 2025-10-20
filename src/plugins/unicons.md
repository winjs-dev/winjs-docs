# unIcons 

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-unicons?style=flat-square&colorB=646cff)

A unified icon solution provided by WinJS, using [unplugin-icons](https://github.com/unplugin/unplugin-icons) as the underlying parsing tool. Compatible with multiple build tools such as webpack, rspack, vite, etc., and frontend frameworks such as Vue 2, Vue, etc. The plugin also has built-in [Resolver](https://github.com/unplugin/unplugin-icons/tree/main?tab=readme-ov-file#use-with-resolver) functionality that can automatically import required SVG icons.

::: tip Note
Please master the usage of unplugin-icons first.
:::

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-unicons -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-unicons -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-unicons -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-unicons -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-unicons')],
  unIcons: {
    include: [],
    // Supports unplugin-icons configuration parameters, such as
    customCollections: {
      ...
    }
    
  }
});
```
 
## Configuration
 
### include
- **Type**: `Array<string>` 
- **Default**: `[]`

Used for additional SVG files that need to be parsed using this solution. Note that **absolute paths** must be used, and they will be compressed by the plugin's built-in svgo.
 
### Supports unplugin-icons Extended Configuration
- Inherits [configuration parameters](https://github.com/unplugin/unplugin-icons/blob/main/src/types.ts) from the [unplugin-icons](https://github.com/unplugin/unplugin-icons) plugin
 
## Note
- When using local icons, according to the naming rules of [unplugin-icons](https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#name-conversion), it uses `icon` as the prefix by default and `win` as the collection. It parses SVG icons under `src/icons` by default, such as `icon-win-dog`

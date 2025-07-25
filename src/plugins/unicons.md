# unIcons 

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-unicons?style=flat-square&colorB=646cff)

WinJS 提供的有关 icons 统一解决方案，以 [unplugin-icons](https://github.com/unplugin/unplugin-icons) 作为底层解析工具。适配多种构建工具，如 webpack, rspack, vite 等和前端框架，如 vue2，vue等。插件本身也内置了 [Resolver](https://github.com/unplugin/unplugin-icons/tree/main?tab=readme-ov-file#use-with-resolver) 功能，可自动引入所需的 svg 图标。

::: tip 注意
请先掌握 unplugin-icons 的用法。
:::

## 开启方式

1. 安装插件

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-unicons')],
  unIcons: {
    include: [],
    // 支持 unplugin-icons 配置参数，如
    customCollections: {
      ...
    }
    
  }
});
```
 
## 配置
 
### include
- **类型**：`Array<string>` 
- **默认值**：`[]`

用于额外需要使用此方案解析的 svg 文件。注意需要使用**绝对路径**，并且会被插件内置的 svgo 压缩。
 
### 支持 unplugin-icons 扩展配置
- 继承了 [unplugin-icons](https://github.com/unplugin/unplugin-icons)插件的[配置参数](https://github.com/unplugin/unplugin-icons/blob/main/src/types.ts)
 
## 注意
- 在使用本地图标时，根据[unplugin-icons](https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#name-conversion)的命名规则，默认使用 `icon` 作为前缀(prefix)，`win` 作为集合（collection）。默认解析 `src/icons` 下的 svg 图标，如 `icon-win-dog`

## 示例
可参考 [with-unicons](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/-/tree/dev/examples/with-unicons)

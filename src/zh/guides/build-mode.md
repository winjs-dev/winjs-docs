# 构建模式

## `bundle` / `bundleless`

那么首先我们来了解一下 bundle 和 bundleless。

所谓 bundle 是指对构建产物进行打包，构建产物可能是一个文件，也有可能是基于一定的[代码拆分策略](https://esbuild.github.io/api/#splitting)得到的多个文件。目前社区里的 [Webpack](https://webpack.js.org)、[Rollup](https://rollupjs.org/guide/en/) 都是对源码做 Bundle 构建的构建工具。

而 bundleless 则是指对每个源文件单独进行编译构建，但是并不将它们打包在一起。它不对依赖做任何处理，每一个产物文件都可以找到与之相对应的源码文件。**bundleless 构建的过程，也可以理解为仅对源文件进行代码转换的过程**。目前社区里的 [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html)、[unbuild](https://github.com/unjs/unbuild) 都是对源码做 Bundless 构建的构建工具。

它们有各自的好处：

- bundle 可以减少构建产物的体积，也可以对依赖预打包，减小安装依赖的体积。提前对库进行打包，可以加快应用项目构建的速度。
- bundleless 则是可以保持原有的文件结构，更有利于调试和 tree shaking。

:::warning
bundleless 是单文件编译模式，因此对于类型的引用和导出你需要加上 `type` 字段， 例如 `import type { A } from './types`
:::

## 使用第三方 npm 包

当要为初始化的项目增加第三方的 npm 包的时候，我们可以把这一过程叫做“为项目安装依赖”或是“为项目增加依赖”。在增加依赖之前，首先我们要特别了解一件事情 —— **npm 依赖的软件包类型**：

- `"dependencies"`：一种是你的应用程序在生产环境中需要的软件包。
- `"devDependencies"`：另一种是仅在本地开发和测试中需要的软件包。
- `"peerDependencies"`：在某些情况下，你的 npm 项目与它的宿主工具或者库之间存在某种兼容关系（例如一个 webpack 插件项目和 webpack），同时你的 npm 项目不想将宿主作为必要的依赖，这个时候通常说明你的项目可能是这个宿主工具或者库的插件。你的 npm 项目会对宿主包的版本有一定的要求，因为只有在特定的版本下才会暴露出 npm 项目所需要的 API。
  关于更多 `peerDependencies` 的解释，可以通过下面的链接了解 npm、pnpm、Yarn 对于它的不同处理方式：
  - [npm 对 peerDependencies 的解释](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies)
  - [pnpm vs npm VS Yarn](https://pnpm.io/feature-comparison)
>   软件包可以理解为是第三方的 npm 包。

你可以通过执行 `npm install npm-package-name` 或者 `npm add npm-package-name` 的方式来安装在**生产环境中需要的软件包**，或者也可以在 `package.json` 文件中手动的将需要安装的包和对应的[语义化版本](https://docs.npmjs.com/about-semantic-versioning)写在 `"dependencies"` 里，并执行 `npm install` 命令：

```json
{
  "name": "your-npm-project",
  "dependencies": {
    "npm-package-name": "0.1.0"
  }
}
```

同理，你也可以执行 `npm install npm-package-name --save-dev` 或 `npm add npm-package-name --save-dev` 的方式来安装**仅在本地开发和测试中需要的软件包**，或者也可以在 `package.json` 文件中手动的将需要安装的包和对应的[语义化版本](https://docs.npmjs.com/about-semantic-versioning)写在 `"devDependencies"` 里，并执行 `npm install` 命令：

```json
{
  "name": "your-npm-project",
  "devDependencies": {
    "npm-package-name": "0.1.0"
  }
}
```

**在安装或者使用第三方 npm 包的时候一定要确定它们的用途，以及通过区分它们的类型确定好它们应该放在 `"dependencies"` 还是 `"devDependencies"` 中。**

:::tip
一般来说，需要在源代码中使用到的包都属于 `dependencies` 依赖。除非你通过打包的方式将依赖的代码输出到本地，那么这种情况可以将它作为 `devDependencies` 依赖。
:::

## 处理三方依赖

一般来说，项目所需要的第三方依赖可以通过包管理器的 `install` 命令安装，在安装第三方依赖成功后，这些第三方依赖一般会出现在项目 `package.json` 的 `dependencies` 和 `devDependencies` 下。

```json 
{
  "dependencies": {},
  "devDependencies": {}
}
```

`"dependencies"` 下的依赖通常来说是这个包运行所需的依赖， `"devDependencies"` 则代表着开发依赖。

除了 `"dependencies"` 以外，`"peerDependencies"` 也可以声明在生产环境下运行所需要的依赖，此时会和它的宿主共享一份依赖。

## 第三方依赖的默认处理

在 WinJS 的源码打包中，底层打包工具依赖的是 [father](https://github.com/umijs/father)，**默认情况下不会对 `"dependencies"` 以及 `"peerDependencies"` 下的第三方依赖进行打包处理**。

这是因为在安装 npm 包时，其 `"dependencies"` 也会被安装。不打包 `"dependencies"`，可以减小包产物的体积。

如果需要打包某些依赖，建议将它们从 `"dependencies"` 挪到 `"devDependencies"` ，这相当于对依赖进行 **prebundle** ，可以减小依赖安装的体积。

### 示例

如果项目依赖了 `vue`:

```json
{
  "dependencies": {
    "vue": "^3.3.0"
  },
  // or
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}
```

当源码中使用了 `vue` 依赖:

```tsx 
import Vue from 'vue';
console.info(Vue);
```

此时产物中不会包含 `vue` 的代码:

```js 
import Vue from 'Vue';
console.info(Vue);
```

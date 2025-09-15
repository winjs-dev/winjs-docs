# 配置 {#config}

对于 WinJS 中能使用的自定义配置，你可以使用项目根目录的 `.winrc.ts` 文件或者 `config/config.ts`
，值得注意的是这两个文件功能一致，仅仅是存在目录不同，2 选 1 ，`.winrc.ts` 文件优先级较高。

> 更多目录相关信息介绍，你可以在[目录结构](../guides/directory-structure)了解。

WinJS 的配置文件是一个正常的 node 模块，它在执行 WinJS [命令行](../cli/commands)的时候使用，并且不包含在浏览器端构建中。

> 关于浏览器端构建需要用到的一些配置，还有一些在样式表现上产生作用的一些配置，在 WinJS
> 中被统一称为“运行时配置”，你可以在[运行时配置](./runtime-config)看到更多关于它的说明。

这里有一个最简单的 WinJS 配置文件的范例：

```ts
import { defineConfig } from 'win';

export default defineConfig({
  outputPath: 'dist',
});
```

使用 `defineConfig` 包裹配置是为了在书写配置文件的时候，能得到更好的拼写联想支持。如果你不需要，直接 `export default {}`
也可以。

值得关注的是在你使用 WinJS 的时候，你不需要了解每一个配置的作用。你可以大致的浏览一下以下 WinJS
支持的所有配置，然后在你需要的时候，再回来查看如何启用和修改你需要的内容。

> 为方便查找，以下配置项通过字母排序。

## alias

- **类型**：`Record<string, string>`
- **默认值**：`{}`

配置别名，对 import 语句的 source 做映射。

比如：

```js
export default {
  alias: {
    foo: '/tmp/to/foo',
  }
}
```

然后代码里 `import 'foo'` 实际上会 `import '/tmp/to/foo'`。

有几个 Tip。

1、alias 的值最好用绝对路径，尤其是指向依赖时，记得加 `require.resolve`，比如，

```js
// ⛔
export default {
  alias: {
    foo: 'foo',
  }
}

// ✅
export default {
  alias: {
    foo: require.resolve('foo'),
  }
}
```

2、如果不需要子路径也被映射，记得加 `$` 后缀，比如

```js
// import 'foo/bar' 会被映射到 import '/tmp/to/foo/bar'
export default {
  alias: {
    foo: '/tmp/to/foo',
  }
}

// import 'foo/bar' 还是 import 'foo/bar'，不会被修改
export default {
  alias: {
    foo$: '/tmp/to/foo',
  }
}
```

## autoprefixer

- **类型**：`object`
- **默认值**：`{ flexbox: 'no-2009' }`

用于解析 CSS 并使用来自 Can I Use 的值将供应商前缀添加到 CSS 规则。如自动给 CSS 添加 `-webkit-` 前缀。

**注意**：`rsbuild` 从 `1.0.1-beta.7` 版本开始默认启用 Lightning CSS，也就是 `parcelCSS`。移除了 `autoprefixer`。不过，WinJS
可以通过设置 `rsbuild.lightningcssLoader` 为 `false` 禁用 Lightning CSS。这样 autoprefixer 配置就会启用。

更多配置，请查阅 [autoprefixer 的配置项](https://github.com/postcss/autoprefixer#options)。

## analyze

- **类型**：`object`
- **默认值**：`{}`

使用 `webpack` 或 `rsbuild` 作为 `bundler` 时，通过指定 [`ANALYZE`](../guides/env-variables#analyze) 环境变量分析产物构成时，analyzer
插件的具体配置项，见 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin)

使用 `vite`  作为 `bundler`
时，除了可以自定义 [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
的配置， `excludeAssets`、`generateStatsFile`、`openAnalyzer`、`reportFilename`、`reportTitle` 这些选项会自动转换适配。

## appConfig

- **类型**：`object`
- **默认值**：`{ globalName: 'LOCAL_CONFIG' }`

支持自定义全局变量名称，允许用户自定义配置对象在 `window` 上的名称，默认值为 `LOCAL_CONFIG`。

配置前端工程运行所需的配置文件 `config.local.js` 里的 script 内容。可以根据当前不同运行环境来配置。需要遵循下面例子的格式。

::: tip 提示
原有 `public` 目录下的 `config.local.js` 文件删除了。
:::

```js
// .winrc.ts
export default {
  appConfig: {
    // 本地调试环境
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    // 测试环境
    test: {
      API_HOME: 'https://test.github.com/',
      API_UPLOAD: 'https://test.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    // 生产环境
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: false
    }
  }
}
```

生成的配置会挂载到 `window.LOCAL_CONFIG` 上：

```javascript
// 生成的 config.local.js
window.MY_APP_CONFIG = {
  "API_HOME": "https://api.github.com/",
  "API_UPLOAD": "https://api.github.com/upload",
  "IS_OPEN_VCONSOLE": true
};
```

### 自定义全局变量名称 <Badge type="tip" text="^0.14.4" />
```typescript
// .winrc.ts
import { defineConfig } from '@winner-fed/winjs';

export default defineConfig({
  appConfig: {
    // 自定义全局变量名称
    globalName: 'MY_APP_CONFIG',
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      IS_OPEN_VCONSOLE: true
    },
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      IS_OPEN_VCONSOLE: false
    }
  }
});
```

生成的配置会挂载到 `window.MY_APP_CONFIG` 上：

```javascript
// 生成的 config.local.js
window.MY_APP_CONFIG = {
  "API_HOME": "https://api.github.com/",
  "API_UPLOAD": "https://api.github.com/upload",
  "IS_OPEN_VCONSOLE": true
};
```

## base

- **类型**：`string`
- **默认值**：`/`

要在非根目录下部署 WinJS 项目时，你可以使用 base 配置。

base 配置允许你为应用程序设置路由前缀。比如有路由 `/` 和 `/users`，设置 base 为 `/foo/` 后就可通过 `/foo/` 和 `/foo/users`
访问到之前的路由。

> 注意：base 配置必须在构建时设置，并且不能在不重新构建的情况下更改，因为该值内联在客户端包中。
              
## banner <Badge  type="tip" text=">=0.15.0" />
- **类型**：`object | boolean | undefined`
- **默认值**：`undefined`
- **bundler**：`webpack`、`rsbuild`、`vite`

为构建的静态资源（JS、CSS 文件）的头部或尾部注入内容的能力。

### 基础用法

```typescript
export default {
  // 启用默认banner（默认为true，可省略）
  banner: true,
  
  // 禁用banner
  banner: false,
  
  // 自定义配置
  banner: {
    content: '/* 自定义banner内容 */',
    position: 'header',
    include: ['js', 'css'],
    exclude: ['*.min.js']
  }
}
```

### 配置项详解

#### content
- 类型：`string | (() => string)`
- 默认值：`''`
- 说明：自定义banner内容，可以是字符串或返回字符串的函数

#### position
- 类型：`'header' | 'footer'`
- 默认值：`'header'`
- 说明：banner的插入位置
- 注意：vite 构建工具不支持 `footer` 位置，如果设置为 `footer` 会显示警告并降级到 `header`

#### include
- 类型：`('js' | 'css')[]`
- 默认值：`['js', 'css']`
- 说明：需要添加banner的文件类型，支持 JS 和 CSS 文件

#### exclude
- 类型：`string[]`
- 默认值：`[]`
- 说明：需要排除的文件模式，支持通配符

### 默认内容

当未配置 `content` 时，系统会使用默认的banner内容，包含以下信息：

- 作者信息：winnerFE
- 项目版本：从 package.json 中读取
- 构建时间：当前构建时间
- WinJS版本：当前使用的WinJS版本

### 示例

#### 自定义banner内容

```typescript
export default {
  banner: {
    content: `
/**
 * 项目名称：${pkg.name}
 * 构建时间：${new Date().toISOString()}
 * 版本：${pkg.version}
 */
`
  }
}
```

#### 只为JS文件添加banner

```typescript
export default {
  banner: {
    include: ['js'],
    exclude: ['*.min.js', 'vendor-*.js']
  }
}
```

#### 使用函数动态生成banner

```typescript
export default {
  banner: {
    content: () => {
      return `/* Generated at ${new Date().toISOString()} */`;
    }
  }
}
```

#### 设置banner位置

```typescript
export default {
  banner: {
    content: '/* Custom banner */',
    position: 'footer'  // 将banner放在文件底部（webpack和rsbuild支持）
  }
}
```

::: warning 注意
Vite（不支持 `position: 'footer'`）。如果在 Vite 中设置 `position: 'footer'`，会显示警告并自动降级到 `header`
::: 

## cacheDirectoryPath

- **类型**：`string`
- **默认值**：`node_modules/.cache`
- **bundler**：`webpack`

默认情况下 WinJS 会将构建中的一些缓存文件存放在 `node_modules/.cache` 目录下，比如 logger 日志，webpack 缓存，mfsu
缓存等。你可以通过使用 `cacheDirectoryPath` 配置来修改 Win 的缓存文件目录。

示例，

```js
export default {
  // 更改缓存文件路径到 node_modules/.cache1 文件夹
  cacheDirectoryPath: 'node_modules/.cache1',
}
```

## chainWebpack

- **类型**：`(memo, args) => void`
- **默认值**：`null`
- **bundler**：`webpack`

为了扩展 WinJS 内置的 webpack 配置，我们提供了用链式编程的方式修改 webpack 配置，基于 webpack-chain，具体 API
可参考 [webpack-api 的文档](https://github.com/mozilla-neutrino/webpack-chain)。

如下所示：

```js
export default {
  chainWebpack(memo, args) {
    return memo;
  },
};
```

该函数具有两个参数：

- `memo` 是现有 webpack 配置
- `args` 包含一些额外信息和辅助对象，目前有 `env` 和 `webpack`。`env` 为当前环境，值为 `development`
  或 `production`；`webpack` 为 webpack 对象，可从中获取 webpack 内置插件等

用法示例：

```js
export default {
  chainWebpack(memo, { env, webpack }) {
    // 设置 alias
    memo.resolve.alias.set('foo', '/tmp/to/foo');
    
    // 添加额外插件
    memo.plugin('hello').use(Plugin, [...args]);
    
    // 删除 Win 内置插件
    memo.plugins.delete('hmr');
  },
};
```

## codeSplitting

- **类型**：`{ jsStrategy: 'bigVendors' | 'depPerChunk' | 'granularChunks'; jsStrategyOptions: {} }`
- **默认值**：`null`
- **bundler**：`webpack`、`rsbuild`

用于配置 code splitting 的策略方案，WinJS 默认以路由为分界拆分 chunk，实现路由维度的 chunk 按需加载，如果在此之上希望继续提取公共
chunk，可以选择合适的策略进行配置，差异如下。

bigVendors 是大 vendors 方案，会将 async chunk 里的 node_modules 下的文件打包到一起，可以避免重复。同时缺点是，1）单文件的尺寸过大，2）毫无缓存效率可言。

depPerChunk 和 bigVendors 类似，不同的是把依赖按 package name + version 进行拆分，算是解了 bigVendors
的尺寸和缓存效率问题。但同时带来的潜在问题是，可能导致请求较多。我的理解是，对于非大型项目来说其实还好，因为，1）单个页面的请求不会包含非常多的依赖，2）基于
HTTP/2，几十个请求不算问题。但是，对于大型项目或巨型项目来说，需要考虑更合适的方案。

granularChunks 在 bigVendors 和 depPerChunk 之间取了中间值，同时又能在缓存效率上有更好的利用。无特殊场景，建议用
granularChunks 策略。

## compression

- **类型**： `object`
- **默认值**：`{}`

产物生成 gzip 格式，compression
插件的具体配置项，见 [compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin)

使用 Vite 模式时，见 [vite-plugin-compression2](https://github.com/nonzzz/vite-plugin-compression)

## conventionLayout

- **类型**：`boolean`
- **默认值**：`undefined`

`src/layouts/index.[tsx|vue|jsx|js]` 为约定式布局，默认开启。可通过配置 `conventionLayout: false` 关闭该默认行为。

## conventionRoutes

- **类型**：`{ base: string; exclude: RegExp[] }`
- **默认值**：`null`

修改默认的约定式路由规则，仅在使用 WinJS 约定式路由时有效，约定式路由也叫文件路由，就是不需要手写配置，文件系统即路由，通过目录和文件及其命名分析出路由配置。

使用约定式路由时，约定 `src/pages` 下所有的 `(j|t)sx、vue?` 文件即路由。

> 你可以从[约定式路由](../guides/routes#约定式路由)查看更多说明。

### base

`base` 用于设置约定的路由的基础路径，默认从 `src/pages` 读取，如果是文档站点可能会需要将其改成 `./docs`；

### exclude

你可以使用 `exclude` 配置过滤一些不需要的文件，比如用于过滤 components、models 等。

示例，

```js
export default {
  // 不识别 components 和 models 目录下的文件为路由
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//],
  }
}
```

## convertToRem

- **类型**： `boolean` | `object`
- **默认值**：`false`

通过设置 `winrc` 配置文件中的 `convertToRem`，WinJS 可进行如下处理：

- 将 CSS 中的 px 转成 rem
- 在 HTML 模版中插入运行时代码，对根元素 fontSize 进行设置

### Boolean 类型

当设置 `convertToRem` 为 `true`，将开启 rem 处理能力。

```js
export default {
  convertToRem: {}
};
```

此时，rem 配置默认如下：

```js
export default {
  enableRuntime: true,
  rootFontSize: 37.5,
  screenWidth: 375,
  maxRootFontSize: 64,
  widthQueryKey: '',
  excludeEntries: [],
  supportLandscape: false,
  useRootFontSizeBeyondMax: false,
  pxtorem: {
    rootValue: 37.5,
    unitPrecision: 2,
    propList: [
      'height',
      'line-height',
      'width',
      'padding',
      'margin',
      'top',
      'left',
      'right',
      'bottom',
      'font-size'
    ]
  }
};
```

### Object 类型

当 `convertToRem` 的值为 `object` 类型时，WinJS 会根据当前配置进行 rem 处理。

选项：

| 名称                       | 类型        | 默认值                                                                                                                                                                                                             | 描述                                                                      |
|--------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| enableRuntime            | `boolean` | `true`                                                                                                                                                                                                          | 是否自动生成 runtime 代码来动态计算根元素字体大小，并将 runtime 代码内联到 HTML 文件中                 |
| rootFontSize             | `number`  | `37.5`                                                                                                                                                                                                          | 根元素字体值                                                                  |
| maxRootFontSize          | `number`  | `64`                                                                                                                                                                                                            | 最大根元素字体值                                                                |
| widthQueryKey            | `string`  | `'' `                                                                                                                                                                                                           | 根据 widthQueryKey 的值去 url query 中取 client width                          |
| screenWidth              | `number`  | `375`                                                                                                                                                                                                           | UI 设计图宽度                                                                |
| supportLandscape         | `boolean` | `false`                                                                                                                                                                                                         | 横屏时使用 height 计算 rem                                                     |
| useRootFontSizeBeyondMax | `boolean` | `false`                                                                                                                                                                                                         | 超过 maxRootFontSize 时，是否使用 rootFontSize                                  |
| pxtorem                  | `object`  | <ul><li>rootValue。默认与 rootFontSize 相同 </li><li>unitPrecision: 2。精确位数 </li><li>propList: ['height', 'line-height', 'width','padding','margin', 'top','left','right','bottom','font-size']。支持转换的 CSS 属性</li></ul> | [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem#options) 插件属性 |

### 示例

```js
export default {
  convertToRem: {
    rootFontSize: 30,
    pxtorem: {
      propList: ['font-size']
    }
  }
};
``` 

## copy

- **类型**：`Array<string | { from: string; to: string; }>`
- **默认值**：`[]`

配置要复制到输出目录的文件或文件夹。

当配置字符串时，默认拷贝到产物目录，如：

```ts
export default {
  copy: ['foo.json', 'src/bar.json']
}
```

会产生如下产物的结构：

```
+ dist
  - bar.json
  - foo.json
+ src
  - bar.json
- foo.json
```

你也可以通过对象配置具体的拷贝位置，其中相对路径的起点为项目根目录：

```ts
export default {
  copy: [
    { from: 'from', to: 'dist/output' },
    { from: 'file.json', to: 'dist' }
  ]
}
```

此时将产生如下产物结构：

```
+ dist
  + output
    - foo.json
  - file.json
+ from
  - foo.json
- file.json
```

## crossorigin

- **类型**：`{ includes?: string[] }`
- **默认值**：`false`

配置 script 标签的 crossorigin。如果有声明，会为本地 script 加上 crossorigin="anonymous" 的属性。

关于参数。`includes` 参数可以为额外的非本地 script 标签加上此属性。

比如：

```js
export default {
  crossorigin: {}
}
```

然后输出的 HTML 中会有这些变化，

```diff
- <script src="/win.js"></script>
+ <script src="/win.js" crossorigin="anonymous"></script>
```

## cssMinifier

- **类型**：`string` 可选的值：`esbuild`, `cssnano`, `parcelCSS`, `none`
- **默认值**：`esbuild`
- **bundler**：`webpack`、`rsbuild`

配置构建时使用的 CSS 压缩工具; `none` 表示不压缩。

**注意**：使用 rsbuild 时，cssMinifier 默认为 `parcelCSS`，可选值为 `none`，且不支持切换其他的压缩器。

示例：

```js
export default {
  cssMinifier: 'esbuild'
}
```

## cssMinifierOptions

- **类型**：`Object`
- **默认值**：`{}`
- **bundler**：`webpack`

`cssMinifier` CSS 压缩工具配置选项。

**注意**：使用 rsbuild 时，cssMinifier 默认为 `parcelCSS`。配置需要参考 `parcelCSS`。

示例：

```js
export default {
  cssMinifier: 'esbuild',
  cssMinifierOptions: {
    minifyWhitespace: true,
    minifySyntax: true
  }
};
```

对应 CSS 压缩的配置请查看对应的文档。

- [esbuild 参考](https://esbuild.github.io/api/#minify)
- [cssnano 参考](https://cssnano.co/docs/config-file/)
- [parcelCSS 参考](https://github.com/parcel-bundler/parcel-css/blob/master/node/index.d.ts)

## cssPublicPath

- **类型**：`string`
- **默认值**：`./`
- **bundler**：`webpack`

为 CSS 中的图片、文件等外部资源指定自定义公共路径。作用类似于 `publicPath` 默认值是 `./`。

## cssLoader

- **类型**：`object`
- **默认值**：`{}`
- **bundler**：`webpack`

配置 css-loader ，详见 [css-loader > options](https://github.com/webpack-contrib/css-loader#options)

## cssLoaderModules

- **类型**：`object`
- **默认值**：`{}`
- **bundler**：`webpack`

配置 css modules 的行为，详见 [css-loader > modules](https://github.com/webpack-contrib/css-loader#modules)。

如：

```ts
cssLoaderModules: {
  // 配置驼峰式使用
  exportLocalsConvention: 'camelCase'
}
```

## deadCode

- **类型**：
  `{ patterns?: string[]; exclude?: string[]; failOnHint?: boolean; detectUnusedFiles?: boolean; detectUnusedExport?: boolean; context?: string }`
- **默认值**：`false`
- **bundler**：`webpack`

检测未使用的文件和导出，仅在 build 阶段开启。

比如：

```
deadCode: {}
```

然后执行 build，如有发现问题，会打印警告：

```
Warning: There are 1 unused files:
 1. /pages/index.module.less
 Please be careful if you want to remove them (¬º-°)¬.
```

可配置项：

- `patterns` : 识别代码的范围，如 `['src/pages/**']`
- `exclude` : 排除检测的范围，如 `['src/pages/utils/**']`
- `failOnHint` : 检测失败是否终止进程，默认 `false` 不终止
- `detectUnusedFiles` : 是否检测未使用的文件，默认 `true` 检测
- `detectUnusedExport` : 是否检测未使用的导出，默认 `true` 检测
- `context` : 匹配开始的目录，默认为当前项目根目录

## define

- **类型**：`Record<string, string>`
- **默认值**： 如下

```
  { 
    'process.env.NODE_ENV' : process.env.NODE_ENV,
    'process.env.HMR' : process.env.HMR, 
    'process.env.SOCKET_SERVER': process.env.ERROR_OVERLAY' 
  }
```

基于[define-plugin 插件](https://webpack.js.org/plugins/define-plugin/)设置代码中的可用变量。

::: tip 注意

1. 属性值会经过一次 `JSON.stringify` 转换。
2. key 值的替换是通过语法形式来匹配的，比如配置了 `{'a.b.c': 'abcValue'}` 是无法替换代码中的  `a.b?.c` 的。

:::

比如，

```
define: { FOO: 'bar' }
```

然后代码里的 `console.log(hello, FOO)` 会被编译成 `console.log(hello, 'bar')`。

当你在 ts 的项目中使用这些变量时，你需要在 typings 文件中声明变量类型，以支持 ts 类型提示，比如：

如果你的 typings 文件是全局的：

```ts
// typings.d.ts
declare const FOO: string;
```

如果你的 typings 文件是非全局的（包含了 import/export）：

```ts
// typings.d.ts
import './other.d.ts';

declare global {
  const FOO: string;
}
```

## devtool

- **类型**：`string`
- **默认值**：dev 时默认 `cheap-module-source-map`，build 时候默认无 sourcemap
- **bundler**：`webpack`、`rsbuild`

设置 sourcemap 生成方式。

常见可选值有：

- `eval`，最快的类型，缺点是不支持低版本浏览器
- `source-map`，最慢但最全的类型

示例，

```js
// 关闭 dev 阶段的 sourcemap 生成
devtool: false;

// 只设置 dev 阶段的 sourcemap
devtool: process.env.NODE_ENV === 'development' ? 'eval' : false;
```

## classPropertiesLoose

- **类型**：`object`
- **默认值**：`{}`

设置 babel class-properties 启用 loose。

主要影响类编译后，对属性的定义不同。loose=false 时，是使用 Object.defineProperty 定义属性，loose=ture，则直接使用赋值法定义。

::: tip 知识扩展
@babel/plugin-proposal-class-properties 是一个Babel插件，它的作用是提供对类属性的支持。

在早期的 JavaScript 版本中，类属性的定义通常需要在构造函数中使用 this 关键字来进行赋值，例如：

```js
class MyClass {
  constructor() {
    this.myProperty = 'Hello';
  }
}
```

然而，随着JavaScript语言的发展，提案中引入了类属性的语法，允许我们在类中直接定义属性，而无需通过构造函数来赋值。这样的语法更加简洁和直观，例如：

```js
class MyClass {
  myProperty = 'Hello';
}
```

然而，这种新的类属性语法在当前的JavaScript标准中还没有得到完全支持，因此需要使用Babel插件进行转换。

@babel/plugin-proposal-class-properties 插件就是为了提供对类属性语法的支持。它会将使用类属性语法定义的属性转换为与旧的构造函数赋值方式等效的代码，以确保在不支持类属性语法的环境中也能正常运行。

使用该插件，你可以在项目中使用类属性语法，享受更简洁的代码书写和可读性提升。同时，该插件还支持类静态属性的定义和初始化。

:::

## esbuildMinifyIIFE

- **类型**：`boolean`
- **默认值**：`false`
- **bundler**：`webpack`

修复 esbuild 压缩器自动引入的全局变量导致的命名冲突问题。

由于 WinJS 默认使用 esbuild 作为压缩器，该压缩器会自动注入全局变量作为 polyfill ，这可能会引发 异步块全局变量冲突、 qiankun
子应用和主应用全局变量冲突 等问题，通过打开该选项或切换 [`jsMinifier`](#jsminifier) 压缩器可解决此问题。

更多信息详见 [vite#7948](https://github.com/vitejs/vite/pull/7948) 。

示例,

```ts
esbuildMinifyIIFE: true
```

## externals

- **类型**：`Record<string, string> | Function`
- **默认值**：`{}`

设置哪些模块不打包，转而通过 `<script>` 或其他方式引入，通常需要搭配 [headScripts](#headscripts) 配置使用。

示例，

```
// external vue
externals: { vue: 'Vue' },
headScripts: ['https://unpkg.com/vue@3.3.4/dist/vue.global.js'],
```

## extraBabelIncludes

- **类型**：`Array<string | RegExp>`
- **默认值**：`[]`
- **bundler**：`webpack`、`rsbuild`

配置额外需要做 Babel 编译的 NPM 包或目录。比如：

```js
export default {
  extraBabelIncludes: [
    // 支持绝对路径
    join(__dirname, '../../common'),
    // 支持 npm 包
    'monaco-editor-vue',
    // 转译全部路径含有 @scope 的包
    /@scope/
  ],
};
```

::: tip 注意
`rsbuild` 只是为了保持配置的一致性，复用了此配置，对应的是 [include](https://rsbuild.dev/config/source/include) 。同时，对应了 `@rsbuild/plugin-babel` 的 `include` 配置项。
:::

## extraBabelExcludes <Badge type="tip" text=">=0.14.6" />

- **类型**：`Array<string | RegExp>`
- **默认值**：`[]`
- **bundler**：`webpack`、`rsbuild`

当项目中的`js`文件大小为超过了代码生成器 500KB 的限制，就会有如下警告：

`[BABEL] Note: The code generator has deoptimised the styling of /Volumes/liwb-ssd/xxx/with-vue2/src/assets/js/NIM_Web_SDK_v8.9.0.js as it exceeds the max of 500KB.
`
考虑到这种js文件其实也不需要经过 babel 编译，因此新增了此配置。用于不需要做 Babel 编译的 NPM 包或目录。

示例比如：

```js
export default {
  extraBabelExcludes: [
    // 支持绝对路径
    join(__dirname, '../../common'),
    // 支持 npm 包
    'monaco-editor-vue',
    // 转译全部路径含有 @scope 的包
    /@scope/
  ],
};
```

::: tip 注意
`rsbuild` 只是为了保持配置的一致性，复用了此配置，对应的是 [exclude](https://rsbuild.dev/config/source/exclude) 。同时，对应了 `@rsbuild/plugin-babel` 的 `exclude` 配置项。
:::


## extraBabelPlugins

- **类型**：`string[] | Function`
- **默认值**：`[]`

配置额外的 babel 插件。可传入插件地址或插件函数。

## extraBabelPresets

- **类型**：`string[] | Function`
- **默认值**：`[]`

配置额外的 babel 插件集。可传入插件集地址或插件集函数。

## extraPostCSSPlugins

- **类型**：`PostCSSPlugin[]`
- **默认值**：`[]`

配置额外的 postcss 插件。

## exportStatic

- **类型**：`{ extraRoutePaths: IUserExtraRoute[] | (() => IUserExtraRoute[] | Promise<IUserExtraRoute[]>) }`
- **默认值**：`undefined`
- **bundler**：`webpack`

开启该配置后会针对每个路由单独输出 HTML 文件，通常用于静态站点托管。例如项目有如下路由：

```bash
/
/docs
/docs/a
```

不开启 `exportStatic` 时会输出：

```bash
dist/index.html
```

开启 `exportStatic` 时会输出：

```bash
dist/index.html
dist/docs/index.html
dist/docs/a/index.html
```

通过 `extraRoutePaths` 子配置项可以产出额外的页面，通常用于动态路由静态化。例如有如下路由：

```bash
/news/:id
```

默认情况下只会输出 `dist/news/:id/index.html`，但可以通过配置 `extraRoutePaths` 将其静态化：

```ts
// .winrc.ts
export default {
  exportStatic: {
    // 配置固定值
    extraRoutePaths: ['/news/1', '/news/2'],
    // 也可以配置函数动态获取
    // extraRoutePaths: async () => {
    //   const res = await fetch('https://api.example.com/news');
    //   const data = await res.json();
    //   return data.map((item) => `/news/${item.id}`);
    // },
  },
}
```

此时输出文件会变成：

```bash
dist/news/:id/index.html
dist/news/1/index.html
dist/news/2/index.html
```

`extraRoutePaths` 除了支持配置字符串数据，还可以配置成对象数组，用于启用 SSR 时又希望对部分路由禁用预渲染的场景，例如：

```ts
// .winrc.ts
export default {
  exportStatic: {
    // 输出额外页面文件但跳过预渲染
    extraRoutePaths: [{ path: '/news/1', prerender: false }],
  },
}
```

## favicons

- **类型**：`string[]`
- **默认值**：`null`

默认情况下，网站会使用约定的 [`favicon`](../guides/directory-structure#favicon) 并在 meta 头标签中创建图标。

通过如下方式自定义：

```js
favicons: [
  // 完整地址
  'https://domain.com/favicon.ico',
  // 此时将指向 `/favicon.png` ，确保你的项目含有 `public/favicon.png`
  '/favicon.png'
]
```

## forkTSChecker

- **类型**：`object`
- **默认值**：`null`
- **bundler**：`webpack`、`rsbuild`

开启 TypeScript 的类型检查。基于
fork-ts-checker-webpack-plugin，配置项可参考 [fork-ts-checker-webpack-plugin 的 Options](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options)。

## ftpOptions

- **类型**： `object`
- **默认值**：`{}`

通过 FTP
工具将本地文件上传到目标服务器。具体参数可以参考 [ftp-deploy](https://www.npmjs.com/package/@winner-fed/ftp-deploy)

示例，

```js
export default {
  ftpOptions: {
    user: 'xxxx',
    password: 'xxxxxx',
    host: 'xxxx',
    port: 22,
    localPath: path.join(__dirname, '/resource'),
    remotePath: '/home/web/outhtml/deploy-test',
    // include: ["*", "**/*"],      // this would upload everything except dot files
    include: ['*'],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    exclude: ['dist/**/*.map', 'node_modules/**', 'node_modules/**/.*', '.git/**'],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: true
  }
}

```

## hash

- **类型**：`boolean`
- **默认值**：`false`

开启 hash 模式，让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。

启用后，产物通常是这样，

```
+ dist
    - logo.sw892d.png
    - win.df723s.js
    - win.8sd8fw.css
    - index.html
```

注意：HTML 文件始终没有 hash 后缀。

:::tip 提示
**没有 hash 的危害**

如果名字没有 hash 就使得需要对针对静态资源文件，如 win.js 文件配置单独的 Nginx 或者网关或者 CDN
响应头，标识它为无缓存的，这就导致用户每次都要全量下载 win.js，假如有很多应用，就要配置无数多次响应头配置到各个应用，并且每次打开网页都要加载大量的无缓存
win.js 。

**为什么 hash 是友好的**
目前市面上或者企业内 CDN 广泛默认的配置就是对 JS 文件有长期的缓存头，这就要求把 js 文件都带上 hash ，所以在 mf 的场景，所有的
remote.[hash].js 的地址 url 应该从统一的配置中心获取后来下发，每次构建后配置中心同步变更对应带 hash 值的 url
，否则使用该功能的用户大概率就会出现 remote.js 有缓存不更新的情况，并且他们很有可能无法调整 网关、CDN、Nginx 的响应情况或者很难调整，所以带
hash 是友好的。
:::

## headScripts

- **类型**：`string[] | Script[]`
- **默认值**：`[]`

配置 `<head>` 中的额外 script。

1. 当 `headScripts` 对象的值为字符串时, 会自动区分配置支持内联样式和外联样式路径 后者通过是否以 `https?://` 开头来判断。

比如，

```js
export default {
  headScripts: [`alert(1);`, `https://a.com/b.js`],
}
```

会生成 HTML，

```html

<script>
  alert(1);
</script>
<script src="https://a.com/b.js"></script>
```

2. 当 `headScripts` 对象的值为对象时，可以配置额外的属性。

类型定义：

```ts
export interface Script {
  // 外联脚本
  src?: string;
  // 内联脚本
  content?: string;
  type?: string;
  charset?: string;
  defer?: boolean;
  async?: boolean;
  crossOrigin?: string;
  integrity?: string;
}
```

举个例子，

```js
export default {
  headScripts: [
    { src: '/foo.js', defer: true },
    { content: `alert('你好');`, charset: 'utf-8' }
  ]
};
```

会生成 HTML，

```html
<head>
  <script src="/foo.js" defer></script>
  <script charset="utf-8">
    alert('你好');
  </script>
</head>
```

## history

- **类型**：`{ type: 'browser' | 'hash' | 'memory' }`
- **默认值**：`{ type: 'browser' }`

设置路由 history 类型。

- **browser**，对应 [createWebHistory](https://router.vuejs.org/zh/api/#Functions-createWebHistory)
- **hash**，对应 [createWebHashHistory](https://router.vuejs.org/zh/api/#Functions-createWebHashHistory)
- **memory**，对应 [createMemoryHistory](https://router.vuejs.org/zh/api/#Functions-createMemoryHistory)
  ::: tip 说明
  `memory` 在 Vue Router 3.x 则对应的是 [abstract](https://v3.router.vuejs.org/zh/api/#mode)
  。可以参考 [从 Vue2 迁移](https://router.vuejs.org/zh/guide/migration/#%E6%96%B0%E7%9A%84-history-%E9%85%8D%E7%BD%AE%E5%8F%96%E4%BB%A3-mode)
  :::

## https

- **类型**：`{ cert: string; key: string; hosts: string[]; http2?: boolean }`
- **默认值**：`{ hosts: ['127.0.0.1', 'localhost'] }`

开启 dev 的 https 模式，WinJS 默认使用 [`mkcert`](https://github.com/FiloSottile/mkcert) 快捷创建证书，请确保已经安装。

关于参数。

- `cert` 和 `key` 分别用于指定 cert 和 key 文件。
- `hosts` 用于指定要支持 https 访问的 host，默认是 `['127.0.0.1', 'localhost']`。
- `http2` 用于指定是否使用 HTTP 2.0 协议，默认是 true（使用 HTTP 2.0 在 Chrome 或 Edge
  浏览器中中有偶然出现 `ERR_HTTP2_PROTOCOL_ERRO`报错，如有遇到，建议配置为 false）。

示例，

```js
https: {
}
```

## icons

- **类型**：`{ include: string[] }`
- **默认值**：`false`

通过 WinJS 导出的 IconWin 组件快捷地引用本地的 icon。

- `include` 用于额外需要使用此方案解析的 svg 文件。注意需要使用**绝对路径**。

::: warning 注意
Vue2 想继续使用 SvgIcon 组件方案，可以安装 [`@winner-fed/plugin-icons-legacy`](../plugins/iconslegacy.md) 包。该方案底层依赖了
`svg-sprite-loader` 实现。该方案在 WinJS >= 0.10.0 不再内置。
:::

### 用法

在 WinJS 配置文件设置，开启 icons 功能。

```ts
icons: {
}
```

本地 svg icon 的使用需要把 svg 保存在 `src/icons` 目录下，比如在 `src/icons` 目录下有个 `dog.svg`，然后可以这样引用。

需要注意的是，如果 svg 文件是由多个单词连接，在当做组件使用时，`name` 则统一使用小驼峰的方式。如 svg 文件名为 `cat-dog.svg`
，则 WinIcon 使用时，`<icon-win name="catDog" />`

```tsx
// 可以直接使用 IconWin，作为全局组件使用。WinJS 已做自动注册
<icon-win name="dog" />
```

#### 局部引用

```tsx
import { IconWin } from 'winjs';

<icon-win icon="dog" />
```

## ignoreMomentLocale

- **类型**：`boolean`
- **默认值**：`true`
- **bundler**：`webpack`、`rsbuild`

忽略 moment 的 locale 文件，用于减少产物尺寸。

注意：此功能默认开。配置 `ignoreMomentLocale: false` 关闭。

## inlineLimit

- **类型**：`number`
- **默认值**：`10000` (10k)

配置图片文件是否走 base64 编译的阈值。默认是 10000 字节，少于他会被编译为 base64 编码，否则会生成单独的文件。

## inspectConfig

- **类型**：`{ verbose: boolean; outputPath: string; }`
- **默认值**：`false`
- **bundler**：`webpack`、`rsbuild`

获取 Webpack 生成的 Webpack 配置、Rsbuild 内部生成的 Rsbuild 配置和 Rspack 配置，将它们序列化为字符串，并支持写入到磁盘上。

- verbose：在结果中展示函数的完整内容。
- outputPath：指定输出路径。

## jsMinifier

- **类型**：`string`，可选值 `esbuild`, `terser`, `swc`, `uglifyJs`, `none`
- **默认值**：`esbuild`
- **bundler**：`webpack`、`rsbuild`

配置构建时压缩 JavaScript 的工具；`none`表示不压缩。

**注意**：使用 rsbuild 时，jsMinifier 默认为 `swc`，可选值为 `none`，且不支持切换其他的压缩器。

示例：

```ts
export default {
  jsMinifier: 'esbuild'
}
```

## jsMinifierOptions

- **类型**：`object`
- **默认值**：`{}`
- **bundler**：`webpack`、`rsbuild`

`jsMinifier` 的配置项；

默认情况下压缩代码会移除代码中的注释，可以通过对应的 `jsMinifier` 选项来保留注释。

**注意**：使用 rsbuild 时，jsMinifier 默认为 `swc`。配置需要参考 `swc`。

示例：

```js
export default {
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true
  }
};
```

配置项需要和所使用的工具对应，具体参考对应文档：

- [esbuild 参考](https://esbuild.github.io/api/#minify)
- [terser 参考](https://terser.org/docs/api-reference#minify-options)
- [swc 参考](https://swc.rs/docs/configuration/minification#configuration)
- [uglifyJs 参考](https://lisperator.net/uglifyjs/compress)

## lessLoader

- **类型**：`Object`
- **默认值**：`{ modifyVars: userConfig.theme, javascriptEnabled: true }`

设置 less-loader 的
Options。具体参考参考 [less-loader 的 Options](https://github.com/webpack-contrib/less-loader#lessoptions)。

> 默认是用 less@4 版本，如果需要兼容 less@3 请配置使用[less-options-math](https://lesscss.org/usage/#less-options-math)。

## legacy

- **类型**：`{ buildOnly?: boolean; nodeModulesTransform?: boolean; checkOutput?: boolean; }`
- **默认值**：`false`

当你需要兼容低版本浏览器时，可能需要该选项，开启后将默认使用 **非现代** 的打包工具做构建，这会显著增加你的构建时间。

```ts
legacy: {
}
```

默认只在构建时生效，通过设定 `buildOnly: false` 关闭该限制。

可通过打开 `checkOutput: true` 选项，每次构建结束后将自动运行 [`es-check`](https://github.com/yowainwright/es-check)
检查产物 `.js` 文件的语法是否为 es5 格式。

开启此选项后：

- 不支持自定义 `srcTranspiler` 、`jsMinifier` 、 `cssMinifier` 选项。
- 将转译全部 `node_modules` 内的源码，`targets` 兼容至 ie 11 ，通过指定 `nodeModulesTransform: false`
  来取消对 `node_modules` 的转换，此时你可以通过配置 `extraBabelIncludes` 更精准的转换那些有兼容性问题的包。
- 因低版本浏览器不支持 Top level await ，当你在使用 `externals`
  时，确保你没有在使用异步性质的 [`externalsType`](https://webpack.js.org/configuration/externals/#externalstype)
  时又使用了同步导入依赖。

## links

- **类型**：`Link[]`
- **默认值**：`[]`

配置额外的 link 标签。通过数组对象的形式, 会将该对象的 key: value 映射为 link 标签的属性 link 属性详见 [MDN link](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/link)。

示例，

```js
export default {
  links: [{ href: '/foo.css', rel: 'preload' }],
}
```

会生成 HTML，

```html
<head>
  <link href="/foo.css" rel="preload">
</head>
```

## manifest

- **类型**：`{ fileName: string; basePath: string }`
- **默认值**：`null`

开启 build 时生成额外的 manifest 文件，用于描述产物。

关于参数。`fileName` 是生成的文件名，默认是 `asset-manifest.json`；`basePath` 会给所有文件路径加上前缀。

注意：只在 build 时生成。

## mdx

- **类型**：`{ loader: string; loaderOptions: Object }`
- **默认值**：`{}`
- **bundler**：`webpack`

mdx loader 配置 loader 配置路径，[loaderOptions](https://github.com/mdx-js/mdx/blob/v1/packages/mdx/index.js#L12) 配置参数。

rsbuild 的相关插件可以参考：[@rsbuild/plugin-mdx](https://github.com/rspack-contrib/rsbuild-plugin-mdx)。可以自行配置，

## metas

- **类型**：`Meta[]`
- **默认值**：`[]`

配置额外的 meta 标签。meta 属性详见 [MDN meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)。

比如，

```js
export default {
  metas: [
    { name: 'keywords', content: 'win, winjs' },
    { name: 'description', content: 'Vue framework.' },
  ],
}
```

会生成以下 HTML，

```html

<meta name="keywords" content="win, winjs" />
<meta name="description" content="Vue framework." />
```

## mfsu

- **类型**：
  `{ esbuild: boolean; mfName: string; cacheDirectory: string; strategy: 'normal' | 'eager'; include?: string[]; chainWebpack: (memo, args) => void; exclude?: Array<string | RegExp> }`
- **默认值**：`{ mfName: 'mf', strategy: 'normal' }`
- **bundler**: `webpack`

配置基于 [Module Federation](https://module-federation.github.io/) 的提速功能。

关于参数

- `esbuild` 配为 `true` 后会让依赖的预编译走 esbuild，从而让首次启动更快，缺点是二次编译不会有物理缓存，稍慢一些；推荐项目依赖比较稳定的项目使用。
- `mfName` 是此方案的 remote 库的全局变量，默认是 mf，通常在微前端中为了让主应用和子应用不冲突才会进行配置
- `cacheDirectory` 可以自定义缓存目录，默认是 `node_modules/.cache/mfsu`
- `chainWebpack` 用链式编程的方式修改 依赖的 webpack 配置，基于 webpack-chain，具体 API
  可参考 [webpack-api 的文档](https://github.com/sorrycc/webpack-chain)；
- `runtimePublicPath` 会让修改 mf 加载文件的 publicPath 为 `window.publicPath`
- `strategy` 指定 mfsu 编译依赖的时机; `normal` 模式下，采用 babel 编译分析后，构建 Module Federation 远端包；`eager`
  模式下采用静态分析的方式，和项目代码同时发起构建。
- `include` 仅在 `strategy: 'eager' ` 模式下生效， 用于补偿在 eager 模式下，静态分析无法分析到的依赖，例如 `react` 未进入
  Module Federation 远端模块可以这样配置 `{ include: [ 'react' ] }`
- `exclude` 手动排除某些不需要被 MFSU 处理的依赖, 字符串或者正则的形式，比如 `vant` 不希望走 MFSU
  处理，可以配置 `{ exclude: [ 'vant' ] }` 匹配逻辑为全词匹配，也可以配置 `{ exclude: [ /vant/ ] }` 只要 `import`
  路径中匹配该正则的依赖都不走 MFSU 处理
- `remoteHash` 默认情况下，当用户开启 `hash: true` 时， MF 产物中入口文件将自动携带 hash ，如 `remote.123abc.js`
  ，可通过设定 `remoteHash: false` 关闭（将得到 `remote.js` ），此时你可能需要修改 nginx / CDN / 网关
  的响应头配置来去除该 `remote.js` 文件的缓存，否则新构建将无法生效。

示例，

```js
export default {
  // 用 esbuild 做依赖预编译
  mfsu: {
    esbuild: true,
  }
}

export default {
  // 关闭 mfsu 功能
  mfsu: false
}
```

```js
export default {
  // webpack 配置修改
  mfsu: {
    chainWebpack(memo, args) {
      // 添加额外插件
      memo.plugin('hello').use(Plugin, [...args]);
      return memo;
    }
  }
}

```

注意：此功能默关闭。配置 `mfsu: {}` 开启。

## mock

- **类型**：`{ exclude: string[], include: string[] }`
- **默认值**：`{}`

配置 mock 功能。

关于参数。`exclude` 用于排除不需要的 mock 文件；`include` 用于额外添加 mock 目录之外的 mock 文件。

示例，

```js
export default {
  // 让所有 pages 下的 _mock.ts 文件成为 mock 文件
  mock: {
    include: ['src/pages/**/_mock.ts'],
  }
}
```

注意：此功能默认开。配置 `mock: false` 关闭。

## mountElementId

- **类型**：`string`
- **默认值**：`'root'`

配置 Vue 组件树渲染到 HTML 中的元素 id。

示例，

```js
mountElementId: 'container'
```

## monorepoRedirect

- **类型**：`{ srcDir?: string[], exclude?: RegExp[], peerDeps?: boolean, useRootProject?: boolean }`
- **默认值**：`false`

在 monorepo 中使用 WinJS
时，你可能需要引入其他子包的组件、工具方法等，通过开启此选项来重定向这些子包的导入到他们的源码位置（默认为 `src`
文件夹），这也可以解决 `MFSU` 场景改动子包不热更新的问题。

这种重定向的好处是：支持热更新，无需预构建其他子包即可进行开发。

通过配置 `srcDir` 来调整识别源码文件夹的优先位置，通过 `exclude` 来设定不需要重定向的依赖范围。

示例：

```js
export default {
  // 默认重定向到子包的 src 文件夹
  monorepoRedirect: {}
}
export default {
  // 在子包中寻找，优先定向到 libs 文件夹
  monorepoRedirect: {
    srcDir: ['libs', 'src'],
  }
}
export default {
  // 不重定向 @scope/* 的子包
  monorepoRedirect: {
    exclude: [/^@scope\/.+/],
  }
}
```

在实际的大型业务 monorepo 中，每个子包的依赖都是从他们的目录开始向上寻找 `node_modules`
并加载的，但在本地开发时，依赖都安装在 `devDependencies` ，和从 npm 上安装表现不一致，所以不可避免会遇到多实例问题。

::: tip 说明
举个例子，每个子包在本地开发时都需要 `win-ui` ，在 `devDependencies` 中安装了，也在 `peerDependencies` 中指明了 `win-ui`
，我们预期该包发布到 npm ，被某个项目安装后， `win-ui` 是使用的项目本身的依赖，全局唯一，但由于在 monorepo
中，指定在 `devDependencies` 中的依赖必定存在，且子包代码寻找依赖时是从该子包进行的，导致了每个子包都用了自己的 `win-ui`
，出现了产物中有多份 `win-ui` 、产物体积增大、消息队列被破坏等情况。
:::

为了解决这种问题，我们约定：

当打开 `peerDeps` 选项时，所有子包指明的 `peerDependencies` 都会被自动添加 `alias` 重定向唯一化，避免多实例的存在：

```ts
monorepoRedirect: {
  peerDeps: true
}
```

经过重定向，依赖全局唯一，便可以在开发时保持和在 npm 上安装包后的体验一致。

useRootProject: 当你的项目不在 monorepo 子文件夹里，而在 monorepo 根的话，你可以开启这个选项，以使 monorepoRedirect 生效。

## mpa

- **类型**：`object`
- **默认值**：`false`
- **bundler**：`webpack`

启用 [mpa 模式](../guides/mpa)。

## outputPath

- **类型**：`string`
- **默认值**：`dist`

配置输出路径。

注意：不允许设定为 src、public、pages、mock、config、locales、models 等约定式功能相关的目录。

## phantomDependency

- **类型**：`{ exclude: string[] }`
- **默认值**：`false`

执行幽灵依赖检测。

当使用未在 package.json 中声明的依赖，以及也没有通过 alias 或 externals 进行配置时，会抛错并提醒。

如遇到有需要需做白名单处理，可通过 exclude 配置项实现，exclude 的项是 npm 依赖的包名。

```ts
export default {
  phantomDependency: {
    exclude: ['lodash']
  }
}
```
::: tip 说明
对 `pnpm` 不适用。
这是因为 pnpm 使用了严格的依赖管理机制，它创建了一个非扁平化的 node_modules 结构，并通过符号链接方式来管理依赖。在 pnpm 中：
1. 依赖被安装在一个集中的存储位置
2. 项目的直接依赖通过符号链接放置在 node_modules 目录下
3. 非直接依赖不会被放在项目的 node_modules 顶层目录中

这种机制使得项目只能访问到 package.json 中显式声明的依赖包，自动防止了"幻影依赖"问题。幻影依赖是指项目代码中使用了未在 package.json 中声明的依赖，这在 npm 和 yarn 的扁平化依赖结构中是可能发生的。
相比之下，npm 和 yarn 使用扁平化的依赖树，所有依赖（包括传递依赖）都会被提升到顶层 node_modules 目录，使得项目可以意外地使用未声明的依赖。
因此，当使用 pnpm 时，这个检查是多余的，因为 pnpm 的依赖管理机制本身就能防止幻影依赖问题。
:::

## plugins

- **类型**：`string[]`
- **默认值**：`[]`

配置额外的 WinJS 插件。

数组项为指向插件的路径，可以是 npm 依赖、相对路径或绝对路径。如果是相对路径，则会从项目根目录开始找。

示例，

```js
export default {
  plugins: [
    // npm 依赖
    'win-plugin-hello',
    // 相对路径
    './plugin',
    // 绝对路径
    `${__dirname}/plugin.js`,
  ],
}
```

## polyfill

- **类型**：`{ imports: string[] }`
- **默认值**：`{}`

设置按需引入的 polyfill。默认全量引入。

比如只引入 core-js 的 stable 部分，

```js
export default {
  polyfill: {
    imports: ['core-js/stable'],
  }
}
```

如果对于性能有更极致的要求，可以考虑按需引入，

```js
export default {
  polyfill: {
    imports: ['core-js/features/promise/try', 'core-js/proposals/math-extensions'],
  }
}
```

注意：此功能默认开。配置 `polyfill: false` 或设置环境变量 `BABEL_POLYFILL=none` 关闭。

## postcssLoader

- **类型**：`object`
- **默认值**：`{}`

设置 [postcss-loader 的配置项](https://github.com/webpack-contrib/postcss-loader#options)。

## presets

- **类型**：`string[]`
- **默认值**：`[]`

配置额外的 WinJS 插件集。

数组项为指向插件集的路径，可以是 npm 依赖、相对路径或绝对路径。如果是相对路径，则会从项目根目录开始找。

示例，

```js
export default {
  presets: [
    // npm 依赖
    'win-preset-hello',
    // 相对路径
    './preset',
    // 绝对路径
    `${__dirname}/preset.js`,
  ],
}
```

## preloading

- **类型**：`{ title: string; subtitle: string; } | boolean`
- **默认值**：`{ title: '正在加载资源', subtitle: '初次加载资源可能需要较多时间 请耐心等待'}`

loading 占位，解决页面首次加载时白屏的问题。如果不想使用该功能，设置为 `false` 即可。

::: tip 说明
当我们发现需要调整 preloading 的样式时，推荐使用以下方式：

在项目中的 `plugin.ts` 文件中，添加重置样式的代码，举个例子，

```ts
 api.addHTMLStyles(
  () => `
    .loading-title {
      color: #000 !important;
    }
    .win-spin-dot-item { background-color: #F9373F !important; }
  `
);
```

:::

## proxy

- **类型**：`object`
- **默认值**：`{}`

配置代理功能。

比如，

```js
export default {
  proxy: {
    '/api': {
      'target': 'http://jsonplaceholder.typicode.com/',
      'changeOrigin': true,
      'pathRewrite': {
        '^/api': ''
      }
    }
  }
};

```

然后访问 `/api/users` 就能访问到 http://jsonplaceholder.typicode.com/users 的数据。

注意：proxy 功能仅在 dev 时有效。

## publicPath

- **类型**：`string`
- **默认值**：`/`
- **bundler**：`webpack`、`rsbuild`

配置 webpack 的 publicPath 和 rsbuild 的 [output.assetPrefix](https://rsbuild.dev/zh/config/output/asset-prefix)

## routes

- **类型**：`Route[]`
- **默认值**：`[]`

配置路由。更多信息，请查看 [配置路由](../guides/routes#配置路由)

## rsbuild <Badge type="tip" text=">=0.9.4" />

- **类型**：
  `{ removeConsole: boolean | ConsoleType[], lightningcssLoader: boolean | Rspack.LightningcssLoaderOptions | Function, config: RsbuildConfig }`
- **默认值**：`false`

切换 rsbuild 构建打包工具。rsbuild 的相关配置选项。

- removeConsole: 在生产环境 build 阶段构建时，是否自动移除代码中的 `console.[methodName]`。默认为 `false`。 当
  removeConsole 被设置为 true 时，会移除所有类型的 `console.[methodName]`。
- lightningcssLoader: 参考 [lightningcssLoader](https://rsbuild.dev/zh/config/tools/lightningcss-loader)。默认为 `true`。
- config(<Badge type="tip" text=">=0.11.20" />):
  完整且官方的 [rsbuild config](https://rsbuild.dev/zh/guide/basic/configure-rsbuild)，可用于覆盖其他配置，优先级高于其他配置。考虑到后期可能会有自定义
  rsbuild 的配置，因此将此配置开放。

```js
export default {
  rsbuild: {
    removeConsole: true
  }
}
```

你也可以指定仅移除特定类型的 `console.[methodName]`，比如移除 `console.log` 和 `console.warn`。

```js
 export default {
  rsbuild: {
    removeConsole: ['log', 'warn'],
  },
};
```

目前支持配置以下类型的 console：

```ts
type ConsoleType = 'log' | 'info' | 'warn' | 'error' | 'table' | 'group';
```

## run

- **类型**：`{ globals: string[] }`
- **默认值**：`null`

run 命令的全局注入配置。添加`['zx/globals']`，在使用`win run ./script.ts`的时候，win会自动注入`import 'zx/globals';`
，从而省略掉每个脚本都要写`import 'zx/globals';`。

## runtimePublicPath

- **类型**：`object`
- **默认值**：`null`
- **bundler**：`webpack`

启用运行时 publicPath，开启后会使用 `window.publicPath` 作为资源动态加载的起始路径。

比如，

```js
export default {
  runtimePublicPath: {},
}
```

## scripts

- **类型**：`string[] | Script[]`
- **默认值**：`[]`

配置 `<body>` 中额外的 script 标签。
 
1. 当值为字符串时，会自动区分配置支持内联样式和外联样式路径 后者通过是否以 https?:// 开头来判断。
比如，

```js
export default {
  scripts: [`alert(1);`, `https://a.com/b.js`],
}
```

会生成 HTML，

```html

<script>
  alert(1);
</script>
<script src="https://a.com/b.js"></script>
```

2. 如果需要额外属性，切换到对象格式。 

类型：

```ts
export interface Script {
  // 外联脚本
  src?: string;
  // 内联脚本
  content?: string;
  type?: string;
  charset?: string;
  defer?: boolean;
  async?: boolean;
  crossOrigin?: string;
  integrity?: string;
}
```

比如，

```js
export default {
  scripts: [
    { src: '/foo.js', defer: true },
    { content: `alert('你好');`, charset: 'utf-8' },
  ],
}
```

会生成 HTML，

```html
<body>
  <script src="/foo.js" defer></script>
  <script charset="utf-8">
    alert('你好');
  </script>
</body>
```

## sassLoader

- **类型**：`object`
- **默认值**：`{}`

配置 sass-loader ，详见 [sass-loader > options](https://github.com/webpack-contrib/sass-loader#options)

## styleLoader

- **类型**：`object`
- **默认值**：`false`

启用 style loader 功能，让 CSS 内联在 JS 中，不输出额外的 CSS 文件。

## stylusLoader

- **类型**：`object`
- **默认值**：`{}`
- **bundler**：`webpack`、`rsbuild`

配置 stylus-loader ，详见 [stylus-loader > options](https://github.com/webpack-contrib/stylus-loader#options)

## styles

- **类型**：`string[]`
- **默认值**：`[]`

配置额外的 CSS。

1. 当为字符串时，配置项支持内联样式和外联样式路径，后者通过是否以 `https?://` 开头来判断。

插入的样式会前置，优先级低于项目内用户编写样式。

比如：

```js
export default {
  styles: [`body { color: red; }`, `https://a.com/b.css`],
}
```

会生成以下 HTML，

```html

<style>
  body {
    color: red;
  }
</style>
<link rel="stylesheet" href="https://a.com/b.css" />
```

2. 当需要配置额外的属性时，可以使用对象的形式。

比如，

```js
export default {
  styles: [
    {
      // 外联样式
      src: 'https://a.com/b.css',
      // 添加额外属性
      crossorigin: 'anonymous',
      media: 'screen and (min-width: 900px)'
    },
    {
      // 内联样式
      content: 'body { color: red }',
      // 添加额外属性
      media: 'print',
      'data-dark': true
    }
  ],
}
```

会生成以下 HTML，

```html

<link
  rel="stylesheet"
  href="https://a.com/b.css"
  crossorigin="anonymous"
  media="screen and (min-width: 900px" />
<style media="print" data-theme>
  body {
    color: red;
  }
</style>
```

## srcTranspiler

- **类型**：`string` 可选的值：`babel`, `swc`, `esbuild`
- **默认值**：`babel`
- **bundler**：`webpack`

配置构建时转译 js/ts 的工具。

## srcTranspilerOptions

- **类型**：`{ swc?: SwcConfig, esbuild?: EsbuildConfig }`
- **默认值**：`undefined`
- **bundler**：`webpack`

如果你使用了 `swc` / `esbuild` 作为 `srcTranspiler`
转译器，你可以通过此选项对转译器做进一步的配置，详见 [SwcConfig](https://swc.rs/docs/configuration/swcrc) 、 [EsbuildConfig](https://esbuild.github.io/api/#transform-api)
配置文档。

如给 swc 添加其他的插件：

```ts
export default {
  srcTranspilerOptions: {
    swc: {
      jsc: {
        experimental: {
          plugins: [
            [
              '@swc/plugin-styled-components',
              {
                displayName: true,
                ssr: true,
              },
            ],
          ],
        },
      },
    },
  }
}
```

## targets

- **类型**：`object`
- **默认值**：`{ chrome: 80 }`

配置需要兼容的浏览器最低版本。WinJS 会根据这个自定义引入 polyfill、配置 autoprefixer 和做语法转换等。

示例，

```js
export default {
  // 兼容 ie11
  targets: {
    ie: 11
  }
}
```

## theme

- **类型**：`object`
- **默认值**：`{}`

配置 less 变量主题。

示例：

```js
export default {
  theme: {
    '@primary-color': '#1DA57A'
  }
}
```

## title

- **类型**：`string`
- **默认值**：`null`

配置全局页面 title，暂时只支持静态的 Title。

## transformImport <Badge type="tip" text="^0.14.3" />
- **类型:**

```ts
type TransformImport = Array<{
  libraryName: string;
  libraryDirectory?: string;
  style?: string | boolean;
  styleLibraryDirectory?: string;
  camelToDashComponentName?: boolean;
  transformToDefaultImport?: boolean;
  customName?: string;
  customStyleName?: string;
}>;
```

- **默认值:** `{}`

转换 import 的路径，可以用于模块化引用三方包的子路径，能力类似于 [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)。

### 示例

- 按需引入 antd 组件

在使用 antd 组件库时（低于 v5 版本），你可以通过以下配置来按需引入组件：

```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'antd',  // [!code ++]
      libraryDirectory: 'es',  // [!code ++]
      style: 'css',  // [!code ++]
    },
  ],
});
```
源代码如下：
```ts
import { Button } from 'antd';
```

会被转换成：

```ts
import Button from 'antd/es/button';
import 'antd/es/button/style';
```

- 按需引入 lodash
  在使用 lodash 时，你可以通过 `transformImport` 来自动引用子路径，减小包体积。

```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'lodash',  // [!code ++]
      customName: 'lodash/{{ member }}',  // [!code ++]
    },
  ],
});
```

源代码如下：

```ts
import { get } from 'lodash';
```
会被转换成：

```ts
import get from 'lodash/get';
```

请避免以下用法，否则会引入所有的 lodash 代码：

```ts
import _ from 'lodash';
import lodash from 'lodash';
```
### 适用范围
`transformImport` 只适用于经过 bundler 编译的模块。需要注意的是，WinJS 默认并不会编译位于 node_modules 目录下的 JavaScript 文件。这意味着，node_modules 目录内的代码将不会被 `transformImport` 处理。
如果你希望通过 `transformImport` 对 node_modules 下的代码进行处理，请将相关模块添加到 配 [extraBabelIncludes](#extrababelincludes) 配置中。

### libraryName
- **类型:**  `string`

用于指定需要按需加载的模块名称。当 WinJS 遍历代码时，如果遇到了对应模块的 import 语句，则会对其进行转换。

### libraryDirectory
- **类型:**  `string`
- **默认值:** `'lib'`
  用于拼接转换后的路径，拼接规则为 `${libraryName}/${libraryDirectory}/${member}`，其中 member 为引入成员。

示例：
```ts
import { Button } from 'foo';
```

转换结果

```ts
import Button from 'foo/lib/button';
```

### style
- **类型:**  `string`
- **默认值:** `undefined`

确定是否需要引入相关样式，若为 `true`，则会引入路径 `${libraryName}/${libraryDirectory}/${member}/style`。若为 `false` 或 `undefined` 则不会引入样式。
当配置为 `true` 时：

```ts
import { Button } from 'foo';
```

转换结果

```ts
import Button from 'foo/lib/button';
import 'foo/lib/button/style';
```

### styleLibraryDirectory

- **类型:**  `string`
- **默认值:** `undefined`

用于拼接引入样式时的引入路径，若该配置被指定，则 `style` 配置项会被忽略。拼接引入路径为 `${libraryName}/${styleLibraryDirectory}/${member}`。
当配置为 `styles` 时：

```ts
import { Button } from 'foo';
```

转换结果:

```ts
import Button from 'foo/lib/button';
import 'foo/styles/button';
```

###  camelToDashComponentName

- **类型:**  `boolean`
- **默认值:** `true`

是否需要将 camelCase 的引入转换成 kebab-case。
示例:

```ts
import { ButtonGroup } from 'foo';
```

转换结果:

```ts
// 设置成 true：
import ButtonGroup from 'foo/button-group';
// 设置成 false：
import ButtonGroup from 'foo/ButtonGroup';
```

###  transformToDefaultImport

- **类型:**  `boolean`
- **默认值:** `true`

是否将导入语句转换成默认导入。

示例:

```ts
import { Button } from 'foo';
```

转换结果:

```ts
// 设置成 true：
import Button from 'foo/button';
// 设置成 false：
import { Button } from 'foo/button';
```

###  customName

- **类型:**  `string`
- **默认值:** `undefind`

自定义转换后的导入路径。
比如下面的配置，会将 `import { foo } from 'my-lib'` 转换为 `import foo from 'my-lib/foo'`。

```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'my-lib',
      customName: `my-lib/{{ member }}`, // [!code ++]
    },
  ]
})
```
此外, 你还可以声明转换后的路径格式，例如设置为 `camelCase member`, 来将 member 转换成驼峰格式。
- `kebabCase`：字母小写，单词之间使用连字符连接。例如：`my-variable-name`。
- `snakeCase`：字母小写，单词之间使用下划线连接。例如：`my_variable_name`。
- `camelCase`：首字母小写，随后每个单词的首字母大写。例如：`myVariableName`。
- `upperCase`：字母大写，其他字符不变。例如：`MY-VARIABLE-NAME`。
- `lowerCase`：字母小写，其他字符不变。例如：`my-variable-name`。

比如
```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'my-lib',
      customName: `my-lib/{{ camelCase member }}`, // [!code ++]
    },
  ]
})
```

## transformRuntime

- **类型**：`{ absoluteRuntime: string, version: string }`
- **默认值**：`{}`
- **bundler**：`webpack`

配置 transform-runtime 插件的部分功能。

比如，如果你想用最新的 @babel/runtime 版本。可先配置如下：

```js
transformRuntime: {
  absoluteRuntime: process.cwd()
}
```

再安装 @babel/runtime 到项目中：

```bash
$ npm install @babel/runtime --save-dev
```

## verifyCommit

- **类型**：`{ scope: string[]; allowEmoji: boolean }`
- **默认值
  **：
  `{ scope: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'workflow', 'build', 'ci', 'chore', 'types', 'wip', 'release', 'dep', 'deps', 'example', 'examples', 'merge', 'revert'] }`

针对 verify-commit 命令的配置项。

关于参数。`scope` 用于配置允许的 scope，不区分大小写，配置后会覆盖默认的；`allowEmoji` 开启后会允许加 EMOJI
前缀，比如 `💥 feat(模块): 添加了个很棒的功能`。

```ts
export default {
  verifyCommit: {
    scope: ['feat', 'fix'],
    allowEmoji: true,
  }
}
```

注意：使用 `git revert` 或 `git merge` 命令以及 `changesets` 的发版 merge 格式所产生的 commit message 会默认通过校验。

## vite

- **类型**：`object`
- **默认值**：`{}`

开发者的配置会 merge 到 vite 的 [默认配置](https://vitejs.dev/config/)。

示例，

```js
export default {
  // 更改临时文件路径到 node_modules/.bin/.vite 文件夹
  vite: {
    cacheDir: 'node_modules/.bin/.vite',
  }
}
```

## vue

- **类型**：`object`
- **默认值**：`{}`
- **bundler**：`webpack`、`rsbuild`

使用 Vue3 时，开发者可以针对 [`vue-loader`](https://vue-loader.vuejs.org/zh/options.html) 进行配置。

示例，

```js
export default {
  vue: {
    vueLoaderOptions: {
      compilerOptions: {
        preserveWhitespace: true,
        directives: {
          html(node, directiveMeta) {
            // XSS防护逻辑
            (node.props || (node.props = [])).push({
              name: 'innerHTML',
              value: `DOMPurify.sanitize(_s(${directiveMeta.value}))`
            });
          }
        }
      }
    },
  }
}
```

## vue2

- **类型**：`object`
- **默认值**：`{}`
- **bundler**：`webpack`、`rsbuild`

使用 Vue2 时，开发者可以针对 [`vue-loader`](https://vue-loader.vuejs.org/zh/options.html) 进行配置。

示例，

```js
export default {
  vue2: {
    vueLoaderOptions: {
      compilerOptions: {
        preserveWhitespace: true,
        directives: {
          html(node, directiveMeta) {
            // XSS防护逻辑
            (node.props || (node.props = [])).push({
              name: 'innerHTML',
              value: `DOMPurify.sanitize(_s(${directiveMeta.value}))`
            });
          }
        }
      }
    },
  }
}
```

## writeToDisk

- **类型**：`boolean`
- **默认值**：`false`
- **bundler**：`webpack`、`rsbuild`

用于控制是否将开发环境的构建产物写入到磁盘上。

开启后会在 dev 模式下额外输出一份文件到 dist 目录，通常用于 chrome 插件、electron 应用、sketch
插件等开发场景。也通常用于排查构建产物的内容，或是配置静态资源的代理规则。

## seeOptions

- **类型**： `object`
- **默认值**：`{}`

将构建的输出物打包成 SEE
平台发布物。具体参数可以参考 [winner-deploy](https://www.npmjs.com/package/@winner-fed/winner-deploy)

示例，

```js
export default {
  seeOptions: {
    system: 'hspf-front',
    group: 'wip',
    variables: [
      {
        type: 'input',
        label: '服务基础路径',
        name: 'API_HOME',
        required: true,
        tooltip: '后端服务接口地址',
        default: 'http://121.12.154.243:9080/h5-api-f/'
      },
      {
        type: 'switch',
        label: '是否启用调试工具',
        name: 'IS_OPEN_VCONSOLE',
        options: 'true:是;false:否',
        required: false,
        tooltip: '是否启用调试工具 vconsole',
        default: 'true'
      },
      {
        type: 'editor',
        label: '客户埋点对接信息',
        name: 'CUSTOMER_INFO',
        required: true,
        tooltip: "{ appkey: 'aisdfnxcisdfsd', loginip: '192.168.1.2' }",
        default: { appkey: 'aisdfnxcisdfsd', loginip: '192.168.1.2' }
      }
    ],
    isProduction: true,
    isDocker,
    dockerImage: 'docker',
    configTemplate: 'dist/config.local.js',
    outputName: 'dist',
    seePackagePath: 'package',
    cb() {
      console.log('打包成功！');
    }
  }
}
```

## zipOptions

- **类型**： `object`
- **默认值**：`{}`

将指定目录压缩成 zip 包。

示例，

```js
export default {
  // 各属性默认值，也可以自定义
  zipOptions: {
    // 指定要压缩的目录
    src: 'dist',
    // zip 包名  
    name: `${pkg.name}-v${pkg.version}_${Date.now()}`,
    // 压缩完成的 zip 包存放的目录  
    dest: 'dist-zip'
  }
}
```

::: warning 注意

考虑到压缩包的文件名不能含有非法字符的情况，所以当 `name` 含有特殊字符时，会被替换为**空**。

特殊字符的正则表达式：/[\[\]{};',./:"<>?!@#$%^&*()+【】、；‘，。、{}|：”“《》？！@#￥%……&*（）——+]*/g

:::

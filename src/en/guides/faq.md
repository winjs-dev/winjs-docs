# FAQ {#faq}

## Can H5 offline packages use Vite as the build tool for output?

No. You need to use webpack as the build tool for deployment output.

This is determined by the characteristics of the `Vite` tool. The reasons are as follows:

Vite is not designed for traditional module systems and outputs `<script type=module>` by default, which is ES Modules. ES Modules is its feature baseline. It **does not support file system** access and requires an HTTP server to provide script files (which is the need for http/https scheme in browser error logs...). Alternatively, you can inject a custom scheme in native applications to use embedded pages (example-app:// or similar), which can properly activate ES Modules features and avoid this problem from the start.

If you really want to use Vite for development while only being able to use `file:///`, you can use [@vitejs/plugin-legacy](https://www.npmjs.com/package/@vitejs/plugin-legacy) to generate a nomodule version, then make the following changes to dist/index.html:

- Remove `<script type=module>` elements
- Remove the nomodule attribute from other `<script>` tags
- Remove the content of `<script id=vite-legacy-entry>` element and change the data-src attribute name to src
- Remove SystemJS loader code (that compressed `<script>` on one line)
- Change all resource addresses to relative addresses (e.g., change /assets/index-legacy.xxxx.js to ./assets/index-legacy.xxxx.js, note CSS files as well)

In summary, these changes are quite extensive and require thorough testing. Not recommended.
                     
## [Vue warn]: Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function. {#vue-warn-missing-ref}

When encountering the above issue, it may be caused by duplicate Vue imports. This can be resolved with the following configuration:

```ts
// .winrc
import { defineConfig } from 'win';

export default defineConfig({
  mfsu: {
    shared: {
      vue: {
        singleton: true,
        eager: true,
      },
    },
  }
})

```

## Can dynamicImport be disabled?

Yes, but it's not recommended to disable it.

1. Install dependencies

```bash
  pnpm i babel-plugin-dynamic-import-node -D
```

2. Add `extraBabelPlugins` to the configuration, but only enable it for production

```ts
// .winrc.ts
export default {
  extraBabelPlugins: process.env.NODE_ENV === 'production' 
    ? ['babel-plugin-dynamic-import-node'] 
    : []
}
```
::: tip Tip

What is `dynamicImport`?

It refers to whether to enable on-demand loading, i.e., whether to split build artifacts and download additional JS when needed for execution.

When disabled by default, only one js and one css file are generated, namely win.js and win.css. The advantage is simplicity and easy deployment; the disadvantage is that the initial website loading will be slower for users.

After packaging, it usually looks like this:

```bash
+ dist
  - static
  - win.js
  - win.css
  - index.html
```

After enabling, you need to consider the publicPath configuration, and possibly runtimePublicPath, because you need to know where to asynchronously load JS, CSS, and image resources.

After packaging, it usually looks like this:

```bash
+ dist
  - win.js
  - win.css
  - index.html
  - p__index.js
  - p__users__index.js
```  
Here, p__users_index.js is the path where the route component is located: src/pages/users/index, where src is ignored and pages is replaced with p.
:::

## Error evaluating function `round`: argument must be a number

<img src="/images/guide/less-error.png" />

解法：新版 less 中 `/` 默认被识别为属性简写，通过配置 `lessLoader: { math: 'always' }` 恢复旧版行为（默认将 `/` 用作计算符号）。

## routes 里的 layout 配置选项不生效

layout 配置被移动到了 `app.ts` ，详见 [config/runtime-config > layout](../config/runtime-config#layout)

## index.html 去哪了，如何自定义 HTML 模板

我们废弃了 `index.html`，提供了 Meta, Links, Scripts 等接口用于拼装 html。
除了可以通过配置项注入外部 [script](https://winjs-dev.github.io/winjs-docs/config/config#scripts) 、[css](https://winjs-dev.github.io/winjs-docs/config/config#styles) 外，还可以使用项目级插件更灵活的修改 HTML 产物，参见如下：

```
目前提供了大量的 html 快捷操作 api 来拼成最终 html 。

// ${projectRoot}/plugin.ts

import { IApi } from 'win';

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $('head').append([
      `<script src='https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js'></script>`,
      `<script src='others...'></script>`
    ])
    return $;
  });
};
将提供 jquery like 的 api ，详见 cheerio

通过如上例子中的 api 可以将你的所有逻辑抽象到 项目级插件 ${projectRoot}/plugin.ts 中（该文件会被自动注册为插件）

```

## config.local.js 哪去了，如何自定义前端工程运行的配置文件
我们再项目初始化的流程显示移除了此配置文件，主要是为了避免有些安全测试软件检测构建后的前端静态资源的时候，此文件由于开发者的不注意，会出现因为一些敏感信息，比如本地开发调试的代码，注释信息等，因此将 `config.local.js` 的文件的生成交给了 WinJS 来处理，打包的时候会自动生成，以此来避免人为的修改。
开发者可以使用[appConfig](../config/config#appconfig)来自定义 `config.local.js` 里的内容。
 
在本地开发调试的时候，会读取 `appConfig`，赋值给 `window.LOCAL_CONFIG`，然后在 index.html 文件的`<head>`元素里添加这段 Script 脚本。

构建包的时候，会读取 `appConfig`，自动在 `dist` 目录中生成 `config.local.js`。

## scripts 里配置的外部 js 文件为什么默认插入到 win.js 的后面

vue 只有在页面加载完毕后才会开始运行，所以插到 `win.js` 后面不会影响项目。

若需要插到 `win.js` 前面，可参见 

```
// ${projectRoot}/plugin.ts

import { IApi } from 'win'

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $('#root').after([
      `<script src='https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js'></script>`,
    ])
    return $;
  });
};
output:

  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"></script>
    <script src="/win.js"></script>
  </body>
```

## WinJS 我怎么分包

WinJS 默认按页拆包，只有符合一定 size 大小的包才会被单独拆分，如果使用次数较多，则会被分配到公用 win.js 产物中，可以使用 [ANALYZE](https://winjs-dev.github.io/winjs-docs/guides/env-variables.html#analyze) 进行产物分析。如果你觉得还需要优化（尤其对于特别大的组件和依赖部分），可以使用分包策略或手动拆包，详见：[代码拆分指南](./code-splitting)

如果你有将所有 js 产物打包成单 `win.js` 文件的需求，请关闭 [dynamicImport](#可以关闭-dynamicimport-吗) 。


## 怎么用 GraphQL

配置 `graph-ql` loader 的方式可参见： [discussions/8218](https://github.com/umijs/umi/discussions/8218)

## 怎么用 WebAssembly

配置如下：

```ts
// .winrc.ts

export default {
  chainWebpack(config) {
    config.set('experiments', {
      ...config.get('experiments'),
      asyncWebAssembly: true
    })

    const REG = /\.wasm$/

    config.module.rule('asset').exclude.add(REG).end();

    config.module
      .rule('wasm')
      .test(REG)
      .exclude.add(/node_modules/)
      .end()
      .type('webassembly/async')
      .end()
  },
}
```

一个实际例子可参见：[discussions/8541](https://github.com/umijs/umi/discussions/8541)

## 怎么自定义 loader

根据场景不同，你可能要先从 静态资源规则 中排除你需要加载的文件类型，再添加你自己的 loader / 或修改，可参考如下实例：

 - [discussions/8218](https://github.com/umijs/umi/discussions/8218)

 - [discussions/8452](https://github.com/umijs/umi/discussions/8452)

举个例子，比如 svg 我希望不走 base64，而是使用雪碧图的方式，可以这样配置：

```js
import path from 'path';

const resolve = (dir) => {
  return path.join(__dirname, './', dir);
};

export default {
  chainWebpack(memo) {
    // svg
    // exclude icons
    memo.module.rule('image').exclude.add(resolve('src/icons')).end();
    memo.module
      .rule('svg')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  } 
}
```

## 第三方包里如何使用 css modules

1. 直接将第三方包的 `jsx` / `ts` / `tsx` 源码发布到 npm ，无需转译为 `js` WinJS 支持直接使用。

2. 若第三方包产物是 `js` 的情况，需要将其纳入 babel 额外处理，才可以支持 css modules：

```ts
// .winrc.ts
export default {
  extraBabelIncludes: ['your-pkg-name']
}
```

## npm link 的包不热更新怎么解决

WinJS 默认开启 `mfsu` ，默认忽略 `node_modules` 的变化，配置从 `mfsu` 排除该包即可：

```ts
// .winrc.ts

export default {
  mfsu: {
    exclude: ['package-name']
  },
}
```

## 我的环境很多，多环境 config 文件的优先级是怎样的

加载优先级详见 [WIN_ENV](./env-variables#win-env) ，无论是 `config/config.ts` 还是 `.winrc.ts` 同理。

## IE 兼容性问题

现代浏览器主流背景下，WinJS 默认不兼容 IE 。

若你有调整构建兼容目标、兼容非现代浏览器、兼容 IE 浏览器的需求，请参考 [非现代浏览器兼容](./legacy-browser) 。

## 调整产物的压缩编码格式

默认 js / css 的压缩器 `esbuild` 会采用 `ascii` 格式编码压缩，这可能导致中文字符被转码，增大产物体积。

可通过配置调整到 `utf8` 编码，防止字符被转换：

```ts
// .winrc.ts
export default {
  jsMinifierOptions: { charset: 'utf8' },
  cssMinifierOptions: { charset: 'utf8' }
}
```

或通过切换压缩器来解决：

```ts
// .winrc.ts
export default {
  jsMinifier: 'terser',
  cssMinifier: 'cssnano'
}
```

## devServer 选项怎么配置

WinJS 不支持配置 `devServer` 选项，但你可以通过以下方式找到替代：

1. [`proxy`](../config/config#proxy) 选项配置代理，可通过 `onProxyReq` 修改请求头信息，可参考如下：

```ts
// .winrc.ts
export default {
  proxy: { 
    '/api': {
      target: backendURI,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('origin', host);
      }
    } 
  },
}
```

2. 编写 [项目级插件](./use-plugins#项目级插件) ，插入 express 中间件以实现对请求的修改，可参考如下：
```ts
// 可以通过在根目录创建 plugin.ts，内容如下:

import type { IApi } from 'win';

export default (api: IApi) => {
  // 中间件支持 cors
  api.addMiddlewares(()=>{
    return function cors(
      req,
      res,
      next,
    ) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      next();
    }
  });
};
```

## 为什么代码提示不生效？

1. 需要先运行一次 `win dev`
2. 检查 tsconfig.json，include 包含当前编辑的文件，`compilerOptions.path` 包含
```json
"@/*": ["./src/*"],
"@@/*": ["./src/.fes/*"]
```
        
## 运行时和编译时分别是什么

WinJS 与 webpack 相比增加了运行时相关的能力，我们在开发中有时候可能难以区分。

编译时指的是代码在编译的时候做的事情，这个阶段的环境一般是 node 环境，可以使用 fs，path 等功能。但是同时因为没有使用 webpack ，所以 jsx，引入图片等非 node 的能力是无法使用的。
运行时是指代码已经编译完成开始运行的阶段，这个阶段一般是浏览器环境，不能使用 fs，path 等功能，访问 url 也会有跨域的问题，但是这个环境被 webpack 编译过，所以可以写 jsx，导入图片等功能。
以上两个环境用起来容易混淆，这里有一个简单的版本，src 文件夹中都是运行时的代码，都会经过 webpack 编译。其他目录的都可以认为是编译时，可以使用 node 能力。这也是为什么我们不能在 config.ts 里面写 JSX 的原因。

## 通过什么方法能获取 defineConfig （即 winrc）的配置

1. 因为「配置」是供 Node.js 使用的，它不会包含在浏览器端。
当在浏览器端使用 import from "win" 时会出现报错，主要原因是在浏览器端，WinJS 是通过别名 win: "@@/exports" 提供的。因此，在浏览器端使用 import from "win" 实际上是导入了 "src/.win/exports.ts" 文件。
而在 config/config（或类似的 Node.js 端）中使用 import from "win"，实际上是导入了 "node_modules/win/dist/index.js" 文件。
由于 defineConfig 不在 exports 中，所以无法使用。

2. 若要复用配置，可以将需要复用的配置提取出来，确保该文件是“纯净”的，没有任何依赖。这样就可以在客户端（项目中）和 Node.js 端（配置文件）中同时进行导入和使用。

## 热更新较慢的原因

目前已知的信息：

1. 尝试关闭 mfsu: false 看看热更新时间是否会减少。
2. 尝试手动分包，分包方式见：[code-splitting](https://winjs-dev.github.io/winjs-docs/guides/code-splitting.html)，特别是对需要加载重依赖的组件部分拆分，比如编辑器等。
3. 若没有使用额外的 babel 插件，尝试使用 srcTranspiler: 'swc' 提升编译速度（ srcTranspiler ）。
4. 升级 WinJS 版本到最新。

## 如何查看 webpack 的配置

```ts
// winrc
import { defineConfig } from 'win';
import fs from 'fs';

export default defineConfig({
  npmClient: 'pnpm',
  chainWebpack(memo, args) {
    // console.log('memo', JSON.stringify(memo.toConfig(), null, 2));
    fs.writeFileSync('webpack-config.json', JSON.stringify(memo.toConfig(), null, 2), 'utf8');
    return memo;
  }
});
```

注意这个方法只能查看 webpack 配置而不能修改，修改需要通过 `webpack chain` 的方式对相应的规则修改，但通常你不需要修改 `webpack chain` ，因为绝大部分配置已经有[独立的配置项](https://winjs-dev.github.io/winjs-docs/config/config.html)了。

## 打包时出现 `JavaScript heap out of memory`?

该报错表示打包过程中出现了内存溢出问题，大多数情况下是由于打包的内容较多，超出了 Node.js 默认的内存上限。

如果出现 OOM 问题，最简单的方法是通过增加内存上限来解决，Node.js 提供了 `--max-old-space-size` 选项来对此进行设置。你可以在 CLI 命令前添加 [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions) 来设置此参数。

比如，在 `win build` 命令前添加参数：

```diff title="package.json"
{
  "scripts": {
-   "build": "win build"
+   "build": "NODE_OPTIONS=--max_old_space_size=16384 win build"
  }
}
```

如果你执行的是其他命令，比如 `win dev`，请在对应的命令前添加参数。

`max_old_space_size` 参数的值代表内存上限大小（MB），一般情况下设置为 `16384`（16GB）即可。

Node.js 官方文档中有对以下参数更详细的解释：

- [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions)
- [--max-old-space-size](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes)

除了增加内存上限，通过开启一些编译策略来提升构建效率也是一个解决方案，请参考 [提升构建性能](/guide/optimization/build-performance)。

如果以上方式无法解决你的问题，可能是项目中某些异常逻辑导致了内存非正常溢出。你可以排查近期的代码变更，定位问题的根因。

## 代码中出现的 `winjs` 和 `win` 分别是什么？
这两个其实都是别名。但使用的场景会有所不同。在 `src/.win/tsconfig.json` 中定义了别名：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 这里会根据具体项目路径自动生成
      "win": [
        "/Volumes/liwb-ssd/xxx/winjs"
      ],
      "winjs": [
        "src/.win/exports.ts"
      ]
    }
  }
}
```

- `winjs` 会在浏览器运行时被替换为 `@@/exports`，其实映射的也是 `src/.win/exports.ts`，定义是在构建工具的 `alias` 中定义的，在项目运行后，打开 `localhost:8000/__win/`，切换到 `Config` 里可以看到。
- `win` 会在 Node.js 环境中被替换为 `node_modules/@winner-fed/winjs/dist/index.js`。在项目中等同于 `@winner-fed/winjs`。 
             
## 可以自定义打包输出目录吗？
可以跟 `vue-cli` 一样，将产物内部目录结构，按照自己的需求调整吗？如js文件统一放到js文件夹，css文件统一放到css文件夹，image文件统一放到image文件夹。

目前不会支持自定义产物内部目录结构，目前存在的各种自定义 hack 解法来修改输出目录，不保证 100% 没有问题，为保证不会发生线上事故，不要继续使用 hack 修改产物的方法了，可以只把产物 index.html 保留下来通过 nginx 提供，其他的 js 、css 都发到 cdn 上按目录管理，然后通过 publicPath 来引入。

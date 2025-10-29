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

Solution: In the new version of Less, `/` is recognized as a property shorthand by default. Configure `lessLoader: { math: 'always' }` to restore the old behavior (defaulting to use `/` as a calculation operator).

## The layout configuration option in routes is not working

The layout configuration has been moved to `app.ts`. For details, see [config/runtime-config > layout](../config/runtime-config#layout)

## Where did index.html go, how to customize HTML template

We have deprecated `index.html` and provided interfaces like Meta, Links, Scripts for assembling HTML.
In addition to injecting external [script](https://winjs-dev.github.io/winjs-docs/config/config#scripts) and [css](https://winjs-dev.github.io/winjs-docs/config/config#styles) through configuration items, you can also use project-level plugins to modify HTML output more flexibly. See below:

```
Currently provides a large number of HTML shortcut operation APIs to assemble the final HTML.

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
Will provide jQuery-like API, see cheerio for details

Through the API in the above example, you can abstract all your logic into the project-level plugin ${projectRoot}/plugin.ts (this file will be automatically registered as a plugin)

```

## Where did config.local.js go, how to customize the frontend project runtime configuration file
We explicitly removed this configuration file in the project initialization process, mainly to prevent security testing software from detecting sensitive information in the built frontend static assets when developers are not careful, such as local development debugging code, comments, etc. Therefore, the generation of the `config.local.js` file is handed over to WinJS to handle, and it will be automatically generated during packaging to avoid manual modifications.
Developers can use [appConfig](../config/config#appconfig) to customize the content in `config.local.js`.
 
During local development and debugging, `appConfig` will be read and assigned to `window.LOCAL_CONFIG`, and then this script will be added to the `<head>` element in the index.html file.

When building the package, `appConfig` will be read and `config.local.js` will be automatically generated in the `dist` directory.

## Why are external js files configured in scripts inserted after win.js by default

Vue only starts running after the page is fully loaded, so inserting after `win.js` will not affect the project.

If you need to insert before `win.js`, see below 

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

## How to do code splitting in WinJS

WinJS splits bundles by page by default. Only packages that meet a certain size will be separately split. If used frequently, they will be allocated to the common win.js output. You can use [ANALYZE](https://winjs-dev.github.io/winjs-docs/guides/env-variables.html#analyze) for output analysis. If you think further optimization is needed (especially for particularly large components and dependencies), you can use splitting strategies or manual splitting. See: [Code Splitting Guide](./code-splitting)

If you need to bundle all js output into a single `win.js` file, please disable [dynamicImport](#can-dynamicimport-be-disabled).


## How to use GraphQL

For configuring `graph-ql` loader, see: [discussions/8218](https://github.com/umijs/umi/discussions/8218)

## How to use WebAssembly

Configuration as follows:

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

For a practical example, see: [discussions/8541](https://github.com/umijs/umi/discussions/8541)

## How to customize loaders

Depending on the scenario, you may need to first exclude the file types you need to load from the static asset rules, and then add your own loader / or modify. Refer to the following examples:

 - [discussions/8218](https://github.com/umijs/umi/discussions/8218)

 - [discussions/8452](https://github.com/umijs/umi/discussions/8452)

For example, if you want SVG not to use base64 but instead use sprite sheets, you can configure it as follows:

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

## How to use CSS Modules in third-party packages

1. Publish the third-party package's `jsx` / `ts` / `tsx` source code directly to npm without transpiling to `js`. WinJS supports direct usage.

2. If the third-party package output is `js`, you need to include it in babel for additional processing to support CSS modules:

```ts
// .winrc.ts
export default {
  extraBabelIncludes: ['your-pkg-name']
}
```

## How to solve hot module replacement not working for npm linked packages

WinJS enables `mfsu` by default, which ignores changes in `node_modules` by default. Configure to exclude the package from `mfsu`:

```ts
// .winrc.ts

export default {
  mfsu: {
    exclude: ['package-name']
  },
}
```

## I have many environments, what is the priority of multi-environment config files

For loading priority, see [WIN_ENV](./env-variables#win-env). The same applies to both `config/config.ts` and `.winrc.ts`.

## IE Compatibility Issues

In the context of mainstream modern browsers, WinJS does not support IE by default.

If you need to adjust build compatibility targets, support non-modern browsers, or support IE browsers, please refer to [Legacy Browser Compatibility](./legacy-browser).

## Adjusting the output compression encoding format

By default, the `esbuild` compressor for js / css uses `ascii` format encoding compression, which may cause Chinese characters to be transcoded and increase the output size.

You can configure to adjust to `utf8` encoding to prevent character conversion:

```ts
// .winrc.ts
export default {
  jsMinifierOptions: { charset: 'utf8' },
  cssMinifierOptions: { charset: 'utf8' }
}
```

Or solve it by switching compressors:

```ts
// .winrc.ts
export default {
  jsMinifier: 'terser',
  cssMinifier: 'cssnano'
}
```

## How to configure devServer options

WinJS does not support configuring `devServer` options, but you can find alternatives through the following methods:

1. Configure proxy using the [`proxy`](../config/config#proxy) option. You can modify request headers through `onProxyReq`. See the following example:

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

2. Write a [project-level plugin](./use-plugins#project-level-plugins) to insert express middleware to modify requests. See the following example:
```ts
// You can create plugin.ts in the root directory with the following content:

import type { IApi } from 'win';

export default (api: IApi) => {
  // Middleware supports cors
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

## Why is code completion not working?

1. You need to run `win dev` at least once
2. Check tsconfig.json to ensure include contains the currently edited file, and `compilerOptions.path` contains
```json
"@/*": ["./src/*"],
"@@/*": ["./src/.fes/*"]
```
        
## What are runtime and compile time

Compared to webpack, WinJS adds runtime-related capabilities, which can sometimes be difficult to distinguish during development.

Compile time refers to what the code does during compilation. The environment at this stage is generally a Node.js environment, where you can use fs, path, and other features. However, because webpack is not used, capabilities that are not Node.js-related, such as JSX and importing images, cannot be used.
Runtime refers to the stage when the code has been compiled and starts running. The environment at this stage is generally a browser environment, where you cannot use fs, path, and other features, and accessing URLs will have cross-origin issues. However, this environment has been compiled by webpack, so you can write JSX, import images, and other features.
These two environments can be easily confused. Here is a simple version: the src folder contains runtime code that will be compiled by webpack. Other directories can be considered compile time and can use Node.js capabilities. This is why we cannot write JSX in config.ts.

## How to get defineConfig (i.e., winrc) configuration

1. Because "configuration" is for Node.js use, it will not be included in the browser side.
When using import from "win" on the browser side, an error will occur. The main reason is that on the browser side, WinJS is provided through the alias win: "@@/exports". Therefore, using import from "win" on the browser side actually imports the "src/.win/exports.ts" file.
When using import from "win" in config/config (or similar Node.js side), it actually imports the "node_modules/win/dist/index.js" file.
Since defineConfig is not in exports, it cannot be used.

2. If you want to reuse configuration, you can extract the configuration that needs to be reused and ensure that the file is "clean" without any dependencies. This way, it can be imported and used on both the client side (in the project) and the Node.js side (configuration file).

## Reasons for slow hot module replacement

Currently known information:

1. Try disabling mfsu: false to see if hot update time decreases.
2. Try manual code splitting. For splitting methods, see: [code-splitting](https://winjs-dev.github.io/winjs-docs/guides/code-splitting.html), especially for components that need to load heavy dependencies, such as editors.
3. If no additional babel plugins are used, try using srcTranspiler: 'swc' to improve compilation speed (srcTranspiler).
4. Upgrade WinJS to the latest version.

## How to view webpack configuration

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

Note that this method can only view webpack configuration but cannot modify it. Modifications need to be made through the `webpack chain` method to modify the corresponding rules. However, usually you don't need to modify `webpack chain` because most configurations already have [separate configuration items](https://winjs-dev.github.io/winjs-docs/config/config.html).

## Getting `JavaScript heap out of memory` during build?

This error indicates a memory overflow issue during the build process. In most cases, this is because there is too much content to build, exceeding Node.js's default memory limit.

If you encounter an OOM issue, the simplest solution is to increase the memory limit. Node.js provides the `--max-old-space-size` option for this. You can set this parameter by adding [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions) before the CLI command.

For example, add parameters before the `win build` command:

```diff title="package.json"
{
  "scripts": {
-   "build": "win build"
+   "build": "NODE_OPTIONS=--max_old_space_size=16384 win build"
  }
}
```

If you are executing other commands, such as `win dev`, please add parameters before the corresponding command.

The value of the `max_old_space_size` parameter represents the memory limit size (MB). Generally, setting it to `16384` (16GB) is sufficient.

The Node.js official documentation has more detailed explanations of the following parameters:

- [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions)
- [--max-old-space-size](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes)

In addition to increasing the memory limit, enabling some compilation strategies to improve build efficiency is also a solution. Please refer to [Improving Build Performance](/guide/optimization/build-performance).

If the above methods cannot solve your problem, it may be that some abnormal logic in the project has caused abnormal memory overflow. You can investigate recent code changes to locate the root cause of the problem.

## What are `winjs` and `win` in the code?
Both are actually aliases, but they are used in different scenarios. Aliases are defined in `src/.win/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // This will be automatically generated based on the specific project path
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

- `winjs` will be replaced with `@@/exports` at browser runtime, which actually also maps to `src/.win/exports.ts`. The definition is in the build tool's `alias`. After the project runs, open `localhost:8000/__win/` and switch to `Config` to see it.
- `win` will be replaced with `node_modules/@winner-fed/winjs/dist/index.js` in the Node.js environment. It is equivalent to `@winner-fed/winjs` in the project.
             
## Can I customize the build output directory?
Can I adjust the internal directory structure of the build output according to my own needs, just like `vue-cli`? For example, put all js files in the js folder, all css files in the css folder, and all image files in the image folder.

Currently, customizing the internal directory structure of the build output is not supported. There are various custom hack solutions to modify the output directory, but they are not guaranteed to be 100% problem-free. To ensure no production incidents occur, do not continue using hack methods to modify the output. You can keep only the build output index.html and serve it through nginx, while deploying all js and css files to a CDN managed by directories, and then reference them through publicPath.

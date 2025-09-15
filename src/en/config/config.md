# Configuration

For custom configurations that can be used in WinJS, you can use the `.winrc.ts` file in the project root directory or `config/config.ts`. It's worth noting that these two files have the same functionality, just in different directories. Choose one - the `.winrc.ts` file has higher priority.

> For more information about directories, you can learn about it in [Directory Structure](../guides/directory-structure).

WinJS configuration files are normal Node.js modules that are used when executing WinJS [CLI commands](../cli/commands) and are not included in browser-side builds.

> Some configurations needed for browser-side builds, as well as configurations that affect styling presentation, are collectively called "runtime configurations" in WinJS. You can see more about them in [Runtime Configuration](./runtime-config).

Here's an example of the simplest WinJS configuration file:

```ts
import { defineConfig } from 'win';

export default defineConfig({
  outputPath: 'dist',
});
```

Using `defineConfig` to wrap the configuration provides better IntelliSense support when writing configuration files. If you don't need it, you can directly use `export default {}`.

It's worth noting that when using WinJS, you don't need to understand every configuration option. You can roughly browse through all the configurations that WinJS supports below, and then come back to see how to enable and modify the content you need when necessary.

> For easy reference, the following configuration options are sorted alphabetically.

## alias

- **Type**: `Record<string, string>`
- **Default**: `{}`

Configure aliases to map the source of import statements.

For example:

```js
export default {
  alias: {
    foo: '/tmp/to/foo',
  }
}
```

Then `import 'foo'` in the code will actually become `import '/tmp/to/foo'`.

Here are some tips:

1. It's best to use absolute paths for alias values, especially when pointing to dependencies. Remember to add `require.resolve`:

```js
// ⛔ Not recommended
export default {
  alias: {
    foo: 'foo',
  }
}

// ✅ Recommended
export default {
  alias: {
    foo: require.resolve('foo'),
  }
}
```

2. If you don't want subpaths to be mapped as well, remember to add the `$` suffix:

```js
// import 'foo/bar' will be mapped to import '/tmp/to/foo/bar'
export default {
  alias: {
    foo: '/tmp/to/foo',
  }
}

// import 'foo/bar' remains as import 'foo/bar', not modified
export default {
  alias: {
    foo$: '/tmp/to/foo',
  }
}
```

## autoprefixer

- **Type**: `object`
- **Default**: `{ flexbox: 'no-2009' }`

Used to parse CSS and add vendor prefixes to CSS rules using values from Can I Use. For example, automatically adding `-webkit-` prefix to CSS.

**Note**: Starting from version `1.0.1-beta.7`, `rsbuild` enables Lightning CSS (also known as `parcelCSS`) by default and removes `autoprefixer`. However, WinJS can disable Lightning CSS by setting `rsbuild.lightningcssLoader` to `false`, which will then enable the autoprefixer configuration.

For more configuration options, please refer to [autoprefixer options](https://github.com/postcss/autoprefixer#options).

## analyze

- **Type**: `object`
- **Default**: `{}`

When using `webpack` or `rsbuild` as the `bundler`, and analyzing bundle composition by specifying the [`ANALYZE`](../guides/env-variables#analyze) environment variable, this configuration specifies the options for the analyzer plugin. See [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin) for details.

When using `vite` as the `bundler`, in addition to customizing the [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) configuration, options like `excludeAssets`, `generateStatsFile`, `openAnalyzer`, `reportFilename`, and `reportTitle` will be automatically adapted.

## appConfig

- **Type**: `object`
- **Default**: `{ globalName: 'LOCAL_CONFIG' }`

Supports custom global variable names, allowing users to customize the name of the configuration object on the `window`, with the default value being `LOCAL_CONFIG`.

Configure the script content in the `config.local.js` configuration file required for frontend project runtime. Can be configured according to different runtime environments. Must follow the format in the example below.

::: tip Note
The original `config.local.js` file in the `public` directory has been removed.
:::

```js
// .winrc.ts
export default {
  appConfig: {
    // Local development environment
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // vconsole toggle
      IS_OPEN_VCONSOLE: true
    },
    // Test environment
    test: {
      API_HOME: 'https://test.github.com/',
      API_UPLOAD: 'https://test.github.com/upload',
      // vconsole toggle
      IS_OPEN_VCONSOLE: true
    },
    // Production environment
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      // vconsole toggle
      IS_OPEN_VCONSOLE: false
    }
  }
}
```

The generated configuration will be mounted on `window.LOCAL_CONFIG`:

```javascript
// Generated config.local.js
window.MY_APP_CONFIG = {
  "API_HOME": "https://api.github.com/",
  "API_UPLOAD": "https://api.github.com/upload",
  "IS_OPEN_VCONSOLE": true
};
```

### Custom Global Variable Name `<Badge type="tip" text="^0.14.4" />`

```typescript
// .winrc.ts
import { defineConfig } from '@winner-fed/winjs';

export default defineConfig({
  appConfig: {
    // Custom global variable name
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

The generated configuration will be mounted on `window.MY_APP_CONFIG`:

```javascript
// Generated config.local.js
window.MY_APP_CONFIG = {
  "API_HOME": "https://api.github.com/",
  "API_UPLOAD": "https://api.github.com/upload",
  "IS_OPEN_VCONSOLE": true
};
```

## base

- **Type**: `string`
- **Default**: `/`

You can use the base configuration when deploying a WinJS project under a non-root directory.

The base configuration allows you to set a route prefix for your application. For example, if you have routes `/` and `/users`, after setting base to `/foo/`, you can access the previous routes via `/foo/` and `/foo/users`.

> Note: The base configuration must be set at build time and cannot be changed without rebuilding, as this value is inlined in the client bundle.

## banner `<Badge  type="tip" text=">=0.15.0" />`

- **Type**: `object | boolean | undefined`
- **Default**: `undefined`
- **bundler**: `webpack`, `rsbuild`, `vite`

Provides the ability to inject content into the header or footer of built static assets (JS and CSS files).

### Basic Usage

```typescript
export default {
  // Enable default banner (default is true, can be omitted)
  banner: true,
  
  // Disable banner
  banner: false,
  
  // Custom configuration
  banner: {
    content: '/* Custom banner content */',
    position: 'header',
    include: ['js', 'css'],
    exclude: ['*.min.js']
  }
}
```

### Configuration Options

#### content

- Type: `string | (() => string)`
- Default: `''`
- Description: Custom banner content, can be a string or a function that returns a string

#### position

- Type: `'header' | 'footer'`
- Default: `'header'`
- Description: Banner insertion position
- Note: Vite build tool does not support `footer` position. If set to `footer`, it will show a warning and downgrade to `header`

#### include

- Type: `('js' | 'css')[]`
- Default: `['js', 'css']`
- Description: File types that need to add banner, supports JS and CSS files

#### exclude

- Type: `string[]`
- Default: `[]`
- Description: File patterns to exclude, supports wildcards

### Default Content

When `content` is not configured, the system will use default banner content containing the following information:

- Author information: winnerFE
- Project version: Read from package.json
- Build time: Current build time
- WinJS version: Currently used WinJS version

### Examples

#### Custom Banner Content

```typescript
export default {
  banner: {
    content: `
/**
 * Project Name: ${pkg.name}
 * Build Time: ${new Date().toISOString()}
 * Version: ${pkg.version}
 */
`
  }
}
```

#### Add Banner Only for JS Files

```typescript
export default {
  banner: {
    include: ['js'],
    exclude: ['*.min.js', 'vendor-*.js']
  }
}
```

#### Use Function to Dynamically Generate Banner

```typescript
export default {
  banner: {
    content: () => {
      return `/* Generated at ${new Date().toISOString()} */`;
    }
  }
}
```

#### Set Banner Position

```typescript
export default {
  banner: {
    content: '/* Custom banner */',
    position: 'footer'  // Place banner at the bottom of the file (supported by webpack and rsbuild)
  }
}
```

::: warning Note
Vite does not support `position: 'footer'`. If you set `position: 'footer'` in Vite, it will show a warning and automatically downgrade to `header`.
:::

## cacheDirectoryPath

- **Type**: `string`
- **Default**: `node_modules/.cache`
- **bundler**: `webpack`

By default, WinJS stores some cache files from the build process in the `node_modules/.cache` directory, such as logger logs, webpack cache, mfsu cache, etc. You can use the `cacheDirectoryPath` configuration to modify WinJS's cache file directory.

Example:

```js
export default {
  // Change cache file path to node_modules/.cache1 folder
  cacheDirectoryPath: 'node_modules/.cache1',
}
```

## chainWebpack

- **Type**: `(memo, args) => void`
- **Default**: `null`
- **bundler**: `webpack`

To extend WinJS's built-in webpack configuration, we provide a way to modify the webpack configuration using chain programming, based on webpack-chain. For specific APIs, refer to [webpack-chain documentation](https://github.com/mozilla-neutrino/webpack-chain).

As shown below:

```js
export default {
  chainWebpack(memo, args) {
    return memo;
  },
};
```

This function has two parameters:

- `memo` is the existing webpack configuration
- `args` contains some additional information and helper objects, currently including `env` and `webpack`. `env` is the current environment with values `development` or `production`; `webpack` is the webpack object from which you can get webpack built-in plugins, etc.

Usage example:

```js
export default {
  chainWebpack(memo, { env, webpack }) {
    // Set alias
    memo.resolve.alias.set('foo', '/tmp/to/foo');
  
    // Add additional plugins
    memo.plugin('hello').use(Plugin, [...args]);
  
    // Remove WinJS built-in plugins
    memo.plugins.delete('hmr');
  },
};
```

## codeSplitting

- **Type**: `{ jsStrategy: 'bigVendors' | 'depPerChunk' | 'granularChunks'; jsStrategyOptions: {} }`
- **Default**: `null`
- **bundler**: `webpack`, `rsbuild`

Used to configure code splitting strategy schemes. WinJS defaults to splitting chunks by route boundaries to achieve route-level chunk lazy loading. If you want to continue extracting common chunks on top of this, you can choose the appropriate strategy for configuration. The differences are as follows:

bigVendors is a large vendors scheme that packages files under node_modules in async chunks together to avoid duplication. However, the disadvantages are: 1) single file size is too large, 2) no cache efficiency at all.

depPerChunk is similar to bigVendors, but differs in that it splits dependencies by package name + version, which solves the size and cache efficiency issues of bigVendors. However, the potential problem it brings is that it may cause more requests. My understanding is that for non-large projects, it's actually fine because: 1) requests for a single page won't contain too many dependencies, 2) based on HTTP/2, dozens of requests are not a problem. However, for large or massive projects, a more suitable solution needs to be considered.

granularChunks takes a middle value between bigVendors and depPerChunk, while also providing better utilization in cache efficiency. Without special scenarios, it is recommended to use the granularChunks strategy.

## compression

- **Type**: `object`
- **Default**: `{}`

Generate gzip format for build output. For specific configuration options of the compression plugin, see [compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin).

When using Vite mode, see [vite-plugin-compression2](https://github.com/nonzzz/vite-plugin-compression).

## conventionLayout

- **Type**: `boolean`
- **Default**: `undefined`

`src/layouts/index.[tsx|vue|jsx|js]` is used as conventional layout, enabled by default. You can disable this default behavior by configuring `conventionLayout: false`.

## conventionRoutes

- **Type**: `{ base: string; exclude: RegExp[] }`
- **Default**: `null`

Modify the default conventional routing rules, effective only when using WinJS conventional routing. Conventional routing is also called file-based routing, which means no manual configuration is needed - the file system becomes the routing system, and route configuration is analyzed through directories, files, and their naming.

When using conventional routing, all `(j|t)sx, vue?` files under `src/pages` are considered routes.

> You can see more information from [Conventional Routing](../guides/routes#约定式路由).

### base

`base` is used to set the base path for conventional routes, reading from `src/pages` by default. If it's a documentation site, you might need to change it to `./docs`.

### exclude

You can use the `exclude` configuration to filter out unwanted files, such as filtering components, models, etc.

Example:

```js
export default {
  // Do not recognize files under components and models directories as routes
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//],
  }
}
```

## convertToRem

- **Type**: `boolean` | `object`
- **Default**: `false`

By setting `convertToRem` in the `winrc` configuration file, WinJS can perform the following processing:

- Convert px in CSS to rem
- Insert runtime code in HTML templates to set the root element fontSize

### Boolean Type

When setting `convertToRem` to `true`, rem processing capability will be enabled.

```js
export default {
  convertToRem: {}
};
```

At this time, the rem configuration defaults are as follows:

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

### Object Type

When the value of `convertToRem` is an `object` type, WinJS will perform rem processing according to the current configuration.

Options:

| Name                     | Type        | Default Value                                                                                                                                                                                                                                                                          | Description                                                                                                                            |
| ------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| enableRuntime            | `boolean` | `true`                                                                                                                                                                                                                                                                               | Whether to automatically generate runtime code to dynamically calculate root element font size and inline runtime code into HTML files |
| rootFontSize             | `number`  | `37.5`                                                                                                                                                                                                                                                                               | Root element font value                                                                                                                |
| maxRootFontSize          | `number`  | `64`                                                                                                                                                                                                                                                                                 | Maximum root element font value                                                                                                        |
| widthQueryKey            | `string`  | `'' `                                                                                                                                                                                                                                                                                | Get client width from url query according to widthQueryKey value                                                                       |
| screenWidth              | `number`  | `375`                                                                                                                                                                                                                                                                                | UI design width                                                                                                                        |
| supportLandscape         | `boolean` | `false`                                                                                                                                                                                                                                                                              | Use height to calculate rem in landscape mode                                                                                          |
| useRootFontSizeBeyondMax | `boolean` | `false`                                                                                                                                                                                                                                                                              | Whether to use rootFontSize when exceeding maxRootFontSize                                                                             |
| pxtorem                  | `object`  | `<ul><li>`rootValue: defaults to same as rootFontSize `</li><li>`unitPrecision: 2, precision digits `</li><li>`propList: ['height', 'line-height', 'width','padding','margin', 'top','left','right','bottom','font-size'], supported CSS properties for conversion`</li></ul>` | [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem#options) plugin properties                                                      |

### Example

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

- **Type**: `Array<string | { from: string; to: string; }>`
- **Default**: `[]`

Configure files or folders to be copied to the output directory.

When configuring strings, they are copied to the build output directory by default, for example:

```ts
export default {
  copy: ['foo.json', 'src/bar.json']
}
```

This will produce the following build output structure:

```
+ dist
  - bar.json
  - foo.json
+ src
  - bar.json
- foo.json
```

You can also configure specific copy locations through objects, where relative paths start from the project root directory:

```ts
export default {
  copy: [
    { from: 'from', to: 'dist/output' },
    { from: 'file.json', to: 'dist' }
  ]
}
```

This will produce the following build output structure:

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

- **Type**: `{ includes?: string[] }`
- **Default**: `false`

Configure the crossorigin attribute for script tags. If declared, it will add the crossorigin="anonymous" attribute to local scripts.

About parameters: The `includes` parameter can add this attribute to additional non-local script tags.

For example:

```js
export default {
  crossorigin: {}
}
```

Then the output HTML will have these changes:

```diff
- <script src="/win.js"></script>
+ <script src="/win.js" crossorigin="anonymous"></script>
```

## cssMinifier

- **Type**: `string` Optional values: `esbuild`, `cssnano`, `parcelCSS`, `none`
- **Default**: `esbuild`
- **bundler**: `webpack`, `rsbuild`

Configure the CSS compression tool used during build; `none` means no compression.

**Note**: When using rsbuild, cssMinifier defaults to `parcelCSS`, with optional value `none`, and does not support switching to other compressors.

Example:

```js
export default {
  cssMinifier: 'esbuild'
}
```

## cssMinifierOptions

- **Type**: `Object`
- **Default**: `{}`
- **bundler**: `webpack`

Configuration options for the `cssMinifier` CSS compression tool.

**Note**: When using rsbuild, cssMinifier defaults to `parcelCSS`. Configuration should refer to `parcelCSS`.

Example:

```js
export default {
  cssMinifier: 'esbuild',
  cssMinifierOptions: {
    minifyWhitespace: true,
    minifySyntax: true
  }
};
```

For CSS compression configurations, please refer to the corresponding documentation:

- [esbuild reference](https://esbuild.github.io/api/#minify)
- [cssnano reference](https://cssnano.co/docs/config-file/)
- [parcelCSS reference](https://github.com/parcel-bundler/parcel-css/blob/master/node/index.d.ts)

## cssPublicPath

- **Type**: `string`
- **Default**: `./`
- **bundler**: `webpack`

Specify a custom public path for external resources such as images and files in CSS. It works similarly to `publicPath` with a default value of `./`.

## cssLoader

- **Type**: `object`
- **Default**: `{}`
- **bundler**: `webpack`

Configure css-loader, see [css-loader &gt; options](https://github.com/webpack-contrib/css-loader#options) for details.

## cssLoaderModules

- **Type**: `object`
- **Default**: `{}`
- **bundler**: `webpack`

Configure the behavior of CSS modules, see [css-loader &gt; modules](https://github.com/webpack-contrib/css-loader#modules) for details.

For example:

```ts
cssLoaderModules: {
  // Configure camelCase usage
  exportLocalsConvention: 'camelCase'
}
```

## deadCode

- **Type**:
  `{ patterns?: string[]; exclude?: string[]; failOnHint?: boolean; detectUnusedFiles?: boolean; detectUnusedExport?: boolean; context?: string }`
- **Default**: `false`
- **bundler**: `webpack`

Detect unused files and exports, only enabled during the build phase.

For example:

```
deadCode: {}
```

Then execute build, if issues are found, warnings will be printed:

```
Warning: There are 1 unused files:
 1. /pages/index.module.less
 Please be careful if you want to remove them (¬º-°)¬.
```

Configuration options:

- `patterns`: Scope for code recognition, e.g. `['src/pages/**']`
- `exclude`: Scope to exclude from detection, e.g. `['src/pages/utils/**']`
- `failOnHint`: Whether to terminate the process if detection fails, default `false` (no termination)
- `detectUnusedFiles`: Whether to detect unused files, default `true` (enabled)
- `detectUnusedExport`: Whether to detect unused exports, default `true` (enabled)
- `context`: Directory where matching starts, defaults to current project root directory

## define

- **Type**: `Record<string, string>`
- **Default**: as follows

```
  { 
    'process.env.NODE_ENV' : process.env.NODE_ENV,
    'process.env.HMR' : process.env.HMR, 
    'process.env.SOCKET_SERVER': process.env.ERROR_OVERLAY' 
  }
```

Set available variables in code based on the [define-plugin](https://webpack.js.org/plugins/define-plugin/).

::: tip Note

1. Property values will be converted through `JSON.stringify`.
2. Key value replacement is matched by syntax form. For example, configuring `{'a.b.c': 'abcValue'}` cannot replace `a.b?.c` in the code.

:::

For example:

```
define: { FOO: 'bar' }
```

Then `console.log(hello, FOO)` in the code will be compiled to `console.log(hello, 'bar')`.

When using these variables in a TypeScript project, you need to declare variable types in the typings file to support TypeScript type hints:

If your typings file is global:

```ts
// typings.d.ts
declare const FOO: string;
```

If your typings file is non-global (contains import/export):

```ts
// typings.d.ts
import './other.d.ts';

declare global {
  const FOO: string;
}
```

## devtool

- **Type**: `string`
- **Default**: defaults to `cheap-module-source-map` in dev, no sourcemap by default in build
- **bundler**: `webpack`, `rsbuild`

Set the sourcemap generation method.

Common optional values include:

- `eval`: fastest type, but doesn't support older browsers
- `source-map`: slowest but most complete type

Example:

```js
// Disable sourcemap generation during dev phase
devtool: false;

// Only set sourcemap for dev phase
devtool: process.env.NODE_ENV === 'development' ? 'eval' : false;
```

## classPropertiesLoose

- **Type**: `object`
- **Default**: `{}`

Set babel class-properties to enable loose mode.

This mainly affects how properties are defined after class compilation. When loose=false, properties are defined using Object.defineProperty; when loose=true, they are defined using direct assignment.

::: tip Knowledge Extension
@babel/plugin-proposal-class-properties is a Babel plugin that provides support for class properties.

In early versions of JavaScript, class property definitions typically required assignment using the this keyword in the constructor, for example:

```js
class MyClass {
  constructor() {
    this.myProperty = 'Hello';
  }
}
```

However, with the evolution of JavaScript, class property syntax has been introduced in proposals, allowing us to define properties directly in classes without assignment through constructors. This syntax is more concise and intuitive, for example:

```js
class MyClass {
  myProperty = 'Hello';
}
```

However, this new class property syntax has not yet been fully supported in current JavaScript standards, so Babel plugins are needed for transformation.

The @babel/plugin-proposal-class-properties plugin is designed to provide support for class property syntax. It converts properties defined using class property syntax into equivalent code with the old constructor assignment method, ensuring normal operation in environments that do not support class property syntax.

Using this plugin, you can use class property syntax in your project, enjoying more concise code writing and improved readability. At the same time, this plugin also supports the definition and initialization of class static properties.

:::

## esbuildMinifyIIFE

- **Type**: `boolean`
- **Default**: `false`
- **bundler**: `webpack`

Fix naming conflicts caused by global variables automatically introduced by the esbuild minifier.

Since WinJS uses esbuild as the minifier by default, this minifier automatically injects global variables as polyfills, which may cause issues such as async chunk global variable conflicts and global variable conflicts between qiankun sub-applications and main applications. This problem can be solved by enabling this option or switching the [`jsMinifier`](#jsminifier) minifier.

For more information, see [vite#7948](https://github.com/vitejs/vite/pull/7948).

Example:

```ts
esbuildMinifyIIFE: true
```

## externals

- **Type**: `Record<string, string> | Function`
- **Default**: `{}`

Set which modules should not be bundled, but instead loaded via `<script>` or other methods. Usually needs to be used together with [headScripts](#headscripts) configuration.

Example:

```
// external vue
externals: { vue: 'Vue' },
headScripts: ['https://unpkg.com/vue@3.3.4/dist/vue.global.js'],
```

## extraBabelIncludes

- **Type**: `Array<string | RegExp>`
- **Default**: `[]`
- **bundler**: `webpack`, `rsbuild`

Configure additional NPM packages or directories that need Babel compilation. For example:

```js
export default {
  extraBabelIncludes: [
    // Support absolute paths
    join(__dirname, '../../common'),
    // Support npm packages
    'monaco-editor-vue',
    // Transpile all packages containing @scope in their path
    /@scope/
  ],
};
```

::: tip Note
`rsbuild` reuses this configuration just to maintain configuration consistency, corresponding to [include](https://rsbuild.dev/config/source/include). It also corresponds to the `include` configuration option of `@rsbuild/plugin-babel`.
:::

## extraBabelExcludes `<Badge type="tip" text=">=0.14.6" />`

- **Type**: `Array<string | RegExp>`
- **Default**: `[]`
- **bundler**: `webpack`, `rsbuild`

When the size of a `js` file in the project exceeds the code generator's 500KB limit, the following warning will appear:

`[BABEL] Note: The code generator has deoptimised the styling of /Volumes/liwb-ssd/xxx/with-vue2/src/assets/js/NIM_Web_SDK_v8.9.0.js as it exceeds the max of 500KB. `

Considering that such js files don't actually need to go through babel compilation, this configuration has been added. It's used for NPM packages or directories that don't need Babel compilation.

Example:

```js
export default {
  extraBabelExcludes: [
    // Support absolute paths
    join(__dirname, '../../common'),
    // Support npm packages
    'monaco-editor-vue',
    // Transpile all packages containing @scope in their path
    /@scope/
  ],
};
```

::: tip Note
`rsbuild` reuses this configuration just to maintain configuration consistency, corresponding to [exclude](https://rsbuild.dev/config/source/exclude). It also corresponds to the `exclude` configuration option of `@rsbuild/plugin-babel`.
:::

## extraBabelPlugins

- **Type**: `string[] | Function`
- **Default**: `[]`

Configure additional babel plugins. Can pass plugin paths or plugin functions.

## extraBabelPresets

- **Type**: `string[] | Function`
- **Default**: `[]`

Configure additional babel presets. Can pass preset paths or preset functions.

## extraPostCSSPlugins

- **Type**: `PostCSSPlugin[]`
- **Default**: `[]`

Configure additional PostCSS plugins.

## exportStatic

- **Type**: `{ extraRoutePaths: IUserExtraRoute[] | (() => IUserExtraRoute[] | Promise<IUserExtraRoute[]>) }`
- **Default**: `undefined`
- **bundler**: `webpack`

When this configuration is enabled, HTML files will be output separately for each route, typically used for static site hosting. For example, if a project has the following routes:

```bash
/
/docs
/docs/a
```

When `exportStatic` is not enabled, the output would be:

```bash
dist/index.html
```

When `exportStatic` is enabled, the output would be:

```bash
dist/index.html
dist/docs/index.html
dist/docs/a/index.html
```

The `extraRoutePaths` sub-configuration can be used to generate additional pages, typically used for staticizing dynamic routes. For example, with the following route:

```bash
/news/:id
```

By default, it would only output `dist/news/:id/index.html`, but you can staticize it by configuring `extraRoutePaths`:

```ts
// .winrc.ts
export default {
  exportStatic: {
    // Configure fixed values
    extraRoutePaths: ['/news/1', '/news/2'],
    // Or configure a function to dynamically retrieve
    // extraRoutePaths: async () => {
    //   const res = await fetch('https://api.example.com/news');
    //   const data = await res.json();
    //   return data.map((item) => `/news/${item.id}`);
    // },
  },
}
```

At this time, the output files would become:

```bash
dist/news/:id/index.html
dist/news/1/index.html
dist/news/2/index.html
```

`extraRoutePaths` supports not only string data configuration, but can also be configured as an object array, used for scenarios where SSR is enabled but you want to disable pre-rendering for certain routes, for example:

```ts
// .winrc.ts
export default {
  exportStatic: {
    // Output additional page files but skip pre-rendering
    extraRoutePaths: [{ path: '/news/1', prerender: false }],
  },
}
```

## favicons

- **Type**: `string[]`
- **Default**: `null`

By default, the website will use the conventional [`favicon`](../guides/directory-structure#favicon) and create icons in the meta header tags.

Customize in the following way:

```js
favicons: [
  // Complete URL
  'https://domain.com/favicon.ico',
  // This will point to `/favicon.png`, ensure your project contains `public/favicon.png`
  '/favicon.png'
]
```

## forkTSChecker

- **Type**: `object`
- **Default**: `null`
- **bundler**: `webpack`, `rsbuild`

Enable TypeScript type checking. Based on fork-ts-checker-webpack-plugin, configuration options can refer to [fork-ts-checker-webpack-plugin Options](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options).

## ftpOptions

- **Type**: `object`
- **Default**: `{}`

Upload local files to the target server via FTP tools. For specific parameters, refer to [ftp-deploy](https://www.npmjs.com/package/@winner-fed/ftp-deploy)

Example:

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

- **Type**: `boolean`
- **Default**: `false`

Enable hash mode to make build artifacts contain hash suffixes. Typically used for incremental releases and to avoid browser loading cache.

When enabled, artifacts typically look like this:

```
+ dist
    - logo.sw892d.png
    - win.df723s.js
    - win.8sd8fw.css
    - index.html
```

Note: HTML files never have hash suffixes.

:::tip Tip
**The Harm of No Hash**

Without hash in file names, you need to configure separate Nginx, gateway, or CDN response headers for static resource files like win.js, marking them as non-cached. This results in users having to fully download win.js every time. If there are many applications, you'd need to configure response headers countless times for each application, and every time a webpage opens, large amounts of non-cached win.js must be loaded.

**Why Hash is Friendly**

Current market or enterprise CDN default configurations widely have long-term cache headers for JS files, which requires adding hash to all js files. Therefore, in the mf scenario, all remote.[hash].js URL addresses should be obtained from a unified configuration center and distributed. After each build, the configuration center synchronously updates corresponding URLs with hash values. Otherwise, users using this feature will likely encounter situations where remote.js has cache that doesn't update, and they may be unable to adjust gateway, CDN, or Nginx response configurations or find it difficult to adjust, so having hash is friendly.
:::

## headScripts

- **Type**: `string[] | Script[]`
- **Default**: `[]`

Configure additional scripts in the `<head>`.

1. When the value of `headScripts` object is a string, it automatically distinguishes configuration support for inline styles and external style paths. The latter is determined by whether it starts with `https?://`.

For example:

```js
export default {
  headScripts: [`alert(1);`, `https://a.com/b.js`],
}
```

Will generate HTML:

```html

<script>
  alert(1);
</script>
<script src="https://a.com/b.js"></script>
```

2. When the value of `headScripts` object is an object, you can configure additional attributes.

Type definition:

```ts
export interface Script {
  // External script
  src?: string;
  // Inline script
  content?: string;
  type?: string;
  charset?: string;
  defer?: boolean;
  async?: boolean;
  crossOrigin?: string;
  integrity?: string;
}
```

For example:

```js
export default {
  headScripts: [
    { src: '/foo.js', defer: true },
    { content: `alert('Hello');`, charset: 'utf-8' }
  ]
};
```

Will generate HTML:

```html
<head>
  <script src="/foo.js" defer></script>
  <script charset="utf-8">
    alert('Hello');
  </script>
</head>
```

## history

- **Type**: `{ type: 'browser' | 'hash' | 'memory' }`
- **Default**: `{ type: 'browser' }`

Set the router history type.

- **browser**: corresponds to [createWebHistory](https://router.vuejs.org/api/#Functions-createWebHistory)
- **hash**: corresponds to [createWebHashHistory](https://router.vuejs.org/api/#Functions-createWebHashHistory)
- **memory**: corresponds to [createMemoryHistory](https://router.vuejs.org/api/#Functions-createMemoryHistory)
  ::: tip Note
  `memory` in Vue Router 3.x corresponds to [abstract](https://v3.router.vuejs.org/api/#mode). You can refer to [migration from Vue2](https://router.vuejs.org/guide/migration/#New-history-option-to-replace-mode)
  :::

## https

- **Type**: `{ cert: string; key: string; hosts: string[]; http2?: boolean }`
- **Default**: `{ hosts: ['127.0.0.1', 'localhost'] }`

Enable dev https mode. WinJS uses [`mkcert`](https://github.com/FiloSottile/mkcert) to quickly create certificates by default. Please ensure it's installed.

About parameters:

- `cert` and `key` are used to specify the cert and key files respectively.
- `hosts` is used to specify the hosts that support https access, default is `['127.0.0.1', 'localhost']`.
- `http2` is used to specify whether to use the HTTP 2.0 protocol, default is true (using HTTP 2.0 in Chrome or Edge browsers may occasionally cause `ERR_HTTP2_PROTOCOL_ERROR` errors. If encountered, it is recommended to configure as false).

Example:

```js
https: {
}
```

## icons

- **Type**: `{ include: string[] }`
- **Default**: `false`

Quickly reference local icons through the IconWin component exported by WinJS.

- `include` is used for additional svg files that need to be parsed using this solution. Note that **absolute paths** must be used.

::: warning Note
Vue2 users who want to continue using the SvgIcon component solution can install the [`@winner-fed/plugin-icons-legacy`](../plugins/iconslegacy.md) package. This solution relies on `svg-sprite-loader` implementation. This solution is no longer built-in in WinJS >= 0.10.0.
:::

### Usage

Enable the icons feature in the WinJS configuration file.

```ts
icons: {
}
```

Using local svg icons requires saving svg files in the `src/icons` directory. For example, if there's a `dog.svg` in the `src/icons` directory, you can reference it like this.

Note that if the svg file consists of multiple words connected, when used as a component, `name` should use camelCase consistently. For example, if the svg filename is `cat-dog.svg`, when using WinIcon, use `<icon-win name="catDog" />`

```tsx
// You can directly use IconWin as a global component. WinJS has automatically registered it
<icon-win name="dog" />
```

#### Local reference

```tsx
import { IconWin } from 'winjs';

<icon-win icon="dog" />
```

## ignoreMomentLocale

- **Type**: `boolean`
- **Default**: `true`
- **bundler**: `webpack`, `rsbuild`

Ignore moment's locale files to reduce bundle size.

Note: This feature is enabled by default. Configure `ignoreMomentLocale: false` to disable it.

## inlineLimit

- **Type**: `number`
- **Default**: `10000` (10k)

Configure the threshold for whether image files are compiled using base64. The default is 10000 bytes; files smaller than this will be compiled as base64 encoding, otherwise separate files will be generated.

## inspectConfig

- **Type**: `{ verbose: boolean; outputPath: string; }`
- **Default**: `false`
- **bundler**: `webpack`, `rsbuild`

Get the Webpack configuration generated by Webpack, the Rsbuild configuration and Rspack configuration internally generated by Rsbuild, serialize them to strings, and support writing them to disk.

- verbose: Show the complete content of functions in the results.
- outputPath: Specify the output path.

## jsMinifier

- **Type**: `string`, possible values: `esbuild`, `terser`, `swc`, `uglifyJs`, `none`
- **Default**: `esbuild`
- **bundler**: `webpack`, `rsbuild`

Configure the tool for compressing JavaScript during build; `none` means no compression.

**Note**: When using rsbuild, jsMinifier defaults to `swc`, with possible values being `none`, and doesn't support switching to other compressors.

Example:

```ts
export default {
  jsMinifier: 'esbuild'
}
```

## jsMinifierOptions

- **Type**: `object`
- **Default**: `{}`
- **bundler**: `webpack`, `rsbuild`

Configuration options for `jsMinifier`.

By default, code compression removes comments from the code. You can preserve comments through the corresponding `jsMinifier` options.

**Note**: When using rsbuild, jsMinifier defaults to `swc`. Configuration should refer to `swc`.

Example:

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

Configuration options need to correspond with the tool being used. Refer to the corresponding documentation:

- [esbuild reference](https://esbuild.github.io/api/#minify)
- [terser reference](https://terser.org/docs/api-reference#minify-options)
- [swc reference](https://swc.rs/docs/configuration/minification#configuration)
- [uglifyJs reference](https://lisperator.net/uglifyjs/compress)

## lessLoader

- **Type**: `Object`
- **Default**: `{ modifyVars: userConfig.theme, javascriptEnabled: true }`

Set less-loader Options. For details, refer to [less-loader Options](https://github.com/webpack-contrib/less-loader#lessoptions).

> By default, less@4 version is used. If you need to be compatible with less@3, please configure and use [less-options-math](https://lesscss.org/usage/#less-options-math).

## legacy

- **Type**: `{ buildOnly?: boolean; nodeModulesTransform?: boolean; checkOutput?: boolean; }`
- **Default**: `false`

When you need to be compatible with older browsers, you may need this option. When enabled, it will use **non-modern** build tools by default, which will significantly increase your build time.

```ts
legacy: {
}
```

By default, it only takes effect during build. Disable this restriction by setting `buildOnly: false`.

You can enable the `checkOutput: true` option to automatically run [`es-check`](https://github.com/yowainwright/es-check) after each build to check whether the syntax of the built `.js` files is in es5 format.

After enabling this option:

- Does not support custom `srcTranspiler`, `jsMinifier`, `cssMinifier` options.
- Will transpile all source code in `node_modules`, `targets` compatibility down to IE 11. Use `nodeModulesTransform: false` to cancel the transformation of `node_modules`. In this case, you can configure `extraBabelIncludes` to more precisely transform packages with compatibility issues.
- Since older browsers do not support Top level await, when using `externals`, make sure you are not using synchronous import dependencies while using asynchronous [`externalsType`](https://webpack.js.org/configuration/externals/#externalstype).

## links

- **Type**: `Link[]`
- **Default**: `[]`

Configure additional link tags.

Example:

```js
export default {
  links: [{ href: '/foo.css', rel: 'preload' }],
}
```

## manifest

- **Type**: `{ fileName: string; basePath: string }`
- **Default**: `null`

Enable generating additional manifest files during build to describe the build artifacts.

About parameters: `fileName` is the generated filename, defaults to `asset-manifest.json`; `basePath` adds a prefix to all file paths.

Note: Only generated during build.

## mdx

- **Type**: `{ loader: string; loaderOptions: Object }`
- **Default**: `{}`
- **bundler**: `webpack`

Configure mdx loader path and [loaderOptions](https://github.com/mdx-js/mdx/blob/v1/packages/mdx/index.js#L12) parameters.

For rsbuild related plugins, refer to: [@rsbuild/plugin-mdx](https://github.com/rspack-contrib/rsbuild-plugin-mdx). You can configure it yourself.

## metas

- **Type**: `Meta[]`
- **Default**: `[]`

Configure additional meta tags.

For example:

```js
export default {
  metas: [
    { name: 'keywords', content: 'win, winjs' },
    { name: 'description', content: 'Vue framework.' },
  ],
}
```

Will generate the following HTML:

```html

<meta name="keywords" content="win, winjs" />
<meta name="description" content="Vue framework." />
```

## mfsu

- **Type**:
  `{ esbuild: boolean; mfName: string; cacheDirectory: string; strategy: 'normal' | 'eager'; include?: string[]; chainWebpack: (memo, args) => void; exclude?: Array<string | RegExp> }`
- **Default**: `{ mfName: 'mf', strategy: 'normal' }`
- **bundler**: `webpack`

Configure speed-up functionality based on [Module Federation](https://module-federation.github.io/).

About parameters:

- `esbuild`: When set to `true`, dependency pre-compilation will use esbuild, making the initial startup faster. The downside is that secondary compilation won't have physical cache, making it slightly slower. Recommended for projects with relatively stable dependencies.
- `mfName`: The global variable for the remote library in this solution, defaults to `mf`. Usually configured in micro-frontend scenarios to prevent conflicts between main and sub-applications.
- `cacheDirectory`: Customize cache directory, defaults to `node_modules/.cache/mfsu`.
- `chainWebpack`: Modify dependency webpack configuration using chain programming, based on webpack-chain. For specific API reference, see [webpack-chain documentation](https://github.com/sorrycc/webpack-chain).
- `runtimePublicPath`: Modifies the publicPath for mf loading files to `window.publicPath`.
- `strategy`: Specifies when mfsu compiles dependencies. In `normal` mode, Module Federation remote packages are built after babel compilation analysis. In `eager` mode, static analysis is used and building is initiated simultaneously with project code.
- `include`: Only effective in `strategy: 'eager'` mode, used to compensate for dependencies that cannot be analyzed by static analysis in eager mode. For example, if `react` doesn't enter the Module Federation remote module, configure it like `{ include: [ 'react' ] }`.
- `exclude`: Manually exclude certain dependencies that don't need to be processed by MFSU, in string or regex form. For example, if you don't want `vant` to be processed by MFSU, configure `{ exclude: [ 'vant' ] }`. The matching logic is exact word matching, or configure `{ exclude: [ /vant/ ] }` so that any dependency whose `import` path matches this regex won't be processed by MFSU.
- `remoteHash`: By default, when users enable `hash: true`, entry files in MF artifacts will automatically carry hash, like `remote.123abc.js`. This can be disabled by setting `remoteHash: false` (resulting in `remote.js`). In this case, you may need to modify nginx/CDN/gateway response header configuration to remove caching for this `remote.js` file, otherwise new builds won't take effect.

Example:

```js
export default {
  // Use esbuild for dependency pre-compilation
  mfsu: {
    esbuild: true,
  }
}

export default {
  // Disable mfsu functionality
  mfsu: false
}
```

```js
export default {
  // webpack configuration modification
  mfsu: {
    chainWebpack(memo, args) {
      // Add additional plugins
      memo.plugin('hello').use(Plugin, [...args]);
      return memo;
    }
  }
}

```

Note: This feature is disabled by default. Configure `mfsu: {}` to enable it.

## mock

- **Type**: `{ exclude: string[], include: string[] }`
- **Default**: `{}`

Configure mock functionality.

About parameters: `exclude` is used to exclude unwanted mock files; `include` is used to additionally add mock files outside the mock directory.

Example:

```js
export default {
  // Make all _mock.ts files under pages become mock files
  mock: {
    include: ['src/pages/**/_mock.ts'],
  }
}
```

Note: This feature is enabled by default. Configure `mock: false` to disable it.

## mountElementId

- **Type**: `string`
- **Default**: `'root'`

Configure the element id where the Vue component tree renders in HTML.

Example:

```js
mountElementId: 'container'
```

## monorepoRedirect

- **Type**: `{ srcDir?: string[], exclude?: RegExp[], peerDeps?: boolean, useRootProject?: boolean }`
- **Default**: `false`

When using WinJS in a monorepo, you may need to import components, utility methods, etc. from other sub-packages. Enable this option to redirect imports from these sub-packages to their source code location (defaults to `src` folder), which can also solve the issue of sub-package changes not hot-reloading in `MFSU` scenarios.

The benefits of this redirection: support hot updates, and development can proceed without pre-building other sub-packages.

Configure `srcDir` to adjust the priority location for identifying source code folders, and use `exclude` to set the scope of dependencies that don't need redirection.

Example:

```js
export default {
  // Redirect to sub-package's src folder by default
  monorepoRedirect: {}
}
export default {
  // Search in sub-packages, prioritize redirecting to libs folder
  monorepoRedirect: {
    srcDir: ['libs', 'src'],
  }
}
export default {
  // Don't redirect @scope/* sub-packages
  monorepoRedirect: {
    exclude: [/^@scope\/.+/],
  }
}
```

In actual large-scale business monorepos, each sub-package's dependencies are loaded by searching upward from their directory for `node_modules`, but during local development, dependencies are installed in `devDependencies`, which behaves inconsistently compared to installing from npm, inevitably leading to multiple instance problems.

::: tip Explanation
For example, each sub-package needs `win-ui` during local development, installed in `devDependencies` and also specified in `peerDependencies`. We expect that when this package is published to npm and installed by a project, `win-ui` uses the project's own dependency, globally unique. However, in a monorepo, dependencies specified in `devDependencies` must exist, and when sub-package code searches for dependencies, it starts from that sub-package, causing each sub-package to use its own `win-ui`, resulting in multiple copies of `win-ui` in the build output, increased bundle size, broken message queues, etc.
:::

To solve this problem, we establish a convention:

When the `peerDeps` option is enabled, all `peerDependencies` specified by sub-packages will automatically have `alias` redirection added for uniqueness, avoiding multiple instances:

```ts
monorepoRedirect: {
  peerDeps: true
}
```

After redirection, dependencies are globally unique, maintaining consistency between development experience and the experience after installing packages from npm.

useRootProject: When your project is not in a monorepo sub-folder but at the monorepo root, you can enable this option to make monorepoRedirect take effect.

## mpa

- **Type**: `object`
- **Default**: `false`
- **bundler**: `webpack`

Enable [mpa mode](../guides/mpa).

## outputPath

- **Type**: `string`
- **Default**: `dist`

Configure output path.

Note: Not allowed to be set to directories related to conventional functionality such as src, public, pages, mock, config, locales, models, etc.

## phantomDependency

- **Type**: `{ exclude: string[] }`
- **Default**: `false`

Execute phantom dependency detection.

When using dependencies not declared in package.json and not configured through alias or externals, it will throw an error and provide a reminder.

If you encounter cases that need whitelist handling, you can implement it through the exclude configuration option. The exclude items are npm package names.

```ts
export default {
  phantomDependency: {
    exclude: ['lodash']
  }
}
```

::: tip Note
Not applicable to `pnpm`.
This is because pnpm uses a strict dependency management mechanism that creates a non-flattened node_modules structure and manages dependencies through symbolic links. In pnpm:

1. Dependencies are installed in a centralized storage location
2. Project's direct dependencies are placed in the node_modules directory via symbolic links
3. Non-direct dependencies are not placed in the project's top-level node_modules directory

This mechanism allows the project to only access explicitly declared dependency packages in package.json, automatically preventing "phantom dependency" problems. Phantom dependencies refer to dependencies used in project code that are not declared in package.json, which can happen in the flattened dependency structure of npm and yarn.
In contrast, npm and yarn use flattened dependency trees, where all dependencies (including transitive dependencies) are hoisted to the top-level node_modules directory, allowing projects to accidentally use undeclared dependencies.
Therefore, when using pnpm, this check is redundant because pnpm's dependency management mechanism itself prevents phantom dependency problems.
:::

## plugins

- **Type**: `string[]`
- **Default**: `[]`

Configure additional WinJS plugins.

Array items are paths pointing to plugins, which can be npm dependencies, relative paths, or absolute paths. If it's a relative path, it will start searching from the project root directory.

Example:

```js
export default {
  plugins: [
    // npm dependency
    'win-plugin-hello',
    // relative path
    './plugin',
    // absolute path
    `${__dirname}/plugin.js`,
  ],
}
```

## polyfill

- **Type**: `{ imports: string[] }`
- **Default**: `{}`

Set polyfills to import on demand. Imports all by default.

For example, only import the stable part of core-js:

```js
export default {
  polyfill: {
    imports: ['core-js/stable'],
  }
}
```

If you have more extreme performance requirements, consider importing on demand:

```js
export default {
  polyfill: {
    imports: ['core-js/features/promise/try', 'core-js/proposals/math-extensions'],
  }
}
```

Note: This feature is enabled by default. Configure `polyfill: false` or set environment variable `BABEL_POLYFILL=none` to disable it.

## postcssLoader

- **Type**: `object`
- **Default**: `{}`

Set [postcss-loader configuration options](https://github.com/webpack-contrib/postcss-loader#options).

## presets

- **Type**: `string[]`
- **Default**: `[]`

Configure additional WinJS preset collections.

Array items are paths pointing to preset collections, which can be npm dependencies, relative paths, or absolute paths. If it's a relative path, it will start searching from the project root directory.

Example:

```js
export default {
  presets: [
    // npm dependency
    'win-preset-hello',
    // relative path
    './preset',
    // absolute path
    `${__dirname}/preset.js`,
  ],
}
```

## preloading

- **Type**: `{ title: string; subtitle: string; } | boolean`
- **Default**: `{ title: 'Loading resources', subtitle: 'Initial resource loading may take some time, please wait patiently'}`

Loading placeholder to solve the white screen issue during initial page load. If you don't want to use this feature, set it to `false`.

::: tip Note
When we need to adjust preloading styles, the following approach is recommended:

In the `plugin.ts` file in your project, add style reset code. For example:

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

- **Type**: `object`
- **Default**: `{}`

Configure proxy functionality.

For example:

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

Then accessing `/api/users` will access the data from http://jsonplaceholder.typicode.com/users.

Note: The proxy functionality is only effective during dev.

## publicPath

- **Type**: `string`
- **Default**: `/`
- **bundler**: `webpack`, `rsbuild`

Configure webpack's publicPath and rsbuild's [output.assetPrefix](https://rsbuild.dev/config/output/asset-prefix)

## routes

- **Type**: `Route[]`
- **Default**: `[]`

Configure routes. For more information, see [Configure Routes](../guides/routes#configure-routes)

## rsbuild `<Badge type="tip" text=">=0.9.4" />`

- **Type**:
  `{ removeConsole: boolean | ConsoleType[], lightningcssLoader: boolean | Rspack.LightningcssLoaderOptions | Function, config: RsbuildConfig }`
- **Default**: `false`

Switch to rsbuild build packaging tool. Related configuration options for rsbuild.

- removeConsole: Whether to automatically remove `console.[methodName]` from code during production build phase. Defaults to `false`. When removeConsole is set to true, all types of `console.[methodName]` will be removed.
- lightningcssLoader: See [lightningcssLoader](https://rsbuild.dev/config/tools/lightningcss-loader). Defaults to `true`.
- config(`<Badge type="tip" text=">=0.11.20" />`):
  Complete and official [rsbuild config](https://rsbuild.dev/guide/basic/configure-rsbuild), can be used to override other configurations with higher priority than other configurations. This configuration is made available considering potential future custom rsbuild configurations.

```js
export default {
  rsbuild: {
    removeConsole: true
  }
}
```

You can also specify to remove only specific types of `console.[methodName]`, such as removing `console.log` and `console.warn`.

```js
 export default {
  rsbuild: {
    removeConsole: ['log', 'warn'],
  },
};
```

Currently supports configuring the following types of console:

```ts
type ConsoleType = 'log' | 'info' | 'warn' | 'error' | 'table' | 'group';
```

## run

- **Type**: `{ globals: string[] }`
- **Default**: `null`

Global injection configuration for the run command. Adding `['zx/globals']` will automatically inject `import 'zx/globals';` when using `win run ./script.ts`, eliminating the need to write `import 'zx/globals';` in every script.

## runtimePublicPath

- **Type**: `object`
- **Default**: `null`
- **bundler**: `webpack`

Enable runtime publicPath. When enabled, `window.publicPath` will be used as the starting path for dynamic resource loading.

For example:

```js
export default {
  runtimePublicPath: {},
}
```

## scripts

- **Type**: `string[] | Script[]`
- **Default**: `[]`

Configure additional script tags in the `<body>`.

1. When the value is a string, it automatically distinguishes configuration support for inline scripts and external script paths. The latter is determined by whether it starts with `https?://`.

For example:

```js
export default {
  scripts: [`alert(1);`, `https://a.com/b.js`],
}
```

Will generate HTML:

```html

<script>
  alert(1);
</script>
<script src="https://a.com/b.js"></script>
```

2. If you need additional attributes, switch to object format.

Type:

```ts
export interface Script {
  // External script
  src?: string;
  // Inline script
  content?: string;
  type?: string;
  charset?: string;
  defer?: boolean;
  async?: boolean;
  crossOrigin?: string;
  integrity?: string;
}
```

For example:

```js
export default {
  scripts: [
    { src: '/foo.js', defer: true },
    { content: `alert('Hello');`, charset: 'utf-8' },
  ],
}
```

Will generate HTML:

```html
<body>
  <script src="/foo.js" defer></script>
  <script charset="utf-8">
    alert('Hello');
  </script>
</body>
```

## sassLoader

- **Type**: `object`
- **Default**: `{}`

Configure sass-loader, see [sass-loader &gt; options](https://github.com/webpack-contrib/sass-loader#options) for details

## styleLoader

- **Type**: `object`
- **Default**: `false`

Enable style loader functionality to inline CSS in JS without outputting additional CSS files.

## stylusLoader

- **Type**: `object`
- **Default**: `{}`
- **bundler**: `webpack`, `rsbuild`

Configure stylus-loader, see [stylus-loader &gt; options](https://github.com/webpack-contrib/stylus-loader#options) for details

## styles

- **Type**: `string[]`
- **Default**: `[]`

Configure additional CSS.

1. When it is a string, the configuration supports inline styles and external style paths. The latter is determined by whether it starts with `https?://`.

The inserted styles will be prepended with lower priority than user-written styles within the project.

For example:

```js
export default {
  styles: [`body { color: red; }`, `https://a.com/b.css`],
}
```

Will generate the following HTML:

```html

<style>
  body {
    color: red;
  }
</style>
<link rel="stylesheet" href="https://a.com/b.css" />
```

2. When you need to configure additional attributes, you can use the object format.

For example:

```js
export default {
  styles: [
    {
      // External stylesheet
      src: 'https://a.com/b.css',
      // Add additional attributes
      crossorigin: 'anonymous',
      media: 'screen and (min-width: 900px)'
    },
    {
      // Inline style
      content: 'body { color: red }',
      // Add additional attributes
      media: 'print',
      'data-dark': true
    }
  ],
}
```

Will generate the following HTML:

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

- **Type**: `string` Optional values: `babel`, `swc`, `esbuild`
- **Default**: `babel`
- **bundler**: `webpack`

Configure the tool for transpiling js/ts during build.

## srcTranspilerOptions

- **Type**: `{ swc?: SwcConfig, esbuild?: EsbuildConfig }`
- **Default**: `undefined`
- **bundler**: `webpack`

If you use `swc` / `esbuild` as the `srcTranspiler`, you can further configure the transpiler through this option. See [SwcConfig](https://swc.rs/docs/configuration/swcrc) and [EsbuildConfig](https://esbuild.github.io/api/#transform-api) configuration documentation for details.

For example, adding other plugins to swc:

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

- **Type**: `object`
- **Default**: `{ chrome: 80 }`

Configure the minimum browser versions that need to be compatible. WinJS will customize polyfill imports, configure autoprefixer, and do syntax transformations based on this.

Example:

```js
export default {
  // Compatible with ie11
  targets: {
    ie: 11
  }
}
```

## theme

- **Type**: `object`
- **Default**: `{}`

Configure less variable themes.

Example:

```js
export default {
  theme: {
    '@primary-color': '#1DA57A'
  }
}
```

## title

- **Type**: `string`
- **Default**: `null`

Configure global page title, currently only supports static Title.

## transformImport `<Badge type="tip" text="^0.14.3" />`

- **Type:**

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

- **Default:** `{}`

Transform import paths, can be used for modular imports of third-party package sub-paths, with capabilities similar to [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import).

### Examples

- On-demand import of antd components

When using the antd component library (versions below v5), you can configure on-demand component imports as follows:

```ts
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

Source code:

```ts
import { Button } from 'antd';
```

Will be transformed to:

```ts
import Button from 'antd/es/button';
import 'antd/es/button/style';
```

- On-demand import of lodash
  When using lodash, you can use `transformImport` to automatically reference sub-paths, reducing bundle size.

```ts
export default defineConfig({
  transformImport: [
    {
      libraryName: 'lodash',  // [!code ++]
      customName: 'lodash/{{ member }}',  // [!code ++]
    },
  ],
});
```

Source code:

```ts
import { get } from 'lodash';
```

Will be transformed to:

```ts
import get from 'lodash/get';
```

Please avoid the following usage, otherwise all lodash code will be imported:

```ts
import _ from 'lodash';
import lodash from 'lodash';
```

### Scope of Application

`transformImport` only applies to modules compiled through bundler. Note that WinJS does not compile JavaScript files located in the node_modules directory by default. This means that code within the node_modules directory will not be processed by `transformImport`.
If you want to process code in node_modules through `transformImport`, please add the relevant modules to the [extraBabelIncludes](#extrababelincludes) configuration.

### libraryName

- **Type:**  `string`

Used to specify the module name that needs on-demand loading. When WinJS traverses the code, if it encounters an import statement for the corresponding module, it will transform it.

### libraryDirectory

- **Type:**  `string`
- **Default:** `'lib'`
  Used to splice the transformed path, with the splicing rule being `${libraryName}/${libraryDirectory}/${member}`, where member is the imported member.

Example:

```ts
import { Button } from 'foo';
```

Transformation result:

```ts
import Button from 'foo/lib/button';
```

### style

- **Type:**  `string`
- **Default:** `undefined`

Determines whether related styles need to be imported. If `true`, it will import the path `${libraryName}/${libraryDirectory}/${member}/style`. If `false` or `undefined`, styles will not be imported.
When configured as `true`:

```ts
import { Button } from 'foo';
```

Transformation result:

```ts
import Button from 'foo/lib/button';
import 'foo/lib/button/style';
```

### styleLibraryDirectory

- **Type:**  `string`
- **Default:** `undefined`

Used to splice the import path when importing styles. If this configuration is specified, the `style` configuration will be ignored. The spliced import path is `${libraryName}/${styleLibraryDirectory}/${member}`.
When configured as `styles`:

```ts
import { Button } from 'foo';
```

Transformation result:

```ts
import Button from 'foo/lib/button';
import 'foo/styles/button';
```

### camelToDashComponentName

- **Type:**  `boolean`
- **Default:** `true`

Whether camelCase imports need to be converted to kebab-case.
Example:

```ts
import { ButtonGroup } from 'foo';
```

Transformation result:

```ts
// When set to true:
import ButtonGroup from 'foo/button-group';
// When set to false:
import ButtonGroup from 'foo/ButtonGroup';
```

### transformToDefaultImport

- **Type:**  `boolean`
- **Default:** `true`

Whether to convert import statements to default imports.

Example:

```ts
import { Button } from 'foo';
```

Transformation result:

```ts
// When set to true:
import Button from 'foo/button';
// When set to false:
import { Button } from 'foo/button';
```

### customName

- **Type:**  `string`
- **Default:** `undefined`

Customize the transformed import path.
For example, the configuration below will transform `import { foo } from 'my-lib'` to `import foo from 'my-lib/foo'`.

```ts
export default defineConfig({
  transformImport: [
    {
      libraryName: 'my-lib',
      customName: `my-lib/{{ member }}`, // [!code ++]
    },
  ]
})
```

Additionally, you can declare the transformed path format, for example, setting it to `camelCase member` to convert member to camelCase format.

- `kebabCase`: lowercase letters, words connected with hyphens. Example: `my-variable-name`.
- `snakeCase`: lowercase letters, words connected with underscores. Example: `my_variable_name`.
- `camelCase`: first letter lowercase, first letter of each subsequent word capitalized. Example: `myVariableName`.
- `upperCase`: letters uppercase, other characters unchanged. Example: `MY-VARIABLE-NAME`.
- `lowerCase`: letters lowercase, other characters unchanged. Example: `my-variable-name`.

For example:

```ts
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

- **Type**: `{ absoluteRuntime: string, version: string }`
- **Default**: `{}`
- **bundler**: `webpack`

Configure some functionality of the transform-runtime plugin.

For example, if you want to use the latest @babel/runtime version, you can first configure as follows:

```js
transformRuntime: {
  absoluteRuntime: process.cwd()
}
```

Then install @babel/runtime to the project:

```bash
$ npm install @babel/runtime --save-dev
```

## verifyCommit

- **Type**: `{ scope: string[]; allowEmoji: boolean }`
- **Default**: `{ scope: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'workflow', 'build', 'ci', 'chore', 'types', 'wip', 'release', 'dep', 'deps', 'example', 'examples', 'merge', 'revert'] }`

Configuration options for the verify-commit command.

About parameters: `scope` is used to configure allowed scopes, case-insensitive, and will override the defaults when configured; `allowEmoji` when enabled will allow EMOJI prefixes, such as `💥 feat(module): added an awesome feature`.

```ts
export default {
  verifyCommit: {
    scope: ['feat', 'fix'],
    allowEmoji: true,
  }
}
```

Note: Commit messages generated by `git revert` or `git merge` commands and the release merge format of `changesets` will pass validation by default.

## vite

- **Type**: `object`
- **Default**: `{}`

Developer configuration will be merged with vite's [default configuration](https://vitejs.dev/config/).

Example:

```js
export default {
  // Change temporary file path to node_modules/.bin/.vite folder
  vite: {
    cacheDir: 'node_modules/.bin/.vite',
  }
}
```

## vue

- **Type**: `object`
- **Default**: `{}`
- **bundler**: `webpack`, `rsbuild`

When using Vue3, developers can configure [`vue-loader`](https://vue-loader.vuejs.org/options.html).

Example:

```js
export default {
  vue: {
    vueLoaderOptions: {
      compilerOptions: {
        preserveWhitespace: true,
        directives: {
          html(node, directiveMeta) {
            // XSS protection logic
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

- **Type**: `object`
- **Default**: `{}`
- **bundler**: `webpack`, `rsbuild`

When using Vue2, developers can configure [`vue-loader`](https://vue-loader.vuejs.org/options.html).

Example:

```js
export default {
  vue2: {
    vueLoaderOptions: {
      compilerOptions: {
        preserveWhitespace: true,
        directives: {
          html(node, directiveMeta) {
            // XSS protection logic
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

- **Type**: `boolean`
- **Default**: `false`
- **bundler**: `webpack`, `rsbuild`

Used to control whether development environment build artifacts are written to disk.

When enabled, an additional file output to the dist directory will be generated in dev mode, typically used for development scenarios such as Chrome extensions, Electron applications, Sketch plugins, etc. It's also commonly used to troubleshoot build artifact content or configure static resource proxy rules.

## seeOptions

- **Type**: `object`
- **Default**: `{}`

Package build output into SEE platform releases. For specific parameters, refer to [winner-deploy](https://www.npmjs.com/package/@winner-fed/winner-deploy)

Example:

```js
export default {
  seeOptions: {
    system: 'hspf-front',
    group: 'wip',
    variables: [
      {
        type: 'input',
        label: 'Service Base Path',
        name: 'API_HOME',
        required: true,
        tooltip: 'Backend service interface address',
        default: 'http://121.12.154.243:9080/h5-api-f/'
      },
      {
        type: 'switch',
        label: 'Enable Debug Tools',
        name: 'IS_OPEN_VCONSOLE',
        options: 'true:Yes;false:No',
        required: false,
        tooltip: 'Whether to enable vconsole debug tools',
        default: 'true'
      },
      {
        type: 'editor',
        label: 'Customer Tracking Integration Info',
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
      console.log('Package successful!');
    }
  }
}
```

## zipOptions

- **Type**: `object`
- **Default**: `{}`

Compress the specified directory into a zip package.

Example:

```js
export default {
  // Default values for each property, can also be customized
  zipOptions: {
    // Specify the directory to compress
    src: 'dist',
    // zip package name  
    name: `${pkg.name}-v${pkg.version}_${Date.now()}`,
    // Directory where the compressed zip package is stored  
    dest: 'dist-zip'
  }
}
```

::: warning Note

Considering that compressed package filenames cannot contain illegal characters, when `name` contains special characters, they will be replaced with **empty**.

Special characters regex: /[\[\]{};',./:"<>?!@#$%^&*()+【】、；'，。、{}|：""《》？！@#￥%……&*（）——+]*/g

:::

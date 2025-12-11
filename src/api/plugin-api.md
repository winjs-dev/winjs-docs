# Plugin API {#pluginApi}

WinJS's core lies in its plugin mechanism. Based on WinJS's plugin mechanism, you can gain the ability to extend your project's compile-time and runtime capabilities. The following lists all the plugin APIs we provide for you to help you write plugins freely.

Before using the WinJS plugin API, we recommend you first read the [Plugins](../guides/plugins) section to understand the mechanisms and principles of WinJS plugins, which will help you better use the plugin APIs.

> For easy reference, the following content is sorted alphabetically.

## Core APIs

Methods defined in service and PluginAPI.

### applyPlugins

```ts
api.applyPlugins({ key: string, type? : api.ApplyPluginsType, initialValue? : any, args? : any })
```

Gets the data from the execution of hooks registered by `register()`. This is an asynchronous function, so it returns a Promise. For examples and detailed explanations of this method, see the [register](#register) API.

### describe

```ts
api.describe({ key? : string, config? : { default, schema, onChange }, enableBy? })
```

Executed during the plugin registration stage (initPresets or initPlugins stage), used to describe the plugin or plugin set's key, configuration information, and enablement method.

- `key` is the key name for this plugin's configuration in the config
- `config.default` is the default value of the plugin configuration. When the user hasn't configured the key in the configuration, the default configuration will take effect.
- `config.schema` is used to declare the configuration type, based on [joi](https://joi.dev/). **This is required if you want users to configure it**, otherwise user configuration will be invalid
- `config.onChange` is the handling mechanism when configuration is modified in dev mode. The default value is `api.ConfigChangeType.reload`, which means the dev process will restart when the configuration item is modified in dev mode. You can also change it to `api.ConfigChangeType.regenerateTmpFiles`, which means only temporary files will be regenerated. You can also pass in a method to customize the handling mechanism.
- `enableBy` is the plugin enablement method. The default is `api.EnableBy.register`, which means registration enablement, i.e., the plugin will be enabled as long as it's registered. Can be changed to `api.EnableBy.config`, which means configuration enablement, the plugin is only enabled when the plugin's configuration item is configured. You can also customize a method that returns a boolean value (true for enabled) to determine its enablement timing, which is usually used to implement dynamic enabling.

e.g.

```ts
api.describe({
  key: 'foo',
  config: {
    schema(joi) {
      return joi.string();
    },
    onChange: api.ConfigChangeType.regenerateTmpFiles,
  },
  enableBy: api.EnableBy.config,
})
```

In this example, the plugin's `key` is `foo`, so the key name in the configuration is `foo`, the configuration type is string, when the `foo` configuration changes, dev will only regenerate temporary files. This plugin will only be enabled after the user configures `foo`.

### isPluginEnable

```ts
api.isPluginEnable(key：string)
```

Determines whether a plugin is enabled. The parameter passed in is the plugin's key.

### register

```ts
api.register({ key: string, fn, before? : string, stage? : number })
```

Registers hooks for use by `api.applyPlugins`.

- `key` is the category name of the registered hook. You can use `register` multiple times to register hooks to the same `key`, and they will be executed in sequence. This `key` is also the same `key` used when using `applyPlugins` to collect hooks data. Note: **this key has no relationship with the plugin's key.**
- `fn` is the hook definition, which can be synchronous or asynchronous (just return a Promise)
- `stage` is used to adjust execution order, default is 0. Set to -1 or less will execute earlier, set to 1 or more will execute later.
- `before` is also used to adjust execution order, the value passed in is the name of the registered hook. Note: **the name of the hook registered by `register` is the id of the WinJS plugin it belongs to.** For more usage of stage and before, refer to [tapable](https://github.com/webpack/tapable)

The writing of fn needs to be determined in combination with the type parameter of the applyPlugins that will be used:

- `api.ApplyPluginsType.add` `applyPlugins` will concatenate their return values into an array according to hook order. At this time, `fn` needs to have a return value, and `fn` will receive the `args` parameter of `applyPlugins` as its own parameter. The `initialValue` of `applyPlugins` must be an array, with a default value of empty array. When `key` starts with `'add'` and no `type` is explicitly declared, `applyPlugins` will execute according to this type by default.
- `api.ApplyPluginsType.modify` `applyPlugins` will sequentially modify the `initialValue` received by `applyPlugins` according to hook order, so **`initialValue` is required** at this time. At this time, `fn` needs to receive a `memo` as its first parameter, and will take the `args` parameter of `applyPlugins` as its second parameter. `memo` is the result of the previous series of hooks modifying `initialValue`, and `fn` needs to return the modified `memo`. When `key` starts with `'modify'` and no `type` is explicitly declared, `applyPlugins` will execute according to this type by default.
- `api.ApplyPluginsType.event` `applyPlugins` will execute sequentially according to hook order. At this time, there's no need to pass in `initialValue`. `fn` doesn't need to have a return value, and will take the `args` parameter of `applyPlugins` as its own parameter. When `key` starts with `'on'` and no `type` is explicitly declared, `applyPlugins` will execute according to this type by default.

e.g.1 add type

```ts
api.register({
  key: 'addFoo',
  // synchronous
  fn: (args) => args
});

api.register({
  key: 'addFoo',
  // asynchronous
  fn: async (args) => args * 2
})

api.applyPlugins({
  key: 'addFoo',
  // key is add type, no need to explicitly declare as api.ApplyPluginsType.add
  args: 1
}).then((data) => {
  console.log(data); // [1,2]
})
```

e.g.2 modify type

```ts
api.register({
  key: 'foo',
  fn: (memo, args) => ({ ...memo, a: args })
})
api.register({
  key: 'foo',
  fn: (memo) => ({ ...memo, b: 2 })
})
api.applyPlugins({
  key: 'foo',
  type: api.ApplyPluginsType.modify,
  // initialValue is required
  initialValue: {
    a: 0,
    b: 0
  },
  args: 1
}).then((data) => {
  console.log(data); // { a: 1, b: 2 }
});
```

### registerCommand

```ts
api.registerCommand({
  name: string,
  description? : string,
  options? : string,
  details? : string,
  fn,
  alias? : string | string[]
  resolveConfigMode? : 'strict' | 'loose'
})
```

Registers a command.

- `alias` is an alias, such as the alias `g` for generate
- The parameter of `fn` is `{ args }`, args format is the same as [yargs](https://github.com/yargs/yargs) parsing result. Note that the command itself in `_` has been removed, for example, when executing `win generate page foo`, `args._` is `['page','foo']`
- The `resolveConfigMode` parameter controls the configuration parsing method when executing commands. In `strict` mode, it strictly validates the WinJS project's configuration file content, and interrupts command execution if there's illegal content; in `loose` mode, it doesn't perform configuration file validation checks.

### registerMethod

```ts
api.registerMethod({ name: string, fn? })
```

Register a method named `'name'` on the api.

- When `fn` is passed, execute the `fn`
- When `fn` is not passed, `registerMethod` will use `name` as the `key` for `api.register` and curry it as `fn`. In this case, it's equivalent to registering a shortcut for `register`, making it convenient to register hooks.

Note:

- It's generally not recommended to register additional methods since they won't have TypeScript hints. Using `api.register()` directly is a safer approach.

e.g.1

```ts
api.registerMethod({
  name: foo,
  // with fn
  fn: (args) => {
    console.log(args);
  }
})
api.foo('hello, win!'); // hello, win!
```

In this example, we register a `foo` method on the api that logs the parameter to the console.

e.g.2

```ts
import api from './api';

api.registerMethod({
  name: 'addFoo'
  // without fn
})

api.addFoo(args => args);
api.addFoo(args => args * 2);

api.applyPlugins({
  key: 'addFoo',
  args: 1
}).then((data) => {
  console.log(data); // [ 1, 2 ]
});
```

In this example, we don't pass `fn` to `api.registerMethod`. At this point, we're essentially registering a "registrar" on the api: `addFoo`. Each call to this method is equivalent to calling `register({ key: 'addFoo', fn })`. Therefore, when we use `api.applyPlugins` (since our method is of the add type, we don't need to explicitly declare its type), we can get the values from the hooks we just registered.

### registerPresets

```ts
api.registerPresets(presets
:
string[]
)
```

Register plugin presets, the parameter is an array of paths. This API must be executed in the initPresets stage, meaning it can only be used in presets to register other presets.

e.g.

```ts
api.registerPresets([
  './preset',
  require.resolve('./preset_foo')
])
```

### registerPlugins

```ts
api.registerPlugins(plugins
:
string[]
)
```

Register plugins, the parameter is an array of paths. This API must be executed in the initPresets and initPlugins stages.

e.g.

```ts
api.registerPlugins([
  './plugin',
  require.resolve('./plugin_foo')
])
```

Note: Only plugin paths are allowed to be passed.

### registerGenerator

Register micro-generators for quickly generating template code.

Example:

```ts
import { GeneratorType } from '@winner-fed/core';
import { logger } from '@winner-fed/utils';
import { join } from 'path';
import { writeFileSync } from 'fs';

api.registerGenerator({
  key: 'editorconfig',
  name: 'Create .editorconfig',
  description: 'Setup editorconfig config',
  type: GeneratorType.generate,
  fn: () => {
    const configFilePath = join(api.cwd, '.editorconfig')
    if (existsSync(configFilePath)) {
      logger.info(`The .editorconfig file already exists.`)
      return
    }
    writeFileSync(
      configFilePath,
      `
# 🎨 http://editorconfig.org
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
[*.md]
trim_trailing_whitespace = false
`.trimStart(),
      'utf-8'
    )
    logger.info(`Generate .editorconfig file successful.`)
  }
})
```

### skipPlugins

```ts
api.skipPlugins(keys
:
string[]
)
```

Declare which plugins need to be disabled, the parameter is an array of plugin keys.

## Extension Methods

Methods extended through `api.registerMethod()`, their purpose is to register hooks for use, so they all need to receive a `fn`. Most of these methods are named in the pattern of `add-`, `modify-`, `on-`, which correspond to the three types of `api.ApplyPluginsType`. Different types receive different `fn` parameters, see the [register](#register) section for details.

Note: All `fn` mentioned below can be synchronous or asynchronous (just return a Promise). All `fn` can be replaced by:

```ts
{
  fn,
  name?: string,
  before?: string | string[],
  stage: number,
}
```

For the purpose of each parameter, see [tapable](https://github.com/webpack/tapable).

### addBeforeBabelPlugins

Add additional Babel plugins. The passed `fn` requires no parameters and should return a Babel plugin or an array of plugins.

```ts
api.addBeforeBabelPlugins(() => {
  // Return a Babel plugin (example from Babel official website)
  return () => {
    visitor: {
      Identifier(path)
      {
        const name = path.node.name;
        path.node.name = name.split("").reverse().join("");
      }
    }
  }
})
```

### addBeforeBabelPresets

Add additional Babel presets. The passed `fn` requires no parameters and should return a Babel preset or an array of presets.

```ts
api.addBeforeBabelPresets(() => {
  // Return a Babel preset
  return () => {
    return {
      plugins: ["Babel_Plugin_A", "Babel_Plugin_B"]
    }
  }
})
```

### addBeforeMiddlewares

Add middleware before webpack-dev-middleware. The passed `fn` requires no parameters and should return an express middleware or an array of middlewares.

```ts
api.addBeforeMiddlewares(() => {
  return (req, res, next) => {
    if (false) {
      res.end('end');
    }
    next();
  }
})
```

### addEntryCode

Add code at the end of the entry file (after render). The passed `fn` requires no parameters and should return a string or an array of strings.

```ts
api.addEntryCode(() => `console.log('I am after render!')`);
```

### addEntryCodeAhead

Add code at the beginning of the entry file (before render, after imports). The passed `fn` requires no parameters and should return a string or an array of strings.

```ts
api.addEntryCodeAhead(() => `console.log('I am before render!')`)
```

### addEntryImports

Add import statements to the entry file (at the end of imports). The passed `fn` requires no parameters and should return a `{source: string, specifier?: string}` object or an array of such objects.

```ts
api.addEntryImports(() => ({
  source: '/modulePath/xxx.js',
  specifier: 'moduleName'
}))
```

### addEntryImportsAhead

Add import statements to the entry file (at the beginning of imports). The passed `fn` requires no parameters and should return a `{source: string, specifier?: string}` object or an array of such objects.

```ts
api.addEntryImportsAhead(() => ({
  source: 'anyPackage'
}))
```

### addExtraBabelPlugins

Add additional Babel plugins. The passed `fn` requires no parameters and should return a Babel plugin or an array of plugins.

### addExtraBabelPresets

Add additional Babel presets. The passed `fn` requires no parameters and should return a Babel preset or an array of presets.

### addHTMLHeadScripts

Add Script tags to the HTML `<head>` element. The passed `fn` requires no parameters and should return a string (the code to be added) or
`{ async?: boolean, charset?: string, crossOrigin?: string | null, defer?: boolean, src?: string, type?: string, content?: string }`
or an array of them.

```ts
api.addHTMLHeadScripts(() => `console.log('I am in HTML-head')`)
```

### addHTMLLinks

Add Link tags to HTML. The passed `fn` requires no parameters and returns an object or an array of objects with the following interface:

```ts
{
  as?: string,
  crossOrigin: string | null,
  disabled?: boolean,
  href?: string,
  hreflang?: string,
  imageSizes?: string,
  imageSrcset?: string,
  integrity?: string,
  media?: string,
  referrerPolicy?: string,
  rel?: string,
  rev?: string,
  target?: string,
  type?: string
}
```

### addHTMLMetas

Add Meta tags to HTML. The passed `fn` requires no parameters and returns an object or an array of objects with the following interface:

```ts
{
  content?: string,
  'http-equiv'?: string,
  name?: string,
  scheme?: string
}
```

For example,

```js
api.addHTMLMetas(() => [
  {
    'http-equiv': 'Cache-Control',
    'content': 'no-store, no-cache, must-revalidate'
  },
  {
    'http-equiv': 'Pragma',
    'content': 'no-cache'
  },
  {
    'http-equiv': 'Expires',
    'content': '0'
  }
]);
```

### addHTMLScripts

Add Script tags to the HTML footer. The passed `fn` requires no parameters and returns an object with the same interface as [addHTMLHeadScripts](#addhtmlheadscripts).

### addHTMLStyles

Add Style tags to HTML. The passed `fn` requires no parameters and returns a string (the code inside the style tag) or
`{ type?: string, content?: string }`, or an array of them.

### addLayouts

Add global layout components. The passed `fn` requires no parameters and returns `{ id?: string, file: string }`.

### addMiddlewares

Add middleware after the route middleware. The passed `fn` requires no parameters and returns express middleware.

### addPolyfillImports

Add polyfill imports to be executed at the very beginning of the entire application. The passed `fn` requires no parameters and returns `{ source: string, specifier?: string }`.

### addPrepareBuildPlugins

### addRuntimePlugin

Add runtime plugins. The passed `fn` requires no parameters and returns a string representing the plugin path.

### addRuntimePluginKey

Add runtime plugin keys. The passed `fn` requires no parameters and returns a string representing the plugin path.

### addTmpGenerateWatcherPaths

Add watch paths that will regenerate temporary files when changed. The passed `fn` requires no parameters and returns a string representing the path to watch.

### addOnDemandDeps

Add on-demand dependencies that will be checked for installation when the project starts:

```ts
  api.addOnDemandDeps(() => [{ name: '@swc/core', version: '^1.0.0', dev: true }])
```

### chainWebpack

Modify webpack configuration through [webpack-chain](https://github.com/neutrinojs/webpack-chain). Pass in a `fn` that doesn't need to return a value. It will receive two parameters:

- `memo` corresponds to webpack-chain's config
- `args: { webpack, env }` where `args.webpack` is the webpack instance and `args.env` represents the current runtime environment.

e.g.

```ts
api.chainWebpack((memo, { webpack, env }) => {
  // set alias
  memo.resolve.alias.set('a', 'path/to/a');
  // Delete progress bar plugin
  memo.plugins.delete('progress');
})
```

### modifyAppData

Modify app metadata. The passed `fn` receives appData and returns it.

```ts
api.modifyAppData((memo) => {
  memo.foo = 'foo';
  return memo;
})
```

### modifyBundlerChain

`modifyBundlerChain` is used to call rspack-chain to modify Rspack configuration.
`rspack-chain` is a utility library for configuring Rspack. It provides a chainable API that makes configuring Rspack more flexible. By using `rspack-chain`, you can more conveniently modify and extend Rspack configuration without directly manipulating complex configuration objects.

You can refer to [Configure Rspack](https://rsbuild.dev/guide/basic/configure-rspack#toolsbundlerchain).

- **Type:**

```ts
type ModifyBundlerChainUtils = {
  environment: EnvironmentContext;
  env: NodeEnv;
  isDev: boolean;
  isProd: boolean;
  target: RsbuildTarget;
  isServer: boolean;
  isWebWorker: boolean;
  CHAIN_ID: ChainIdentifier;
  HtmlPlugin: typeof import('html-rspack-plugin');
  bundler: {
    BannerPlugin: rspack.BannerPlugin;
    DefinePlugin: rspack.DefinePlugin;
    IgnorePlugin: rspack.IgnorePlugin;
    ProvidePlugin: rspack.ProvidePlugin;
    HotModuleReplacementPlugin: rspack.HotModuleReplacementPlugin;
  };
};

function ModifyBundlerChain(
  callback: (
    chain: RspackChain,
    utils: ModifyBundlerChainUtils,
  ) => Promise<void> | void,
): void;
```

- **Example:**

```ts
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

api.modifyBundlerChain((chain, utils) => {
  if (utils.env === 'development') {
    chain.devtool('eval');
  }
  
  chain.plugin('bundle-analyze').use(BundleAnalyzerPlugin);
});
```

### modifyClientRenderOpts

`modifyClientRenderOpts` is a runtime plugin hook provided by WinJS for modifying render options before client-side rendering. Through this hook, when using `Vue2`, you can customize core instances such as router, store, pinia, etc., to achieve highly customized application initialization.

#### Basic Usage

Export the `modifyClientRenderOpts` function in `src/app.js`:

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    // Add or modify render options here
  };
}
```

#### Parameters: memo Object

`memo` is the passed render options object, containing the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `routes` | `IRoutesById` | WinJS route configuration object (key-value format) |
| `routeComponents` | `IRouteComponents` | Route component mapping table |
| `pluginManager` | `PluginManager` | Plugin manager instance |
| `rootElement` | `HTMLElement` | Mount root element |
| `history` | `History` | Route history object (Vue Router 3.x is `{ base, mode }`) |
| `basename` | `string` | Route base path |
| `publicPath` | `string` | Public resource path |
| `runtimePublicPath` | `boolean` | Whether to use runtime public path |

#### Return Value

Returns a modified render options object that must include all original properties of `memo`.

#### Usage Scenarios

##### Scenario 1: Pass Custom Router Instance

**Use Case**: Need complete control over router instance, micro-frontend scenarios, using third-party routing libraries (Vue Router 3.x, Vue 2.x)

```javascript
import customRouter from './router/index';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter
  };
}
```

**Create custom router**:

```javascript
// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import { routes } from './routes';

// Must register plugin first
Vue.use(Router);

const router = new Router({ 
  mode: 'hash', 
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

// Add global route guards
router.beforeEach((to, from, next) => {
  // Permission verification logic
  next();
});

export default router;
```

##### Scenario 2: Pass Vuex Store

**Use Case**: Using Vuex for state management (Vue 2.x)

```javascript
import store from './stores';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    store: store
  };
}
```

**Create Vuex store**:

```javascript
// src/stores/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: ''
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      // Login logic
      return api.login({ username, password }).then(res => {
        commit('SET_USER', res.user);
        commit('SET_TOKEN', res.token);
      });
    }
  }
});
```

##### Scenario 3: Pass Pinia

**Use Case**: Using Pinia for state management (Vue 2.7+)

```javascript
import { createPinia } from 'pinia';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    pinia: createPinia()
  };
}
```

##### Scenario 4: Pass Multiple Instances Simultaneously

**Use Case**: Need to customize both router and store

```javascript
import customRouter from './router/index';
import store from './stores';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter,
    store: store
  };
}
```

##### Scenario 5: Modify Other Render Options

**Use Case**: Customize root element, modify base path, etc.

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    // Customize root element
    rootElement: document.getElementById('app'),
    
    // Modify base path
    basename: '/my-app/',
    
    // Add custom properties
    customOption: 'custom-value'
  };
}
```

#### Recommended Approach (Direct Pass)

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter,
    store: store,
    pinia: createPinia()
  };
}
```

#### Compatible Approach (Via Callback)

```javascript
export function modifyClientRenderOpts(memo) {
  const callback = () => {
    return {
      store: store,
      pinia: createPinia()
    };
  };
  return {
    ...memo,
    router: customRouter,
    callback
  };
}
```

### modifyConfig

Modify configuration. Compared to user configuration, this is the final configuration passed to WinJS. The passed `fn` receives config as the first parameter and returns it. Additionally, `fn` can receive `{ paths }` as the second parameter. `paths` contains various paths of WinJS.

```ts
api.modifyConfig((memo, { paths }) => {
  memo.alias = {
    ...memo.alias,
    '@': paths.absSrcPath
  }
  return memo;
})
```

### modifyDefaultConfig

Modify default configuration. The passed `fn` receives config and returns it.

### modifyHTML

Modify HTML based on cheerio's AST. The passed `fn` receives cheerioAPI and returns it. Additionally, `fn` can receive `{ path }` as its second parameter, which represents the route path.

```ts
api.modifyHTML(($, { path }) => {
  $('h2').addClass('welcome');
  return $;
})
```

### modifyHTMLFavicon

Modify the HTML favicon path. The passed `fn` receives the original favicon path (string type) and returns it.

### modifyPaths

Modify paths, such as absOutputPath and absTmpPath. The passed `fn` receives paths and returns it.

The paths interface is as follows:

```ts
paths:{
  cwd?: string;
  absSrcPath?: string;
  absPagesPath?: string;
  absTmpPath?: string;
  absNodeModulesPath?: string;
  absOutputPath?: string;
}
```

### modifyRendererPath

Modify renderer path. The passed `fn` receives the original path (string type) and returns it.

### modifyServerRendererPath

Modify server renderer path. The passed `fn` receives the original path (string type) and returns it.

### modifyRoutes

Modify routes. The passed `fn` receives an id-route map and returns it. The route interface is as follows:

```ts
interface IRoute {
  path: string;
  file?: string;
  id: string;
  parentId?: string;
  
  [key: string]: any;
}
```

e.g.

```ts
api.modifyRoutes((memo) => {
  Object.keys(memo).forEach((id) => {
    const route = memo[id];
    if (route.path === '/') {
      route.path = '/redirect'
    }
  });
  return memo;
})
```

### modifyRsbuildConfig

Modify the configuration options passed to Rsbuild. You can directly modify the passed config object or return a new object to replace the passed object.

You can refer to [Configure Rsbuild](https://rsbuild.dev/guide/basic/configure-rsbuild).

- **Type:**

```ts
import { RsbuildConfig, Rspack, rspack } from '@rsbuild/core';

export enum Env {
  development = 'development',
  production = 'production',
}

function ModifyRsbuildConfig(
  callback: (
    config: RsbuildConfig,
    args: {
      env: Env;
      rspack: typeof rspack
    },
  ) => MaybePromise<RsbuildConfig | void>,
): void;
```

- **Example:** Set a default value for a configuration option:

```ts
api.modifyRsbuildConfig((config) => {
  config.html ||= {};
  config.html.title = 'My Default Title';
  
  return config;
});
```

### modifyRspackConfig

Modify the final Rspack configuration. You can directly modify the passed config object or return a new object to replace the passed object.

You can refer to [Configure Rspack](https://rsbuild.dev/guide/basic/configure-rspack).

- **Type:**

```ts
type ModifyRspackConfigUtils = {
  environment: EnvironmentContext;
  env: NodeEnv;
  isDev: boolean;
  isProd: boolean;
  target: RsbuildTarget;
  isServer: boolean;
  isWebWorker: boolean;
  rspack: Rspack;
};

function ModifyRspackConfig(
  callback: (
    config: RspackConfig,
    utils: ModifyRspackConfigUtils,
  ) => Promise<RspackConfig | void> | RspackConfig | void,
): void;
```

- **Example:**

```ts
api.modifyRspackConfig((config, utils) => {
  if (utils.env === 'development') {
    config.devtool = 'eval-cheap-source-map';
  }
});
```

### modifyTSConfig

Modify the content of the tsconfig file in the temporary directory.

```ts
api.modifyTSConfig((memo) => {
  memo.compilerOptions.paths['foo'] = ['bar'];
  return memo;
});
```

### modifyViteConfig

Modify the final Vite configuration. The passed `fn` receives Vite's Config object as the first parameter and returns it. Additionally, `fn` can receive `{ env }` as the second parameter to get the current environment.

```ts
api.modifyViteConfig((memo, { env }) => {
  if (env === 'development') {
    // do something
  }
  return memo;
})
```

### modifyWebpackConfig

Modify the final webpack configuration. The passed `fn` receives webpack's Config object as the first parameter and returns it. Additionally, `fn` can receive `{ webpack, env }` as the second parameter, where webpack is the webpack instance and env represents the current environment.

```ts
api.modifyWebpackConfig((memo, { webpack, env }) => {
  // do something
  
  return memo;
})
```

### onBeforeCompiler

After generate, before webpack / vite / rsbuild compiler. The passed `fn` receives no parameters.

### onBeforeMiddleware

Provides the ability to execute custom middleware before all other middleware is executed internally by the server. This can be used to define custom handlers, for example:

```ts
api.onBeforeMiddleware(({ app }) => {
  app.get('/some/path', function (req, res) {
    res.json({ custom: 'response' });
  });
});
```

### onBuildComplete

When build is complete. The passed `fn` receives `{ isFirstCompile: boolean, stats, time: number, err?: Error }` as parameters.

### onBuildHtmlComplete

After build is complete and HTML construction is finished. The passed `fn` receives parameters with the following interface:

```ts
args: {
  htmlFiles?: Array<{ path: string, content: string }>
}
```

- **path**: HTML file path
- **content**: HTML file content

For example:

```ts
htmlFiles: [
  {
    path: 'index.html',
    content: '<!DOCTYPE html><html lang="zh-CN"><head>\n' +
      '<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">\n' +
      '<meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
      '<meta name="renderer" content="webkit">\n' +
      '<meta name="mobile-web-app-capable" content="yes">\n' +
      '<meta name="apple-mobile-web-app-status-bar-style" content="black">\n' +
      '<meta name="telephone=no" content="format-detection">\n' +
      '<meta name="email=no" content="format-detection">\n' +
      '<style>\n' +
      '  html,\n' +
      '  body,\n' +
      '  #root {\n' +
      '      height: 100%;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '  }</style>\n' +
      '</head>\n' +
      '<body>\n' +
      '\n' +
      '  <div id="root">\n' +
      '<div style="\n' +
      '          display: flex;\n' +
      '          flex-direction: column;\n' +
      '          align-items: center;\n' +
      '          justify-content: center;\n' +
      '          height: 100%;\n' +
      '          min-height: 362px;\n' +
      '        ">\n' +
      '    <div class="loading-title">\n' +
      '      Loading resources\n' +
      '    </div>\n' +
      '    <div class="loading-sub-title">\n' +
      '      Initial resource loading may take some time, please wait patiently\n' +
      '    </div>\n' +
      '</div>\n' +
      '</div>\n' +
      '\n' +
      '<script src="/win.js"></script>\n' +
      '\n' +
      '</body></html>'
  }
]
```

### onCheck

During check, executed before onStart. The passed `fn` receives no parameters.

### onCheckCode

When checking code. The passed `fn` receives parameters with the following interface:

```ts
args: {
  file: string;
  code: string;
  isFromTmp: boolean;
  imports: {
    source: string;
    loc: any;
    default: string;
    namespace: string;
    kind: babelImportKind;
    specifiers: Record<string, { name: string; kind: babelImportKind }>;
  }[];
  exports: any[];
  cjsExports: string[];
}
```

### onCheckConfig

When checking config. The passed `fn` receives `{ config, userConfig }` as parameters, which represent the actual configuration and user configuration respectively.

### onCheckPkgJSON

When checking package.json. The passed `fn` receives `{origin?, current}` as parameters. Both types are package.json objects.

### onDevCompileDone

When dev is complete. The passed `fn` receives parameters with the following interface:

```ts
args: {
  isFirstCompile: boolean;
  stats: any;
  time: number;
}
```

### onGenerateFiles

When generating temporary files, frequently triggered as files change, with caching. The passed `fn` receives parameters with the following interface:

```ts
args: {
  isFirstTime?: boolean;
  files?: {
    event: string;
    path: string;
  } | null;
}
```

### onPatchRoute

Match a single route, can modify the route and patch it.

### onPkgJSONChanged

When package.json changes. The passed `fn` receives `{origin?, current}` as parameters. Both types are package.json objects.

### onPrepareBuildSuccess

### onStart

When starting. The passed `fn` receives no parameters.

### writeTmpFile

The type parameter type for `api.writeTmpFile()`.

- content: The text content to write. If there is content, templates will not be used.
- context: Template context.
- noPluginDir: Whether to use the plugin name as the directory.
- path: The path of the file to write.
- tpl: Use template string, will be used if there is no template path.
- tplPath: The path of the template file to use.

## Properties

Properties that can be directly accessed from the api, some of which come from the service.

### appData

### args

Command line arguments with the command itself removed.

e.g.

- `$ win dev --foo`, args is `{ _:[], foo: true }`
- `$ win g page index --typescript --less` , args is `{ _: [ 'page', 'index''], typescript: true, less: true }`

### config

The final configuration (depending on when you access it, it may be the current collected final configuration).

### cwd

Current path.

### env

i.e., `process.env.NODE_ENV` which can be `development`, `production`, or `test`.

### logger

Plugin logger object containing `{ log, info, debug, error, warn, profile }`, all of which are methods. `api.logger.profile` can be used for performance timing recording.

```ts
api.logger.profile('barId');
setTimeout(() => {
  api.logger.profile('barId');
})
// profile - barId Completed in 6254ms
```

### name

The name of the current command, for example `$ win dev`, `name` would be `dev`.

### paths

Project-related paths:

- `absNodeModulesPath`, absolute path to node_modules directory
- `absOutputPath`, output path, defaults to ./dist
- `absPagesPath`, absolute path to pages directory
- `absSrcPath`, absolute path to src directory. Note that the src directory is optional; if there is no src directory, absSrcPath is equivalent to cwd
- `absTmpPath`, absolute path to temporary directory
- `cwd`, current path

Note: Cannot be obtained during the registration phase. Therefore, it cannot be accessed directly in plugins and must be used in hooks.

### pkg

The current project's `package.json` object.

### pkgPath

The absolute path to the current project's `package.json`.

### plugin

The current plugin object.

- `type` Plugin type, either preset or plugin
- `path` Plugin path
- `id` Plugin id
- `key` Plugin key
- `config` Plugin configuration
- `enableBy` Plugin enablement method

Note: The plugin object used during the registration phase is the object before you `describe`.

### service

WinJS's `Service` instance. Usually not needed unless you know why.

### userConfig

User configuration read from `.winrc` or `config/config`, without any processing by defaultConfig or plugins. Can be used during the registration phase.

### ApplyPluginsType

The type parameter type for `api.applyPlugins()`. Contains:

- add
- modify
- event

### ConfigChangeType

The type for `config.onChange` provided to `api.describe()`, currently includes two types:

- restart, restart the dev process, is the default value
- regenerateTmpFiles, regenerate temporary files

### EnableBy

Plugin enablement methods, includes three types:

- register
- config

### ServiceStage

WinJS service runtime stages. Has the following stages:

- uninitialized
- init
- initPresets
- initPlugins
- resolveConfig
- collectAppData
- onCheck
- onStart
- runCommand

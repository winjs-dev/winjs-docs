# Plugin Development {#plugins}

> You can also refer to [UMI Plugin Mechanism](https://umijs.org/docs/guides/plugins).    

WinJS's core lies in its plugin mechanism. Based on WinJS's plugin mechanism, you can gain the ability to extend your project's compile-time and runtime capabilities. You can use the [Plugin API](../api/plugin-api) we provide to freely write plugins, achieving rich functionality such as modifying code bundling configurations, modifying startup code, defining directory structures, and modifying HTML.

## Core Concepts
A plugin is essentially a function that receives a parameter: api. In the plugin, you can call methods provided by the api to register hooks, and WinJS will execute these hooks at specific times.

For example:
```js
import { IApi } from 'win';

export default (api: IApi) => {
  api.describe({
    key: 'changeFavicon',
    config: {
      schema({ zod }) {
        return zod.string();
      },
    },
    enableBy: api.EnableBy.config
  });
  api.modifyConfig((memo)=>{
    memo.favicon = api.userConfig.changeFavicon;
    return memo;
  });
};
```
This plugin's purpose is to modify the favicon in the configuration based on the user-configured changeFavicon value (a simple example with no practical use). You can see that a plugin is essentially a function that receives the api parameter. In this function, we called `api.modifyConfig` to register a hook: `(memo)=>{...}`. When you configure `changeFavicon` in the configuration, WinJS will register this plugin. During WinJS's configuration collection lifecycle, the hook we registered in the plugin will be executed, and the `favicon` in the configuration will be modified to the `changeFavicon` value from the user configuration.

### Plugin and Preset
The purpose of a preset is to pre-configure some plugins. It's typically used to register a batch of presets and plugins. In a preset, the aforementioned function that accepts the api parameter can have a return value - an object containing plugins and presets properties, whose purpose is to register corresponding plugins or plugin collections.

For example:
```js
import { IApi } from 'win';

export default (api: IApi) => {
  return {
    plugins: ['./plugin_foo','./plugin_bar'],
    presets: ['./preset_foo']
  }
};
```
Their registration order is noteworthy: presets are always registered before plugins. WinJS maintains two queues to sequentially register presets and plugins respectively. In this example, the registered `preset_foo` will be placed at the head of the presets queue, while `plugin_foo` and `plugin_bar` will be placed sequentially at the tail of the plugins queue. The purpose of placing presets at the head is to ensure that the order and relationships between presets are controllable.

Another point worth noting: in a plugin, you can also return some plugins or presets, but WinJS won't do anything with them.

### Plugin ID and Key
Each plugin corresponds to an id and a key.

The id is a shorthand for the plugin's path, serving as the plugin's unique identifier; while the key is the key name used for plugin configuration.

For example, for plugin `node_modules/@winner-fed/plugin-foo/index.js`, typically its id is `@winner-fed/plugin-foo` and its key is `foo`. This allows developers to configure an item with key name `foo` in the configuration to configure the plugin.

## Quick Start

WinJS provides an official plugin template to help you quickly create and develop your own plugins.

### Using the Plugin Template

Visit the [winjs-plugin-template](https://github.com/winjs-dev/winjs-plugin-template) repository and click the "Use this template" button to create your own plugin project.

### Development Steps

#### 1. Modify Package Name

Modify the following fields in `package.json`:

```json
{
  "name": "your-plugin-name",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/your-plugin-name.git"
  }
}
```

#### 2. Update Documentation

Update all package name references in `README.md`, replacing `winjs-plugin-example` with your new package name.

#### 3. Modify Plugin Configuration

Modify the `key` value (default is `example`) in `src/index.ts` to your plugin configuration key:

```ts
api.describe({
  key: 'yourPluginKey', // Change to your plugin key
  config: {
    schema({ zod }) {
      // Define configuration validation rules
    },
  },
  enableBy: api.EnableBy.config
});
```

#### 4. Development and Testing

Install dependencies:

```shell
pnpm install
```

Development mode (watch files and auto-rebuild):

```shell
pnpm run dev
```

Test the plugin in the `playground` directory:

```shell
cd playground
pnpm install
pnpm run dev
```

#### 5. Build and Publish

Build the project:

```shell
pnpm run build
```

Code format check:

```shell
pnpm run lint
```

Run tests:

```shell
pnpm run test
```

For more details, visit [winjs-plugin-template](https://github.com/winjs-dev/winjs-plugin-template).

## Enabling Plugins
There are two ways to enable plugins: through environment variables and through configuration.

Note: The plugins mentioned here refer to third-party plugins. WinJS's built-in plugins are uniformly enabled in configuration by configuring their keys.

### Environment Variables

You can also register additional plugins through environment variables `WIN_PRESETS` and `WIN_PLUGINS`.

For example:
```shell
$ WIN_PRESETS = foo/preset.js win dev
```
Note: Not recommended for use in projects, typically used for secondary encapsulation of frameworks based on WinJS.

### Configuration
Configure plugins through `presets` and `plugins` in the configuration, for example:
```js
export default {
  presets: ['./preset/foo','bar/presets'],
  plugins: ['./plugin', require.resolve('plugin_foo')]
}
```
The configuration content is the path to the plugins.

### Plugin Order

WinJS plugin registration follows a certain order:
- All presets are registered before plugins.
- Built-in plugins -> Environment variable plugins -> User configuration plugins
- Plugins registered simultaneously (in the same array) are registered in order.
- Presets registered in a preset execute immediately, while plugins registered are executed last.

## Disabling Plugins
There are two ways to disable plugins

### Setting Key to false
For example:
```js
export default{
  mock: false
}
```
This will disable WinJS's built-in mock plugin.

### Disabling Other Plugins in a Plugin
You can disable through `api.skipPlugins(pluginId[])`, see [Plugin API](../api/plugin-api) for details.

## Viewing Plugin Registration
### Command Line
```shell
$ win plugin list
```

## Configuring Plugins
Configure plugins by configuring the plugin's key, for example:
```js
export default{
  mock: { exclude: ['./foo'] }
}
```
Here, mock is the key of WinJS's built-in mock plugin.

For another example, if we install a plugin `win-plugin-bar`, its default key is `bar`, and we can configure:
```js
export default{
  bar: { ... }
}
```

### Default Naming Rules for Plugin Keys
If the plugin is a package, the default value of the key will be the package name with the prefix removed. For example, `@winner-fed/plugin-foo`'s key defaults to `foo`, and `win-plugin-bar`'s key defaults to `bar`. It's worth noting that this default rule requires your package name to conform to WinJS plugin naming conventions.

If the plugin is not a package, the default value of the key will be the plugin's filename. For example, `./plugins/foo.js`'s key defaults to `foo`.

To avoid unnecessary trouble, we recommend explicitly declaring the key for plugins you write yourself.

## WinJS Lifecycle

### Lifecycle

- init stage: In this stage, WinJS loads various configuration information, including: loading `.env` files; requiring `package.json`; loading user configuration information; resolving all plugins (built-in plugins, environment variables, user configuration in sequence).
- initPresets stage: In this stage, WinJS registers presets. Presets can add additional plugins through `return { presets, plugins }` when registering. Presets will be added to the head of the presets queue, while plugins will be added to the tail of the plugins queue.
- initPlugins stage: In this stage, WinJS registers plugins. The plugins here include additional plugins added by presets from the previous stage. A noteworthy point is that although plugins can also `return { presets, plugins }`, WinJS won't perform any operations on them. Plugin initialization is actually executing the plugin's code (but the plugin's code essentially just calls the api to register various hooks, and the execution of hooks is not performed at this stage, hence this is called plugin registration).
- resolveConfig stage: In this stage, WinJS organizes the definitions of `config schema` from various plugins, then executes plugin hooks like `modifyConfig`, `modifyDefaultConfig`, `modifyPaths`, etc., to collect configurations.
- collectionAppData stage: In this stage, WinJS executes the `modifyAppData` hook to maintain app metadata.
- onCheck stage: In this stage, WinJS executes the `onCheck` hook.
- onStart stage: In this stage, WinJS executes the `onStart` hook.
- runCommand stage: In this stage, WinJS runs the command that the current CLI should execute (for example, `win dev` would execute the dev command). WinJS's various core functionalities are implemented in commands, including most hooks registered by our plugins calling the api.

The above is the overall flow of WinJS's plugin mechanism.

### `register()`, `registerMethod()`, and `applyPlugins()`

`register()` receives a key and a hook, maintaining a `key-hook[]` map. Every time `register()` is called, it registers an additional hook for the key.

Hooks registered by `register()` are used by applyPlugins. The execution order of these hooks follows [tapable](https://github.com/webpack/tapable).

`registerMethod()` receives a key and a fn, registering a method on the api. If you don't pass fn to `registerMethod()`, then `registerMethod()` will register a "registrar" on the api: it will register the curried result of `register()` with the key passed in as fn on the api. This way, you can quickly register hooks for a key by calling this "registrar".

For more specific usage of the above apis, please refer to [Plugin API](../api/plugin-api).

### PluginAPI Principles

WinJS assigns a PluginAPI object to each plugin, which references the plugin itself and WinJS's service.

WinJS proxies the get() method of the PluginAPI object with the following specific rules:
- pluginMethod: If prop is a method in the `pluginMethods[]` maintained by WinJS (methods registered through `registerMethod()`), return this method.
- service props: If prop is an attribute in the serviceProps array (these attributes are properties that WinJS allows plugins to directly access), return the corresponding property of the service.
- static props: If prop is an attribute in the staticProps array parameter (these attributes are static variables, such as type definitions and constants), return it.
- Otherwise, return the api's property

Therefore, most of the apis that WinJS provides to plugins are implemented through `registerMethod()`. You can directly use these apis to quickly register hooks in plugins. This is also a manifestation of WinJS's decoupling of framework and functionality: WinJS's service only provides plugin management functionality, while apis are all provided by plugins.

### preset-win
`core` provides a set of plugin registration and management mechanisms. WinJS's core functionalities are all implemented through preset-win.

`preset-win` is actually a built-in plugin collection that provides plugins in three main categories:
- registerMethods: These plugins register some of the aforementioned "registrars" for developers to quickly register hooks. These methods also occupy most of the PluginAPI.
- features: These plugins provide WinJS with various features, such as appData, codeSplitting, mock, etc.
- commands: These plugins register various commands, providing various functionalities for WinJS CLI. WinJS's ability to run normally in the terminal relies on the functionality provided by commands.

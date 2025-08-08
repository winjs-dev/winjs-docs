# Developing Plugins {#plugins}

The core of WinJS lies in its plugin mechanism. Based on WinJS's plugin mechanism, you can gain the ability to extend your project's compile-time and runtime capabilities. You can use the [Plugin API](../api/plugin-api) we provide to freely write plugins, thereby implementing rich functionality such as modifying code bundling configuration, modifying startup code, conventional directory structure, and modifying HTML.

## Core Concepts
A plugin is essentially a function that receives one parameter: api. In the plugin, you can call methods provided by the api to register some hooks, and then WinJS will execute these hooks at specific times.

For example:
```js
import { IApi } from 'win';

export default (api: IApi) => {
  api.describe({
    key: 'changeFavicon',
    config: {
      schema(joi) {
        return joi.string();
      },
    },
    enableBy: api.EnableBy.config
  });
  api.modifyConfig((memo)=>{
    memo.favicons = api.userConfig.changeFavicon;
    return memo;
  });
};
```
The purpose of this plugin is to change the favicons in the configuration based on the user-configured changeFavicon value (a simple example with no practical use). As you can see, a plugin is actually a function that receives the parameter api. In this function, we called `api.modifyConfig` to register a hook: `(memo)=>{...}`. When you configure `changeFavicon` in the configuration, WinJS will register this plugin. During WinJS's configuration collection lifecycle, the hook we registered in the plugin will be executed, and at this time the `favicon` in the configuration will be modified to the `changeFavicon` in the user configuration.

### preset and plugin
The purpose of a preset is to preset some plugins. It's usually used to register a batch of presets and plugins. In a preset, the method that receives the api mentioned above can have a return value, which is an object containing presets and plugins properties, and its purpose is to register corresponding plugins or plugin sets.

For example:
```js
import { IApi } from 'win';

export default (api: IApi) => {
  return {
    presets: ['./preset_foo'],
    plugins: ['./plugin_foo','./plugin_bar']
  }
};
```
Their registration order is worth noting: presets are always registered before plugins. WinJS maintains two queues to register presets and plugins in sequence. In this example, the registered `preset_foo` will be placed at the head of the presets queue, while `plugin_foo` and `plugin_bar` will be placed at the tail of the plugins queue in sequence. The purpose of putting presets at the head of the queue is to ensure that the order and relationships between presets are controllable.

Another point worth noting is: in a plugin, you can also return some plugins or presets, but WinJS won't do anything with them.

### Plugin id and key
Each plugin corresponds to an id and key.

The id is a shorthand for the plugin's path, serving as the plugin's unique identifier; while the key is used as the key name for plugin configuration.

For example, for the plugin `node_modules/@winner-fed/plugin-foo/index.js`, typically its id is `@winner-fed/plugin-foo` and key is `foo`. This allows developers to configure items with the key name `foo` in the configuration to configure the plugin.

## Enabling Plugins
There are two ways to enable plugins:
1. Enable in environment variables
2. Enable in configuration.

::: warning Note
The plugins referred to here are third-party plugins. WinJS's built-in plugins are uniformly enabled in configuration by configuring their keys.
:::

### Environment Variables

You can also register additional plugins through environment variables `WIN_PRESETS` and `WIN_PLUGINS`.

For example:

```shell
$ WIN_PRESETS=foo/preset.js win dev
```

::: warning Note
Not recommended for use in projects; usually used for secondary packaging of frameworks based on WinJS.
:::

### Configuration
Configure plugins through `presets` and `plugins` in the configuration, for example:
```js
export default {
  presets: ['./preset/foo','bar/presets'],
  plugins: ['./plugin', require.resolve('plugin_foo')]
}
```
The configuration content is the path to the plugin.

### Plugin Order

WinJS plugin registration follows a certain order:
- All presets are registered before plugins.
- Built-in plugins -> plugins in environment variables -> plugins in user configuration.
- Plugins registered simultaneously (in the same array) are registered in order.
- Presets registered in a preset execute immediately, plugins registered execute last.

## Disabling Plugins
There are two ways to disable plugins

### Configure key as false
For example:
```js
export default{
  mock: false
}
```
This will disable WinJS's built-in mock plugin.

### Disable other plugins within a plugin
You can disable through `api.skipPlugins(pluginId[])`, see [Plugin API](../api/plugin-api) for details.

## View Plugin Registration Status
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
Here mock is the key of WinJS's built-in mock plugin.

For another example, if we install a plugin `win-plugin-bar` with a default key of `bar`, we can configure:
```js
export default{
  bar: { ... }
}
```

### Default Naming Rules for Plugin Keys
If the plugin is a package, the default value of the key will be the package name with prefixes removed. For example, `@winner-fed/plugin-foo` has a default key of `foo`, and `win-plugin-bar` has a default key of `bar`. It's worth noting that this default rule requires your package name to conform to WinJS plugin naming conventions.

If the plugin is not a package, the default value of the key will be the plugin's filename. For example, `./plugins/foo.js` has a default key of `foo`

To avoid unnecessary trouble, we recommend explicitly declaring the key for plugins you write yourself.

## WinJS Plugin Lifecycle

### Lifecycle

- init stage: In this stage, WinJS will load various configuration information. Including: loading `.env` files; requiring `package.json`; loading user configuration information; resolving all plugins (built-in plugins, environment variables, user configuration in sequence).
- initPresets stage: In this stage, WinJS will register presets. When presets are registered, they can add additional plugins through `return { presets, plugins }`. Among them, presets will be added to the head of the presets queue, while plugins will be added to the tail of the plugins queue.
- initPlugins stage: In this stage, WinJS will register plugins. The plugins here include additional plugins added by presets in the previous stage. A point worth noting is: although plugins can also `return { presets, plugins }`, WinJS won't perform any operations on them. Plugin initialization is actually executing the plugin's code (but the plugin's code is essentially just calling the api to register various hooks, and hook execution is not executed in this stage, so this is called plugin registration).
- resolveConfig stage: In this stage, WinJS will organize the definitions of `config schema` from various plugins, then execute hooks like `modifyConfig`, `modifyDefaultConfig`, `modifyPaths` from plugins to collect configuration.
- collectionAppData stage: In this stage, WinJS executes the `modifyAppData` hook to maintain App metadata.
- onCheck stage: In this stage, WinJS executes the `onCheck` hook.
- onStart stage: In this stage, WinJS executes the `onStart` hook
- runCommand stage: In this stage, WinJS runs the command that the current cli needs to execute (for example, `win dev`, here it will execute the dev command). WinJS's various core functions are implemented in commands, including most hooks registered by our plugins calling the api.

The above is the overall flow of WinJS's plugin mechanism.

### `register()`, `registerMethod()` and `applyPlugins()`

`register()` receives a key and a hook. It maintains a `key-hook[]` map. Every time `register()` is called, it will register an additional hook for the key.

Hooks registered by `register()` are used by applyPlugins. The execution order of these hooks follows [tapable](https://github.com/webpack/tapable)

`registerMethod()` receives a key and a fn, and it will register a method on the api. If you don't pass fn to `registerMethod()`, then `registerMethod()` will register a "registrar" on the api: it will register the curried result of `register()` passed with the key as fn on the api. This way you can quickly register hooks for the key by calling this "registrar".

For more specific usage of the above apis, please refer to [Plugin API](../api/plugin-api)

### Principle of PluginAPI

WinJS assigns a PluginAPI object to each plugin, which references the plugin itself and WinJS's service.

WinJS proxies the get() method of the PluginAPI object with specific rules as follows:
- pluginMethod: If prop is a method in the `pluginMethods[]` maintained by WinJS (methods registered through `registerMethod()`), return this method.
- service props: If prop is a property in the serviceProps array (these properties are properties that WinJS allows plugins to directly access), return the corresponding property of the service.
- static props: If prop is a property in the staticProps array parameter (these properties are static variables, such as some type definitions and constants), return it.
- Otherwise return the property of the api

Therefore, most of the apis that WinJS provides to plugins are implemented through `registerMethod()`. You can directly use these apis to quickly register hooks in plugins. This is also a reflection of WinJS's decoupling of framework and functionality: WinJS's service only provides plugin management functionality, while apis are provided by plugins.

### preset-win
`core` provides a set of plugin registration and management mechanisms. WinJS's core functionality relies on preset-win to implement.

`preset-win` is actually a built-in plugin set that provides plugins divided into three major categories:
- registerMethods: These plugins register some of the "registrars" mentioned above for developers to quickly register hooks. These methods also occupy most of the PluginAPI.
- features: These plugins provide WinJS with some features, such as appData, appConfig, mock, etc.
- commands: These plugins register various commands, providing various functions of the WinJS CLI. WinJS's ability to run normally in the terminal relies on the functionality provided by commands.

# Auto Import Development Mode {#autoimport}

This mode solves the problem of letting developers write fewer or no import statements. A large number of imports in projects can actually be handled automatically through engineering approaches. WinJS relies on [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) and [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) to implement the **autoImport** approach.

This feature is enabled by default. If you want to disable it (not recommended), please modify the following configuration:

```js
// .winrc
export default {
  autoImport: false
}
```

WinJS has specified the following commonly used libraries by default (mainly for Vue 3 ecosystem, so Vue 3 can directly use this feature) as auto-import modules. When you use related features of these libraries in your code, the corresponding import statements will be automatically inserted, allowing you to conveniently use these modules.

```js
// .winrc
export default {
  autoImport: {
    // unplugin-auto-import plugin default configuration, mainly for Vue3, Vue2 has no configuration, set to {}
    unImports: {
      imports: [
        'vue',
        'vue-router',
        'vue/macros'
      ],
      dts: `src/auto-imports.d.ts`,
      dirs: ['src/stores'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    },
    // unplugin-vue-components plugin default configuration
    unComponents: {
      dts: true
    }
  }
}
```
 
::: tip Note
Developers can customize by adjusting the configuration of unplugin-auto-import and unplugin-vue-components. However, it performs a deep merge with the default parameters.
:::
        
## Extended Knowledge

### unplugin-auto-import
`unplugin-auto-import` is an automatic import plugin for Vue. It can help you automatically import related modules when writing Vue 3 components, reducing the workload of manual imports.

Using the unplugin-auto-import plugin, you can enjoy the convenience of automatic imports in Vue 3 projects. It automatically inserts required import statements by statically analyzing your code and based on needs. This way, you don't have to manually import each component, directive, filter, etc., but can focus on writing code logic.

Here are some main features and characteristics of `unplugin-auto-import`:

- Automatic import: Automatically imports Vue components, directives, filters, etc. as needed.

- Intelligent analysis: Determines modules that need to be imported through static code analysis, avoiding unnecessary imports.

- Flexible configuration: Can be configured according to project needs, including custom import rules, aliases, global imports, etc.

- Compatible with Vue 3 ecosystem: Supports automatic import of Vue 3 related modules, such as Vue, Vue Router, etc.

Using unplugin-auto-import can improve development efficiency and reduce the tedious work of manual imports. It helps you write Vue 3 components more easily while keeping code clean and readable.
              
### unplugin-vue-components

unplugin-vue-components is a plugin specifically designed for Vue applications that greatly simplifies the on-demand import process of components.

### Main Features:
- Automatic component discovery and import: This plugin can automatically detect components used in Vue files and automatically add corresponding import statements at the top of files. This means you don't need to manually write code like import { Button } from 'ant-design-vue', improving development efficiency.

- Wide support: Not only supports common UI library components like Vant, Ant Design Vue, Element Plus, etc., but also recognizes custom components within the project, ensuring that components from any source can be correctly imported.

- On-demand compilation: Through automatic imports, combined with tools like Vue CLI's @vue/cli-plugin-babel or Vite's built-in transpiler, it enables on-demand compilation of components, thereby reducing the size of the final bundled files.

- Type support: For projects using TypeScript, the plugin can automatically generate type declaration files, ensuring IDE intelligent hints and type checking work properly.

- Flexible configuration: Provides various configuration options, allowing you to customize scan paths, ignore specific components, set aliases, etc., to meet specific needs of different projects.

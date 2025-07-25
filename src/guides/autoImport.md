# Auto Import 研发模式 {#autoimport}

此模式解的问题是让开发者少些或不写 import 语句。项目中大量的 import 其实都可以通过工程化的方式自动处理。WinJS 底层依赖了 [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) 和 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 实现了 **autoImport** 方式。

此功能是默认开启的，如果想要关闭（不建议关闭），请修改以下配置：

```js
// .winrc
export default {
  autoImport: false
}
```

WinJS 默认指定了以下常用的库（主要是针对 Vue3 的生态，因此 Vue3 可以直接使用此功能）作为自动导入的模块。当你在代码中使用这些库的相关功能时，将自动插入相应的导入语句，使你可以方便地使用这些模块。

```js
// .winrc
export default {
  autoImport: {
    // unplugin-auto-import 插件默认配置，主要是针对 Vue3，Vue2 无此配置，为 {}
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
    // unplugin-vue-components 插件默认配置
    unComponents: {
      dts: true
    }
  }
}
```
 
::: tip 说明
开发者可以通过调整 unplugin-auto-import、unplugin-vue-components 的配置来进行自定义。不过，是和默认的参数进行 deepmerge。
:::
        
## 扩展知识

### unplugin-auto-import
`unplugin-auto-import` 是一个针对 Vue 的自动导入插件。它可以帮助你在编写 Vue 3 组件时自动导入相关的模块，减少手动导入的工作量。

使用 unplugin-auto-import 插件，你可以在 Vue 3 项目中享受自动导入的便利。它通过静态分析你的代码，并根据需要自动插入所需的导入语句。这样，你就不必手动导入每个组件、指令、过滤器等，而是可以专注于编写代码逻辑。

以下是 `unplugin-auto-import` 的一些主要功能和特点：

- 自动导入：根据需要自动导入 Vue 组件、指令、过滤器等。

- 智能分析：通过静态分析代码，确定需要导入的模块，避免不必要的导入。

- 配置灵活：可以根据项目需求进行配置，包括自定义导入规则、别名、全局导入等。

- 与 Vue 3 生态系统兼容：支持与 Vue 3 相关的模块自动导入，如 Vue、Vue Router 等。

使用 unplugin-auto-import 可以提高开发效率，减少手动导入的繁琐工作。帮助你更轻松地编写 Vue3 组件，并保持代码的整洁和可读性。
              
### unplugin-vue-components

unplugin-vue-components 是一个专为 Vue 应用设计的插件，它极大地简化了组件的按需导入过程。

### 主要特性：
- 自动发现并导入组件：该插件能够自动检测Vue文件中使用的组件，并自动在文件顶部添加相应的导入语句。这意味着你无需手动书写如 import { Button } from 'ant-design-vue' 这样的代码，提高了开发效率。

- 广泛支持：不仅支持常见的UI库组件，比如Vant、Ant Design Vue、Element Plus等，还能识别项目内的自定义组件，确保无论组件来自何处，都能被正确导入。

- 按需编译：通过自动导入，配合像 Vue CLI 的 @vue/cli-plugin-babel 或者 Vite 的内置转译器，能够实现组件的按需编译，从而减少最终打包文件的大小。

- 类型支持：对于使用 TypeScript 的项目，插件能自动生成类型声明文件，确保IDE的智能提示和类型检查正常工作。

- 配置灵活：提供了多种配置选项，允许你自定义扫描路径、忽略特定组件、设置别名等，以满足不同项目的具体需求。

# 插件 {#use-plugins}

## 使用插件

在普通的 WinJS 应用中，默认 **不附带任何插件** ，需要手动安装插件并开启他们：

如安装 request 插件：

```bash
pnpm add -D @winner-fed/plugin-request
```

如开启 request 插件：

```ts
// .winrc.ts
export default {
  plugins: ['@winner-fed/plugin-request'],
  request: {}
}
```

## 项目级插件

若你想在项目中快速使用插件的功能（如 [修改产物的 html](./faq#documentejs-去哪了如何自定义-html-模板) ），可以在项目的根目录创建 `plugin.ts` 编写一个项目级插件，该文件将被自动作为插件加载。

有关更详细的目录结构说明请参阅 [目录结构](./directory-structure) 章节。

## 开发插件

请参阅 [开发插件](./plugins) 章节。





# 迁移 create-project 到 WinJS

> 本文档仅作为如何将 `@winner-fed/create-project` 迁移到 WinJS 的基础指引。真实项目的迁移，你可能还需要阅读我们的文档，了解更多关于[插件](../plugins/index)和[配置](../config/config)的相关信息。

其实将一个 `@winner-fed/create-project` 项目迁移到 WinJS 是一件比较容易的事情。主要需要注意几个默认行为的差异。接下来，我们通过以下步骤，将 `@winner-fed/create-project` 的初始项目迁移到 WinJS。

## 依赖处理

在 `package.json` 中修改依赖并修改项目启动命令，更多 win cli 的信息，可以查看[我们的文档](../cli/commands)。

```diff
{
  "scripts": {
-    "dev": "npm run serve",
+    "dev": "win dev",
-    "build": "node build/index.js --no-module",
+    "build": "win build",
  },
  "dependencies": {
+    "@winner-fed/winjs": "^0.5.1"
  },
+ "devDependencies": {
+    "@winner-fed/preset-vue": "^0.5.1",
+    "@winner-fed/plugins": "^0.5.1"
+ }
}
```

## 修改根组件

`@winner-fed/create-project` 的入口是 `src/App.vue`，在 WinJS 中并没有真实的暴露程序的主入口，但是我们可以在 [layouts](../guides/directory-structure#layouts-index-vue) 中执行同样的操作。

将 `src/App.vue` 中的逻辑转移到 `src/layouts/index.vue` 中，操作完成你的代码应该看起来像：

```vue

<template>
  <div class="pages">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/docs">Docs</router-link>
      </li>
    </ul>
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<style scoped lang="less">
.navs {
  ul {
    padding: 0;
    list-style: none;
    display: flex;
  }

  li {
    margin-right: 1em;
  }
}
</style>

```

## 转移页面文件

将页面组件转移到 [`src/pages`](../guides/routes#约定式路由) 目录下面。

## HTML 模版

将 `public/index.html` 文件移除。

WinJS 废弃了 `index.html`，可以直接通过暴露的相关 api 来拼成最终的 html。具体可以参考[此处](../guides/faq#index-html-去哪了-如何自定义-html-模板) 

## 启动项目

执行 `win dev`，项目将会在 `http://localhost:8000/` 上启动，如果你习惯使用 `3000` 端口，你可以通过[环境变量](../guides/env-variables)来设置。现在项目看起来应该与迁移之前的效果一致。

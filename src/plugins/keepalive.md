# keepalive

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-keepalive?style=flat-square&colorB=646cff)

::: warning 注意
此方案只适用于 Vue3。
:::

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-keepalive -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-keepalive -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-keepalive -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-keepalive -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-keepalive'],
  routes: [{
    path: '/',
    name: 'Home',
    component: 'index',
    routes: [
      {
        path: 'admin',
        name: 'Admin',
        component: '@/components/admin'
      },
      {
        path: 'normal',
        name: 'Normal',
        component: '@/components/normal'
      }
    ]
  }],
  /**
   * @name 路由状态保持插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/keepalive.html
   */
  keepalive: ['/hello', '/docs'],
  // 需关闭 mfsu
  mfsu: false
});
```

## 介绍

配置需要状态保持的路由。

* 类型：`(string | RegExp)[]`

```ts
import { defineConfig } from 'win';

export default defineConfig({
  keepalive: ['/list'],
});
```

> 注意，keepalive 的配置项，支持正则表达式。但是所有的路由正则匹配应该是全小写的，比如不管你的路由是 `home`、`Home`
> 还是 `hoMe` ，只有设置 `keepalive:[/home/]` 才有效。而字符串的配置方式就刚好相反，如果你的路由是`home`，你配置 `home`、`Home`
> 还是 `hoMe` 都有效。

在需要使用  `<router-view></router-view>` 都需要使用 `<KeepAliveLayout>`  代替

```diff
<template>
-   <router-view></router-view>
+   <KeepAliveLayout></KeepAliveLayout>
</template>
+ <script lang="ts" setup>
+ import KeepAliveLayout from '@@/plugin-keepalive/layout.vue';
+ </script>
```

# KeepAlive

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-keepalive?style=flat-square&colorB=646cff)

::: warning Note
This solution is only applicable to Vue 3.
:::

## Setup

1. Install the plugin

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

2. Enable the plugin in the `.winrc` configuration file

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
   * @name Route state persistence plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/keepalive.html
   */
  keepalive: ['/hello', '/docs'],
  // Need to disable mfsu
  mfsu: false
});
```

## Introduction

Configure routes that require state persistence.

* Type: `(string | RegExp)[]`

```ts
import { defineConfig } from 'win';

export default defineConfig({
  keepalive: ['/list'],
});
```

> Note that the keepalive configuration supports regular expressions. However, all route regex matching should be lowercase. For example, regardless of whether your route is `home`, `Home`, or `hoMe`, only setting `keepalive:[/home/]` will be effective. String configuration works the opposite way - if your route is `home`, configuring `home`, `Home`, or `hoMe` will all be effective.

Wherever you need to use `<router-view></router-view>`, you should replace it with `<KeepAliveLayout>`

```diff
<template>
-   <router-view></router-view>
+   <KeepAliveLayout></KeepAliveLayout>
</template>
+ <script lang="ts" setup>
+ import KeepAliveLayout from '@@/plugin-keepalive/layout.vue';
+ </script>
```

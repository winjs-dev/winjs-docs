# 权限

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-locale?style=flat-square&colorB=646cff)

对于前端应用来说，「权限」就是页面是否可访问，页面元素是否可见。

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-access -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-access -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-access -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-access -D
```

:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-access'],
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
   * @name 权限插件
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/access.html
   */
  access: {
    roles: {
      admin: ['/admin'],
      normal: ['/normal']
    }
  }
});
```

## 介绍

在此插件设计中，一个页面权限对应着一个路由，例如当访问 `'/admin'` 这个路由时，如果当前角色并不具有这个路由的权限，那么则不会渲染这个组件。

```ts
export default {
  access: {
    roles: {
      admin: ['/admin'],
      normal: ['/normal']
    }
  }
};
```

使用示例：

```vue

<template>
  <Access :id="accessId"> 只有 Admin 可见</Access>
  <div v-access="accessId">只有 Admin 可见</div>
</template>

<script setup lang="ts">
const accessId = '/admin';
</script>
```

::: tip 说明  
我们把页面、页面元素统一叫做资源，并用资源 ID 来识别区分它们：

- 页面的资源 ID 默认是页面的路由 `path` 。比如页面 `pages/a.vue` 的路由 `path` 是 `/a`。当页面访问 `/a`
  时会渲染当前页面，`/a` 也就是页面的 `accessId`。
- 页面元素的资源 ID 没有默认值，需要自定义。
  :::

### 匹配规则

#### 全等匹配

资源的匹配规则默认是使用全等匹配，比如页面 `pages/a.vue` 对应路由 `path` 是 `/a`，则 `/a` 就是页面的资源 ID。如果我们设置：

```js
access.setAccess(['/a']);
```

由于权限列表中包含`/a`，则表示拥有此页面权限。

#### 模糊匹配

页面`@id.vue`会映射为动态路由`/:id`，想匹配此页面有两种办法：

- **access.setAccess(['/:id'])**
- **access.setAccess(['/*'])**

第二种是模糊匹配，`*`表示任意路径。比如角色`admin`需要全部权限，则可以：

```js
export default {
  access: {
    roles: {
      admin: ['*']
    }
  }
};
```

## 编译时配置

在执行 `win dev` 或者 `win build` 时，通过此配置生成运行时的代码，在配置文件`.winrc.js` 中配置：

```js
export default {
  access: {
    roles: {
      admin: ['/', '/admin', '/normal'],
    },
  },
};
```

### roles

- **类型**：`Record<string, []>;`
- **默认值**：`{}`

- **详情**：

  角色预定义列表。`key` 是角色 Id ，`value`是角色 Id 对应的资源列表。

## 运行时配置

在 `app.js` 中配置

### unAccessHandler

- **类型**：`Function`
- **默认值**：`null`
- **详情**： 当进入某个路由时，如果路由对应的页面不属于可见资源列表，则会暂停进入，调用 `unAccessHandler` 函数。

- **参数**
  - router：createRouter 创建的路由实例
  - to： 准备进入的路由
  - from：离开的路由
  - next：[next 函数](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%8F%AF%E9%80%89%E7%9A%84%E7%AC%AC%E4%B8%89%E4%B8%AA%E5%8F%82%E6%95%B0-next)

比如：

```js
import { access as accessApi } from 'winjs';

export const access = {
  unAccessHandler ({ to, next }) {
    const accesssIds = accessApi.getAccess();
    if (to.path === '/404') {
      accessApi.setAccess(accesssIds.concat(['/404']));
      return next('/404');
    }
    if (!accesssIds.includes('/403')) {
      accessApi.setAccess(accesssIds.concat(['/403']));
    }
    next('/403');
  },
};
```

### noFoundHandler

- **类型**：`Function`
- **默认值**：`null`
- **详情**：当进入某个路由时，如果路由对应的页面不存在，则会调用 `noFoundHandler` 函数。
- **参数**
  - router：createRouter 创建的路由实例
  - to： 准备进入的路由
  - from：离开的路由
  -
  next： [next 函数](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%8F%AF%E9%80%89%E7%9A%84%E7%AC%AC%E4%B8%89%E4%B8%AA%E5%8F%82%E6%95%B0-next)

比如：

```js
import { access as accessApi } from 'winjs';

export const access = {
  noFoundHandler ({ next }) {
    const accesssIds = accessApi.getAccess();
    if (!accesssIds.includes('/404')) {
      accessApi.setAccess(accesssIds.concat(['/404']));
    }
    next('/404');
  },
};
```

### ignoreAccess

- **类型**：`Array<string>`
- **默认值**：`null`
- **详情**： 配置需要忽略权限校验的页面。

比如：

```js
export const access = {
  ignoreAccess: ['/login'],
};
```

## API

在 WinJS 中使用了自定义指令 directive 的方式，通过 `v-access` 这个指令，传入 useAccess 返回的对象，来控制组件的渲染。

插件 API 通过 `winjs` 导出：

```js
import { access } from 'winjs';
```

#### access.hasAccess

- **类型**：`( accessId: string | number ) => Promise\<boolean\>`
- **详情**: 判断某个资源是否可见。
- **参数**：
  - accessId，资源 Id
- **返回值**：是否有权限

#### access.isDataReady

- **类型**：`() => boolean`
- **详情**：可以用异步数据来设置权限，`isDataReady` 用来判断异步数据是否已经加载完毕。
- **参数**：null
- **返回值**：Boolean

```js
import { access } from 'winjs';

console.log(access.isDataReady());
```

#### access.setRole

- **类型**：`Function`
- **详情**：设置当前的角色。
- **参数**：
- roleId，角色 Id，有两种类型：
  - String，对应着 `roles` 配置对象中的 `key`。
  - Promise，Promise resolve 的结果应对应着 `roles` 配置对象中的 `key`。

```js
import { access } from 'winjs';

access.setRole('admin');
```

#### access.getRole

- **类型**：`Function`
- **详情**：获取当前的角色。

```js
import { access } from 'winjs';

access.getRole();
```

#### access.setAccess

- **类型**：`Function`
- **详情**：设置当前的角色。
- **参数**：
- accessIds，资源 Id 数组，有两种类型：
  - Array，数组项对应着 `roles` 配置对象中的 `key`。
  - Promise，Promise resolve 的结果应该是`Array<accessId>`。

```js
import { access } from 'winjs';

access.setAccess(['/a', '/b', '/c']);
```

#### access.getAccess

- **类型**：`Function`
- **详情**：返回当前可见的资源列表。
- **参数**：null

```js
import { access } from 'winjs';

access.getAccess();
```

### useAccess

- **类型**：[composition](https://vuejs.org/guide/extras/composition-api-faq.html#what-is-composition-api) 函数
- **详情**：判断某个资源是否可见。
- **参数**：
  - accessId，资源 Id
- **返回值**：`ref`

```vue

<template>
  <div v-if="accessOnepicess">accessOnepicess</div>
</template>
<script>
import { useAccess } from 'winjs';

export default {
  setup () {
    const accessOnepicess = useAccess('/onepiece1');
    return {
      accessOnepicess,
    };
  },
};
</script>
```

### v-access

在指令 `v-access` 中传入 `accessId`，则当 `accessId` 拥有权限时显示 DOM，当没有权限时隐藏此 DOM。

```vue

<template>
  <div v-access="accessId">accessOnepicess</div>
</template>
<script>
export default {
  setup () {
    return {
      accessId: 'accessOnepicess',
    };
  },
};
</script>
```

### 组件 Access

组件 `Access` 中传入 `accessId`，则当 `accessId` 拥有权限时渲染此组件，当没有权限时隐藏此组件。

```vue

<template>
  <access :id="accessId"> accessOnepicess</access>
</template>
<script>
export default {
  setup () {
    return {
      accessId: 'accessOnepicess',
    };
  },
};
</script>
```

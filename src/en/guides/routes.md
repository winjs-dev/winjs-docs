# Routing {#routes}

WinJS applications are [single-page applications](https://en.wikipedia.org/wiki/Single-page_application), where page navigation is completed on the browser side without requesting HTML from the server again. HTML is only loaded once during application initialization. All pages are composed of different components, and page switching is actually switching between different components. You just need to associate different route paths with corresponding components in the configuration.

## Route Type Configuration

Please refer to [history](../config/config#history) configuration.

## Configuring Routes

Configure routes through `routes` in the configuration file, formatted as an array of route information.

For example:

```ts
// .winrc.ts
export default {
  routes: [
    { path: '/', component: 'index' },
    { path: '/user', component: 'user' },
  ],
}
```

WinJS splits bundles by page by default for faster page loading speeds. Since the loading process is asynchronous, you often need to write or reference something like [`nprogress`](https://www.npmjs.com/package/nprogress) to add loading styles to your project and improve the experience.

::: tip Tip
You can set the network to slow speed in Chrome Devtools > Network tab, then switch routes to check if component loading is working.
:::

### path

* Type: `string`

`path` only supports two types of placeholder configurations: the first is dynamic parameters in the form of `:id`, and the second is `*` wildcards, which can only appear at the end of the route string.

✅ The following are currently ***supported*** route path configuration forms:

```txt
/groups
/groups/admin
/users/:id
/users/:id/messages
/files/*
/files/:id/*
```

❌ The following are currently ***not supported*** route path configuration forms:

```txt
/users/:id?
/tweets/:id(\d+)
/files/*/cat.jpg
/files-*
```

### name

Named routes

Besides `path`, you can also provide a `name` for any route:

```ts
export default {
  routes: [
    {
      path: '/user/:username',
      name: 'user',
      component: 'index'
    }
  ]
}
```

To link to a named route, you can pass an object to the `router-link` component's `to` property:

```html

<router-link :to="{ name: 'user', params: { username: 'erina' }}">
  User
</router-link>
```

This has the same effect as calling `router.push` imperatively:

```ts
router.push({ name: 'user', params: { username: 'erina' } })
```

Both methods can navigate to the path `/user/erina`.

### alias

A redirect means that when a user visits `/home`, the URL will be replaced by `/`, and then matched as `/`. So what is an alias?

Aliasing `/` as `/home` means that when a user visits `/home`, the URL remains `/home`, but it will be matched as if the user is visiting `/`.

The corresponding route configuration is:

```ts
export default {
  routes: [
    {
      path: '/',
      component: 'index',
      alias: '/home'
    }
  ]
}
```

Through aliases, you can freely map UI structure to any URL without being constrained by the nested structure of the configuration. Make aliases start with `/` to make paths in nested routes absolute paths. You can even combine both and provide multiple aliases with an array:

```ts
export default {
  routes: [
    {
      path: '/users',
      component: 'users',
      routes: [
        // Render UserList for these 3 URLs
        // - /users
        // - /users/list
        // - /people
        { path: '', component: '/users/UserList', alias: ['/people', 'list'] },
      ]
    }
  ]
}
```

### meta

When defining routes, we can configure the `meta` field to extend route meta information and record some route-related information:

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      routes: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: {
            title: 'bar',
            requiresAuth: true
          },
        },
      ],
    },
  ],
});

```

### component

* Type: `string`

Configure the React component path used for rendering after location and path matching. It can be an absolute path or a relative path. If it's a relative path, it will start searching from `src/pages`.

If pointing to a file in the `src` directory, you can use `@`, for example `component: '@/layouts/basic'`. It's recommended to use `@` to organize route file locations.

### routes

Configure child routes, usually used when you need to add layout components for multiple paths.

For example:

```js
export default {
  routes: [
    { path: '/login', component: 'login' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/list', component: 'list' },
        { path: '/admin', component: 'admin' },
      ],
    },
  ],
}
```

In the global layout `src/layouts/index`, render child routes through `<router-view />`:

```tsx
export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <router-view />
    </div>
  )
}
```

This way, accessing `/list` and `/admin` will include the `src/layouts/index` layout component.

### redirect

* Type: `string`

Configure route redirection.

For example:

```js
export default {
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: 'list' },
  ],
}
```

Accessing `/` will redirect to `/list` and be rendered by the `src/pages/list` file.

The redirect target can also be a named route. The following example redirects from `/home` to `/`:

```ts
export default {
  routes: [
    {
      path: '/home',
      redirect: {
        name: 'homepage'
      }
    }
  ]
}

```

### wrappers

* Type: `string[]`

配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。
比如，可以用于路由级别的权限校验：

```js
export default {
  routes: [
    {
      path: '/user', component: 'user',
      wrappers: [
        '@/wrappers/auth',
      ],
    },
    { path: '/login', component: 'login' },
  ]
}
```

然后在 `src/wrappers/auth` 中，

```jsx
export default (props) => {
  const { isLogin } = useAuth();
  if (isLogin) {
    return <router-view />;
  } else {
    return <router-link to="/login" />;
  }
}
```

这样，访问 `/user`，就通过 `auth` 组件做权限校验，如果通过，渲染 `src/pages/user`，否则跳转到 `/login`。

::: tip 说明
`wrappers` 中的每个组件会给当前的路由组件增加一层嵌套路由，如果你希望路由结构不发生变化，推荐使用高阶组件。先在高阶组件中实现
wrapper 中的逻辑，然后使用该高阶组件装饰对应的路由组件。
:::

举例：

```jsx
// src/hocs/withAuth.tsx

const withAuth = (Component) => () => {
  const { isLogin } = useAuth();
  if (isLogin) {
    return <router-view />;
  } else {
    return <router-link to="/login" />;
  }
}
```

```jsx
// src/pages/user.tsx

const TheOldPage = () => {
  // ...
}

export default withAuth(TheOldPage)
```

## 约定式路由

> 使用约定式路由时，约定 `src/pages` 下所有的 `(j|t)sx?`
> 文件即路由。如果你需要修改默认规则，可以使用 [conventionRoutes](../config/config#conventionroutes) 配置。

除配置式路由外，WinJS 也支持约定式路由。约定式路由也叫文件路由，就是不需要手写配置，文件系统即路由，通过目录和文件及其命名分析出路由配置，最终生成对应的路由结构。

**如果没有 routes 配置，WinJS 会进入约定式路由模式**，然后分析 `src/pages` 目录拿到路由配置。

比如以下文件结构：

```bash
.
  └── pages
    ├── index.tsx
    └── users.tsx
```

会得到以下路由配置，

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
]
```

### 配置扩展属性

我们可以通过两种方式给页面设置扩展的一些属性，这样`约定式路由`就可以读取页面自定义的一些属性，如 `meta`。
-  通过 `definePageMeta` 方法 （**推荐使用**）

```ts
definePageMeta(meta: PageMeta) => meta

interface PageMeta {
  name?: string
  alias?: string | string[]
  [key: string]: unknown
}
```
-  通过 `routeProps` 属性

举个例子：

```vue{3,5,7-12,14-17} twoslash

<script setup>
  import { ref } from 'vue';
  import { definePageMeta } from 'winjs';

  // 可以在路由拦截器里(router.beforeEach)获取当前设置的 meta 字段
  
  // 1. 推荐使用 definePageMeta()
  definePageMeta({
    meta: {
      title: 'pageMeta'
    }
  })

  // 2. export const routeProps
  export const routeProps = {
    meta: { requireAuth: true }
  }
  
  const title = ref('Welcome to Your Vue.js App.');
</script>

<template>
  <div class="page page-hello">
    <div class="page-content">
      <!-- 静态资源路径写法事例 -->
      <img class="logo" src="@/assets/img/logo.png" alt="logo" />
    </div>
  </div>
</template>
```

::: warning 注意
上述方案只在**约定式路由**的模式起作用。也即当检测出 WinJS 的配置文件 `.winrc` 里不含有 `routes` 属性时，此功能会自动开启。
:::

### 动态路由

约定，带 `$` 前缀的目录或文件为动态路由。若 `$` 后不指定参数名，则代表 `*` 通配，比如以下目录结构：

比如：

* `src/pages/users/$id.tsx` 会成为 `/users/:id`
* `src/pages/users/$id/settings.tsx` 会成为 `/users/:id/settings`

举个完整的例子，比如以下文件结构，

```
+ pages/
  + foo/
    - $slug.tsx
  + $bar/
    - $.tsx
  - index.tsx
```

会生成路由配置如下：

```javascript
[
  { path: '/', name: 'index', component: '@/pages/index.tsx' },
  { path: '/foo/:slug', name: 'fooSlug', component: '@/pages/foo/$slug.tsx' },
  { path: '/:bar/*', name: 'bar', component: '@/pages/$bar/$.tsx' }
];
```

### 全局 layout

约定 `src/layouts/index.tsx` 为全局路由。返回一个 Vue 组件，并通过 `<router-view />` 渲染嵌套路由。

如以下目录结构：

```bash
.
└── src
    ├── layouts
    │   └── index.tsx
    └── pages
        ├── index.tsx
        └── users.tsx
```

会生成如下路由：

```js
[
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '', name: 'index', component: '@/pages/index' },
      { path: 'users', name: 'users', component: '@/pages/users' },
    ],
  },
]
```

可以通过 `layout: false` 来细粒度关闭某个路由的 **全局布局** 显示，该选项只在一级生效：

```ts
  routes: [
  {
    path: '/',
    name: 'index',
    component: './index',
    // 🟢 
    layout: false
  },
  {
    path: '/users',
    name: 'users',
    routes: [
      // 🔴 不生效，此时该路由的 layout 并不是全局布局，而是 `/users`
      { layout: false }
    ]
  }
]
```

一个自定义的全局 `layout` 格式如下：

```tsx

export default function Layout() {
  return <router-view />
}
```

### 不同的全局 layout

你可能需要针对不同路由输出不同的全局 layout，WinJS 不支持这样的配置，但你仍可以在 `src/layouts/index.tsx`
中对 `location.path` 做区分，渲染不同的 layout 。

比如想要针对 `/login` 输出简单布局，

```jsx
export default defineComponent(() => {
  setup()
  {
    const route = useRoute();

    // 使用 `useAppData` 可以获得更多路由信息
    // const { clientRoutes } = useAppData()

    if (route.path === '/login') {
      return () => (
        <div>
          <SimpleLayout>
            <router-view />
          </SimpleLayout>
        </div>
      )
    }

    return () => (
      <div>
        <Header />
        <router-view />
        <Footer />
      </div>
    );
  }
});
```

### 嵌套路由

虽然在 WinJS 里，约定式路由不支持配置不同的全局 layout，但我们可以通过下面的「目录约定」产生一个嵌套路由，那么当前目录和子目录均为子路由。

假设 src/pages 的目录结构如下：

```bash
.
├── docs.vue
├── hello
│   ├── child.vue
│   └── style.less
├── hello.vue
└── index.vue

```

::: tip 说明
文件夹和当级路由的名字一样即可。

```bash
./src/pages
├── ${name}
│   └── a.vue[tsx]
└── ${name}.vue[tsx]
```
:::

其中，`hello.vue` 里的示例代码为：

```vue
<template>
  <div class="page page-hello">
    <h3>Hello parent</h3>
    <router-view />
  </div>
</template>
```

那么，WinJS 自动生成的路由配置如下：

```json
{
  "hello": {
    "path": "hello",
    "id": "hello",
    "name": "hello",
    "parentId": "@@/global-layout"
  },
  "hello/child": {
    "path": "child",
    "id": "hello/child",
    "name": "helloChild",
    "parentId": "hello"
  },
  "index": {
    "path": "/",
    "id": "index",
    "name": "index",
    "parentId": "@@/global-layout"
  },
  "docs": {
    "path": "docs",
    "id": "docs",
    "name": "docs",
    "parentId": "@@/global-layout"
  },
  "@@/global-layout": {
    "id": "@@/global-layout",
    "path": "/",
    "isLayout": true
  }
};

```

### 404 路由

约定 `src/pages/404.tsx` 为 404 页面，需返回 Vue 组件。`name` 的值默认为 `NotFound`。

比如以下目录结构，

```bash
.
└── pages
    ├── 404.tsx
    ├── index.tsx
    └── users.tsx
```

会生成路由，

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: '@/pages/404' },
]
```

这样，如果访问 `/foo`，`/` 和 `/users` 都不能匹配，会 fallback 到 404 路由，通过 `src/pages/404.tsx` 进行渲染。

**404 只有约定式路由会自动生效，如果使用配置式路由，需要自行配置 404 的通配路由。**

::: tip 提示
vue-router 不同的版本，4.x 与 3.x 生成的 404 相关代码会有区别。4.x
可以参考 [404 路由](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1)
。3.x
可以参考 [404 路由](https://v3.router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1)。

4.x 对应的也就是 Vue3，生成的代码如下：

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: '@/pages/404' },
]
```

2.x 对应的也就是 Vue2，生成的代码如下：

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
  // 必须放到路由表里的最后一个位置，不然访问任何路由都会进入 404
  { path: '/*', name: 'NotFound', component: '@/pages/404' },
]
```

:::

## 页面跳转

命令式跳转或者组件内请使用 [`useRouter`](../api/api#userouter) API

```html

<script lang="ts" setup>
  import { useRouter, useRoute } from 'winjs';

  const router = useRouter()
  const route = useRoute()

  const onHello = () => {
    router.push({
      name: 'search',
      query: {
        ...route.query,
      },
    })
  }

  // 这三种形式是等价的
  router.push('/users/posva#bio');
  router.push({ path: '/users/posva', hash: '#bio' });
  router.push({ name: 'users', params: { username: 'posva' }, hash: '#bio' });
  // 只改变 hash
  router.push({ hash: '#bio' });
  // 只改变 query
  router.push({ query: { page: '2' } });
  // 只改变 param
  router.push({ params: { username: 'jolyne' } });

  // 跳转到上一个路由
  router.back();

  // 跳转到前一个历史记录
  router.go(1);

  // 替换历史堆栈中的记录
  router.replace('/new');
</script>
```

更多[详见](https://router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup)

## router-link

[详见](../api/api#routerlink)

## router-view

[详见](../api/api#routerview)

## RouterLink 组件

[详见](../api/api#routerlink)

比如：

```jsx
export default function Page () {
  return (
    <div>
      <router-link to="/users">Users Page</router-link>
    </div>
  )
}
```

然后点击 `Users Page` 就会跳转到 `/users` 地址。

注意：

* `RouterLink` 只用于单页应用的内部跳转，如果是外部地址跳转请使用 `a` 标签

## 运行时配置

可以通过在约定的 `src/app.tsx` 通过 export 配置来控制 vue vue-router 相关的配置

### router

配置路由配置

```ts
// src/app.tsx
export const router: RouterConfig = {
  // @ts-ignore
  scrollBehavior(to, from) {
    console.log('scrollBehavior', to, from);
  },
};
```

### onMounted(\{app, router\})

Vue app mount 成功回调, 这里可以拿到 app 的实例及 router 的实例, 可以进行全局组件注册, 路由拦截器等。

```ts
export function onMounted({ app, router }: any) {
  console.log('onMounted', app, router);
  app.provide('win-hello', {
    h: 'hello',
    w: 'word',
  });
}
```

### rootContainer(container)

修改交给 vue-router 渲染时的根组件。

比如用于在外面包一个父组件

```ts
import { h } from 'vue'

export function rootContainer(container) {
  return h(ThemeProvider, null, container);
}
```    

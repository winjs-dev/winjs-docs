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

Configure wrapper components for route components. Wrapper components can combine more functionality into the current route component.
For example, it can be used for route-level permission verification:

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

Then in `src/wrappers/auth`,

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

This way, when accessing `/user`, permission verification is performed through the `auth` component. If passed, `src/pages/user` is rendered, otherwise it redirects to `/login`.

::: tip Note
Each component in `wrappers` will add a nested route layer to the current route component. If you want the route structure to remain unchanged, it's recommended to use Higher-Order Components (HOC). First implement the wrapper logic in the HOC, then use the HOC to decorate the corresponding route component.
:::

Example:

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

## Conventional Routing

> When using conventional routing, all `(j|t)sx?` files under `src/pages` are treated as routes. If you need to modify the default rules, you can use the [conventionRoutes](../config/config#conventionroutes) configuration.

In addition to configured routing, WinJS also supports conventional routing. Conventional routing, also known as file-based routing, means you don't need to write configuration manually. The file system becomes the routes, and route configuration is analyzed from directory and file structure and naming, ultimately generating the corresponding route structure.

**If there is no routes configuration, WinJS will enter conventional routing mode**, then analyze the `src/pages` directory to get the route configuration.

For example, the following file structure:

```bash
.
  └── pages
    ├── index.tsx
    └── users.tsx
```

Will generate the following route configuration:

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
]
```

### Configuring Extended Properties

We can set extended properties for pages in two ways, allowing `conventional routing` to read custom page properties such as `meta`.
-  Using the `definePageMeta` method (**Recommended**)

```ts
definePageMeta(meta: PageMeta) => meta

interface PageMeta {
  name?: string
  alias?: string | string[]
  [key: string]: unknown
}
```
-  Using the `routeProps` property

Example:

```vue{3,5,7-12,14-17} twoslash

<script setup>
  import { ref } from 'vue';
  import { definePageMeta } from 'winjs';

  // You can get the currently set meta field in the route interceptor (router.beforeEach)
  
  // 1. Recommended: use definePageMeta()
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
      <!-- Example of static asset path -->
      <img class="logo" src="@/assets/img/logo.png" alt="logo" />
    </div>
  </div>
</template>
```

::: warning Note
The above solution only works in **conventional routing** mode. That is, when it is detected that the WinJS configuration file `.winrc` does not contain the `routes` property, this feature will be automatically enabled.
:::

### Dynamic Routes

By convention, directories or files with the `$` prefix are dynamic routes. If no parameter name is specified after `$`, it represents `*` wildcard. For example, the following directory structure:

For example:

* `src/pages/users/$id.tsx` will become `/users/:id`
* `src/pages/users/$id/settings.tsx` will become `/users/:id/settings`

A complete example, with the following file structure:

```
+ pages/
  + foo/
    - $slug.tsx
  + $bar/
    - $.tsx
  - index.tsx
```

Will generate the following route configuration:

```javascript
[
  { path: '/', name: 'index', component: '@/pages/index.tsx' },
  { path: '/foo/:slug', name: 'fooSlug', component: '@/pages/foo/$slug.tsx' },
  { path: '/:bar/*', name: 'bar', component: '@/pages/$bar/$.tsx' }
];
```

### Global Layout

By convention, `src/layouts/index.tsx` is the global layout. It returns a Vue component and renders nested routes through `<router-view />`.

With the following directory structure:

```bash
.
└── src
    ├── layouts
    │   └── index.tsx
    └── pages
        ├── index.tsx
        └── users.tsx
```

Will generate the following routes:

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

You can use `layout: false` to fine-tune and disable the **global layout** display for a specific route. This option only takes effect at the first level:

```ts
  routes: [
  {
    path: '/',
    name: 'index',
    component: './index',
    // 🟢 Works
    layout: false
  },
  {
    path: '/users',
    name: 'users',
    routes: [
      // 🔴 Does not work, at this point the layout of this route is not the global layout, but `/users`
      { layout: false }
    ]
  }
]
```

A custom global `layout` format looks like this:

```tsx

export default function Layout() {
  return <router-view />
}
```

### Different Global Layouts

You may need to output different global layouts for different routes. WinJS does not support such configuration, but you can still differentiate `location.path` in `src/layouts/index.tsx` and render different layouts.

For example, if you want to output a simple layout for `/login`:

```jsx
export default defineComponent(() => {
  setup()
  {
    const route = useRoute();

    // Use `useAppData` to get more route information
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

### Nested Routes

Although in WinJS, conventional routing does not support configuring different global layouts, we can create nested routes through the "directory convention" below, where both the current directory and subdirectories are child routes.

Assuming the directory structure of src/pages is as follows:

```bash
.
├── docs.vue
├── hello
│   ├── child.vue
│   └── style.less
├── hello.vue
└── index.vue

```

::: tip Note
The folder and current-level route should have the same name.

```bash
./src/pages
├── ${name}
│   └── a.vue[tsx]
└── ${name}.vue[tsx]
```
:::

Among them, the example code in `hello.vue` is:

```vue
<template>
  <div class="page page-hello">
    <h3>Hello parent</h3>
    <router-view />
  </div>
</template>
```

Then, the route configuration automatically generated by WinJS is as follows:

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

### 404 Route

By convention, `src/pages/404.tsx` is the 404 page and must return a Vue component. The default value of `name` is `NotFound`.

For example, the following directory structure:

```bash
.
└── pages
    ├── 404.tsx
    ├── index.tsx
    └── users.tsx
```

Will generate routes:

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: '@/pages/404' },
]
```

In this way, if you access `/foo`, neither `/` nor `/users` can match, it will fallback to the 404 route and be rendered through `src/pages/404.tsx`.

**404 only takes effect automatically with conventional routing. If using configured routing, you need to configure the 404 wildcard route yourself.**

::: tip Tip
Different versions of vue-router, 4.x and 3.x will have differences in the generated 404-related code. For 4.x, refer to [404 Route](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1). For 3.x, refer to [404 Route](https://v3.router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1).

4.x corresponds to Vue3, and the generated code is as follows:

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: '@/pages/404' },
]
```

2.x corresponds to Vue2, and the generated code is as follows:

```js
[
  { path: '/', name: 'index', component: '@/pages/index' },
  { path: '/users', name: 'users', component: '@/pages/users' },
  // Must be placed at the last position in the route table, otherwise any route access will enter 404
  { path: '/*', name: 'NotFound', component: '@/pages/404' },
]
```

:::

## Page Navigation

For programmatic navigation or within components, please use the [`useRouter`](../api/api#userouter) API

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

  // These three forms are equivalent
  router.push('/users/posva#bio');
  router.push({ path: '/users/posva', hash: '#bio' });
  router.push({ name: 'users', params: { username: 'posva' }, hash: '#bio' });
  // Only change hash
  router.push({ hash: '#bio' });
  // Only change query
  router.push({ query: { page: '2' } });
  // Only change param
  router.push({ params: { username: 'jolyne' } });

  // Navigate to the previous route
  router.back();

  // Navigate to the forward history record
  router.go(1);

  // Replace the record in the history stack
  router.replace('/new');
</script>
```

For more details, [see here](https://router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup)

## router-link

[See details](../api/api#routerlink)

## router-view

[See details](../api/api#routerview)

## RouterLink Component

[See details](../api/api#routerlink)

For example:

```jsx
export default function Page () {
  return (
    <div>
      <router-link to="/users">Users Page</router-link>
    </div>
  )
}
```

Then clicking `Users Page` will navigate to the `/users` address.

Note:

* `RouterLink` is only used for internal navigation within a single-page application. For external URL navigation, please use the `a` tag

## Runtime Configuration

You can control vue and vue-router related configuration through export in the conventional `src/app.tsx`

### router

Configure router configuration

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

Vue app mount success callback. Here you can get the app instance and router instance, and can register global components, route interceptors, etc.

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

Modify the root component when handing over to vue-router for rendering.

For example, to wrap an outer parent component

```ts
import { h } from 'vue'

export function rootContainer(container) {
  return h(ThemeProvider, null, container);
}
```    

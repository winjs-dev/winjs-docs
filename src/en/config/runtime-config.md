# 运行时配置 {#runtimeConfig}

插件的配置分为**编译时**的和**运行时**的，编译时的配置是在 node 端执行，运行时的配置是在浏览器端执行。

运行时的配置的值有很多类型，可以为数组、对象、函数等等，而且配置只有注册了才能使用。

## 配置方式
约定在 `src/app.ts|tsx|js` 文件中使用插件运行时的配置，这些配置需通过 `export` 导出，插件中才能读取到，来控制 vue 和 vue-router 相关的配置。

可以在这里写函数、tsx、`import` 一些依赖来完成某些配置，但是只能 `import` 浏览器端依赖，注意不能引入 node 依赖，否则会陷入死循环，造成异常情况发生。同时要切记所 `import` 依赖只能跟配置相关，如果要引起全局依赖，请在 `src/global.ts` 文件中引入。

## TypeScript 提示

如果你想在写配置时也有提示，可以通过 WinJS 的 defineApp 方法定义配置。

```js
import { defineApp } from 'win';
export default defineApp({
  layout: () => {
    return {
      title: 'win',
    };
  },
});

// or
import { RuntimeConfig } from 'winjs';
export const layout: RuntimeConfig['layout'] = () => {
  return {
    title: 'win',
  };
};
```

## 配置项

> 以下配置项按字母排序。
        
### modifyClientRenderOpts(opts)

修改 `clientRender` 参数。

- routes，路由配置信息
- rootElement， 渲染的根节点，默认是 #root，可通过配置 mountElementId 修改。
- callback，回调函数

比如在微前端里动态修改渲染根节点：

```js
let isSubApp = false;
export function modifyClientRenderOpts(opts) {
  return {
    ...opts,
    rootElement: isSubApp ? 'sub-root' : opts.rootElement,    
  };
}

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
  
  // 路由拦截器
  router.beforeEach((to, from, next) => {
    next();
  })
}
```

### patchRoutes(\{ routes \})

```ts
export function patchRoutes({ routes, routeComponents }) {
  console.log('patchRoutes', routes, routeComponents);
}
```

- `routes`: 打平的路由列表。

- `routeComponents`: 路由对应的组件映射。

### render(oldRender: `Function`)

覆写 render。

比如用于渲染之前做权限校验，

```bash
export function render(oldRender) {
  fetch('/api/auth').then(auth => {
    if (auth.isLogin) { oldRender() }
    else {
      location.href = '/login';
      oldRender()
    }
  });
}
```

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

### request

如果你使用了 `import { request } from 'winjs';` 来请求数据，那么你可以通过该配置来自定义中间件、拦截器、错误处理适配等。具体参考 [request](../plugins/request) 插件配置。

### rootContainer(lastRootContainer, args)

修改交给 Vue 渲染时的根组件，默认是 `<router-view></router-view>`。

- lastRootContainer，最上层的根组件。
- args，包含：
  - routes，全量路由配置
  - plugin，运行时插件机制

比如用于在外面包一个 Provider。

```js
import { h } from 'vue'

export function rootContainer(container) {
  return h(ThemeProvider, null, container);
}
```

## 更多配置

WinJS 允许插件注册运行时配置，如果你使用插件，肯定会在插件里找到更多运行时的配置项。

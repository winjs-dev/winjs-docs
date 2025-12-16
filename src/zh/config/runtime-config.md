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
      title: 'winjs 应用',
    };
  },
});

// or
import { RuntimeConfig } from 'winjs';
export const layout: RuntimeConfig['layout'] = () => {
  return {
    title: 'winjs 应用',
  };
};
```

## 配置项

> 以下配置项按字母排序。

### modifyClientRenderOpts

`modifyClientRenderOpts` 是 WinJS 提供的运行时插件钩子，用于在客户端渲染前修改渲染选项。通过这个钩子，使用 `Vue2` 时，可以自定义 router、store、pinia 等核心实例，实现高度定制化的应用初始化。

#### 基本用法

在 `src/app.js` 中导出 `modifyClientRenderOpts` 函数：

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    // 在这里添加或修改渲染选项
  };
}
```  
#### 参数： memo 对象

`memo` 是传入的渲染选项对象，包含以下属性：

| 属性                  | 类型 | 说明                                        |
|---------------------|------|-------------------------------------------|
| `routes`            | `IRoutesById` | WinJS 路由配置对象（key-value 格式）                |
| `routeComponents`   | `IRouteComponents` | 路由组件映射表                                   |
| `pluginManager`     | `PluginManager` | 插件管理器实例                                   |
| `rootElement`       | `HTMLElement` | 挂载根元素                                     |
| `history`           | `History` | 路由历史对象（Vue Router 3.x 为 `{ base, mode }`） |
| `basename`          | `string` | 路由基础路径                                    |
| `publicPath`        | `string` | 公共资源路径                                    |
| `runtimePublicPath` | `boolean` | 是否使用运行时公共路径                               |
| `router` <Badge type="tip" text=">=0.16.6" />           | `Router` | 自定义 Vue Router 实例。提供更高的灵活性和自定义能力。这样可以不用遵循 WinJS 的路由规范，而采用原有的开发模式，更方便和快速的迁移项目到 WinJS                        |

#### 返回值

返回一个修改后的渲染选项对象，必须包含 `memo` 的所有原有属性。

#### 使用场景

##### 场景 1：传入自定义 Router 实例

**适用场景**：需要完全控制路由实例、微前端场景、使用第三方路由库(Vue Router 3.x、Vue 2.x)

```javascript
import customRouter from './router/index';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter
  };
}
```

**创建自定义 router**：

```javascript
// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import { routes } from './routes';

// 必须先注册插件
Vue.use(Router);

const router = new Router({ 
  mode: 'hash', 
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  // 权限验证逻辑
  next();
});

export default router;
```

##### 场景 2：传入 Vuex Store

**适用场景**：使用 Vuex 进行状态管理(Vue 2.x)

```javascript
import store from './stores';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    store: store
  };
}
```

**创建 Vuex store**：

```javascript
// src/stores/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: ''
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      // 登录逻辑
      return api.login({ username, password }).then(res => {
        commit('SET_USER', res.user);
        commit('SET_TOKEN', res.token);
      });
    }
  }
});
```

##### 场景 3：传入 Pinia

**适用场景**：使用 Pinia 进行状态管理（Vue 2.7+）

```javascript
import { createPinia } from 'pinia';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    pinia: createPinia()
  };
}
```

##### 场景 4：同时传入多个实例

**适用场景**：需要自定义 router 和 store

```javascript
import customRouter from './router/index';
import store from './stores';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter,
    store: store
  };
}
```

##### 场景 5：修改其他渲染选项

**适用场景**：自定义根元素、修改基础路径等

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    // 自定义根元素
    rootElement: document.getElementById('app'),
    
    // 修改基础路径
    basename: '/my-app/',
    
    // 添加自定义属性
    customOption: 'custom-value'
  };
}
```

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

#### 推荐方式（直接传入）

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter,
    store: store,
    pinia: createPinia()
  };
}
```

**优势**：
- 代码简洁清晰
- 类型提示完整
- 易于理解和维护

#### 兼容方式（通过 callback）

```javascript
export function modifyClientRenderOpts(memo) {
  const callback = () => {
    return {
      store: store,
      pinia: createPinia()
    };
  };
  return {
    ...memo,
    router: customRouter,
    callback
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

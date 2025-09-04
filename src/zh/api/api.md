# API {#api}

为方便查找，以下内容通过字母排序。

## 基础 API

### terminal

`terminal` 用于在开发阶段在浏览器向 node 终端输出日志的工具。

示例：
```ts
import { terminal } from 'winjs';
// 下面三条命令会在 win 启动终端上打出用不同颜色代表的日志
terminal.log('i am log level');
terminal.warn('i am warn level');
terminal.error('i am error level');
```
注意 `terminal` 只在环境变量 `NODE_ENV` 非 `production` 时生效；在 WinJS 的构建产物中对应的日志调用函数不会有任何作用，所以可以不必删除调用 `terminal` 的代码。

### useAppData

`useAppData` 返回全局的应用数据。

类型定义如下：

```ts
declare function useAppData(): {
  routes: Record<id, Route>;
  routeComponents: Record<id, Promise<VueRouter.RouteComponent>>;
  clientRoutes: ClientRoute[];
  pluginManager: any;
  rootElement: string;
  basename: string;
};
```
注意：此处 API 可能还会调整。

## 路由 API

WinJS 使用 Vue3 时，路由是基于 [Vue Router 4.0](https://router.vuejs.org/zh/api)，想了解更多，可以查看官方文档。Vue2 则使用的是 [Vue Router 3.x](https://v3.router.vuejs.org/zh/)。

### createWebHashHistory

创建一个 hash 模式的历史。在没有主机的 web 应用 (如 file://) 或无法通过配置服务器来处理任意 URL 的时候非常有用。

类型定义如下：
```ts
createWebHashHistory(base?): RouterHistory
```

使用范例：
```ts
// create a BrowserHistory
import { createWebHashHistory } from 'winjs';
// 基于 https://example.com/folder
createWebHashHistory() // 给出一个 `https://example.com/folder#` 的 URL
createWebHashHistory('/folder/') // 给出一个 `https://example.com/folder/#` 的 URL
// 如果其基础位置提供了 `#`，则不会被 `createWebHashHistory` 添加
createWebHashHistory('/folder/#/app/') // 给出一个 `https://example.com/folder/#/app/` 的 URL
// 你应该避免这样做，因为它改变了原始的 URL 且破坏了复制 URL 的工作
createWebHashHistory('/other-folder/') // 给出一个 `https://example.com/other-folder/#` 的 URL

// 基于 file:///usr/etc/folder/index.html
// 对于没有 `host` 的位置，该 base 会被忽略
createWebHashHistory('/iAmIgnored') // 给出一个 `file:///usr/etc/folder/index.html#` 的 URL
```

### createWebHistory

创建一个 HTML5 历史。对于单页应用来说这是最常见的历史。

`WebHashHistory` 与 `WebHistory` 的主要区别在于，`WebHashHistory` 将当前位置存储在 URL 的哈希部分中，这意味着它在路由切换时不会发送请求到服务器。如果您将站点托管在您无法完全控制服务器上，或者在只提供同单页面的 Electron 应用程序中，推荐使用 `WebHashHistory`。

类型定义如下：
```ts
createWebHistory(base?): RouterHistory
```  

使用范例：
```ts
// create a HashHistory
import { createWebHistory } from 'winjs';
const history = createWebHistory();
```

### createMemoryHistory

创建一个基于内存的历史。该历史的主要目的是为了处理服务端渲染。它从一个不存在的特殊位置开始。用户可以通过调用 router.push 或 router.replace 将该位置替换成起始位置。
`MemoryHistory` 不会在地址栏被操作或读取。它也非常适合测试和其他的渲染环境。

类型定义如下：
```ts
createMemoryHistory(base?): RouterHistory
```  

使用范例：
```ts
const history = createMemoryHistory(location)
```

### createRouter

创建一个路由器实例，该实例可用于 Vue 应用程序。查看[路由器选项](https://router.vuejs.org/zh/api/interfaces/RouterOptions.html)，了解可以传递的所有属性的列表。

类型定义如下：
```ts
createRouter(options): Router
```

### getRouter 

- **版本**：<VersionTag version="0.13.11" />

返回路由器 router 实例，相当于在模板语法中使用 $router。

类型定义如下：
```ts
getRouter(): Router
```

```ts
import { getRouter } from 'winjs';

const router = getRouter();

router.push('/hello');
```

### getRoute

- **版本**：<VersionTag version="0.17.4" />

返回路由器 router 的当前路由对象信息，相当于在模板语法中使用 $route，只适用于 vue-router 3.x。

类型定义如下：
```ts
getRoute(): Route
```

```ts
import { getRoute } from 'winjs';

export const getCurrentRoute = () => {
  const route = getRoute();
  console.log('当前路由:', route?.path);
  return route;
};
```

### onBeforeRouteUpdate

添加一个导航守卫，不论当前位置何时被更新都会触发。类似于 `beforeRouteUpdate`，但可以在任何组件中使用。当组件被卸载时，该守卫会被移除。

类型定义如下：
```ts
onBeforeRouteUpdate(updateGuard): void
```

```js
import { onBeforeRouteUpdate } from 'winjs';

export default {
  setup() {
    onBeforeRouteUpdate((to, from, next) => {});
  },
};
```

### onBeforeRouteLeave

添加一个导航守卫，不论当前位置的组件何时离开都会触发。类似于 `beforeRouteLeave`，但可以在任意组件中使用。当组件被卸载时，该守卫会被移除。

类型定义如下：
```ts
onBeforeRouteLeave(leaveGuard): void
``` 

```js
import { onBeforeRouteLeave } from 'winjs';

export default {
  setup() {
    onBeforeRouteLeave((to, from, next) => {});
  },
};
```  

### RouterLink

使用自定义组件路由器链接来创建链接，而不是使用常规标签。这使得 Vue 路由器无需重新加载页面即可更改 URL、处理 URL 生成及其编码。

```html
<router-link to="/about">Go to About</router-link>
```

可以查看[官方文档](https://router.vuejs.org/zh/api/interfaces/RouterLinkProps.html)了解更多 RouterLink 的 Props。查看[官方文档](https://router.vuejs.org/zh/api/interfaces/RouterLinkProps.html#Properties-custom)了解 RouterLink 的作用域插槽。

### useLink

返回的结果跟 RouterLink 的作用域插槽的属性一致，查看[官方 API](https://next.router.vuejs.org/api/#router-link-s-v-slot)了解更多。

```js
import { RouterLink, useLink } from 'winjs';

export default {
  name: 'AppLink',

  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String
  },

  setup(props) {
    // `props` contains `to` and any other prop that can be passed to <router-link>
    const { navigate, href, route, isActive, isExactActive } = useLink(props);

    // profit!

    return { isExternalLink };
  }
};
``` 

### useRoute

返回当前 route 实例，相当于在模板内使用 $route。必须在 setup 函数内调用。

类型定义如下：
```ts
useRoute(): RouteLocationNormalizedLoaded
```

示例：

```ts
import { useRoute } from "win";

export default {
  setup() {
    const route = useRoute();
  },
};
```

### useRouter

返回路由器 router 实例，相当于在模板语法中使用 $router。必须在 setup 函数内调用。

类型定义如下：
```ts
useRouter(): Router
```

```ts
import { useRouter } from 'winjs'

export default {
  setup() {
    const router = useRouter();
  },
};
```

### RouterView

router-view 将显示当前 URL 的对应的路由组件。你可以把它放在任何地方，以适应你的布局。

```html
<router-view></router-view>
<router-view v-slot="{ Component, route }">
  <component :is="Component" />
</router-view>
```

可以查看[官方文档](https://router.vuejs.org/api/interfaces/RouterViewProps.html)了解更多 RouterView 的 Props。查看[官方文档](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#Properties-custom)了解 RouterView 的作用域插槽。

### 其他 Router Methods

查看 [vue-router](https://router.vuejs.org/) 官方文档了解更多。

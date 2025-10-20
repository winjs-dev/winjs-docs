# Runtime Configuration {#runtimeConfig}

Plugin configurations are divided into **compile-time** and **runtime** configurations. Compile-time configurations are executed on the Node.js side, while runtime configurations are executed on the browser side.

Runtime configuration values can be of many types, including arrays, objects, functions, etc., and configurations can only be used after they are registered.

## Configuration Method
By convention, plugin runtime configurations are used in the `src/app.ts|tsx|js` file. These configurations need to be exported through `export` for plugins to read and control Vue and Vue Router related configurations.

You can write functions, TSX, and `import` some dependencies here to complete certain configurations, but you can only `import` browser-side dependencies. Note that Node.js dependencies cannot be imported, otherwise it will cause infinite loops and abnormal situations. Also remember that imported dependencies should only be configuration-related. If you need to introduce global dependencies, please import them in the `src/global.ts` file.

## TypeScript Support

If you want IntelliSense when writing configurations, you can define configurations using WinJS's defineApp method.

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

## Configuration Options

> The following configuration options are sorted alphabetically.
        
### modifyClientRenderOpts(opts)

Modifies the `clientRender` parameters.

- routes: Route configuration information
- rootElement: The root node for rendering, defaults to #root, can be modified through mountElementId configuration.
- callback: Callback function

For example, dynamically modifying the render root node in a micro-frontend:

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

Vue app mount success callback. Here you can get the app instance and router instance for global component registration, route guards, etc.

```ts
export function onMounted({ app, router }: any) {
  console.log('onMounted', app, router);
  app.provide('win-hello', {
    h: 'hello',
    w: 'word',
  });
  
  // Route guards
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

- `routes`: Flattened route list.

- `routeComponents`: Route to component mapping.

### render(oldRender: `Function`)

Overrides the render method.

For example, for permission verification before rendering:

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

Configure router settings:

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

If you use `import { request } from 'winjs';` to request data, you can customize middleware, interceptors, error handling adapters, etc., through this configuration. For details, refer to the [request](../plugins/request) plugin configuration.

### rootContainer(lastRootContainer, args)

Modifies the root component passed to Vue for rendering. The default is `<router-view></router-view>`.

- lastRootContainer: The topmost root component.
- args: Contains:
  - routes: Complete route configuration
  - plugin: Runtime plugin mechanism

For example, to wrap with a Provider:

```js
import { h } from 'vue'

export function rootContainer(container) {
  return h(ThemeProvider, null, container);
}
```

## More Configurations

WinJS allows plugins to register runtime configurations. If you use plugins, you will definitely find more runtime configuration options in the plugins.

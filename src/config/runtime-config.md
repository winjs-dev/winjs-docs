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

### modifyClientRenderOpts

`modifyClientRenderOpts` is a runtime plugin hook provided by WinJS for modifying render options before client-side rendering. Through this hook, when using `Vue2`, you can customize core instances such as router, store, pinia, etc., to achieve highly customized application initialization.

#### Basic Usage

Export the `modifyClientRenderOpts` function in `src/app.js`:

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    // Add or modify render options here
  };
}
```

#### Parameters: memo Object

`memo` is the passed render options object, containing the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `routes` | `IRoutesById` | WinJS route configuration object (key-value format) |
| `routeComponents` | `IRouteComponents` | Route component mapping table |
| `pluginManager` | `PluginManager` | Plugin manager instance |
| `rootElement` | `HTMLElement` | Mount root element |
| `history` | `History` | Route history object (Vue Router 3.x is `{ base, mode }`) |
| `basename` | `string` | Route base path |
| `publicPath` | `string` | Public resource path |
| `runtimePublicPath` | `boolean` | Whether to use runtime public path |
| `router` <Badge type="tip" text=">=0.16.6" /> | `Router` | Custom Vue Router instance. Provides higher flexibility and customization capabilities. This allows you to not follow WinJS routing conventions and adopt your original development mode, making it more convenient and faster to migrate projects to WinJS |

#### Return Value

Returns a modified render options object that must include all original properties of `memo`.

#### Usage Scenarios

##### Scenario 1: Pass Custom Router Instance

**Use Case**: Need complete control over router instance, micro-frontend scenarios, using third-party routing libraries (Vue Router 3.x, Vue 2.x)

```javascript
import customRouter from './router/index';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    router: customRouter
  };
}
```

**Create custom router**:

```javascript
// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import { routes } from './routes';

// Must register plugin first
Vue.use(Router);

const router = new Router({ 
  mode: 'hash', 
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

// Add global route guards
router.beforeEach((to, from, next) => {
  // Permission verification logic
  next();
});

export default router;
```

##### Scenario 2: Pass Vuex Store

**Use Case**: Using Vuex for state management (Vue 2.x)

```javascript
import store from './stores';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    store: store
  };
}
```

**Create Vuex store**:

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
      // Login logic
      return api.login({ username, password }).then(res => {
        commit('SET_USER', res.user);
        commit('SET_TOKEN', res.token);
      });
    }
  }
});
```

##### Scenario 3: Pass Pinia

**Use Case**: Using Pinia for state management (Vue 2.7+)

```javascript
import { createPinia } from 'pinia';

export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    pinia: createPinia()
  };
}
```

##### Scenario 4: Pass Multiple Instances Simultaneously

**Use Case**: Need to customize both router and store

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

##### Scenario 5: Modify Other Render Options

**Use Case**: Customize root element, modify base path, etc.

```javascript
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    // Customize root element
    rootElement: document.getElementById('app'),
    
    // Modify base path
    basename: '/my-app/',
    
    // Add custom properties
    customOption: 'custom-value'
  };
}
```

For example, dynamically modifying the render root node in micro-frontend:

```js
let isSubApp = false;
export function modifyClientRenderOpts(opts) {
  return {
    ...opts,
    rootElement: isSubApp ? 'sub-root' : opts.rootElement,    
  };
}
```

#### Recommended Approach (Direct Pass)

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

**Advantages**:
- Clean and clear code
- Complete type hints
- Easy to understand and maintain

#### Compatible Approach (Via Callback)

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

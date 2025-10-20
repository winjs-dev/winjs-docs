# API {#api}

For easy reference, the following content is sorted alphabetically.

## Basic APIs

### terminal

`terminal` is a utility for outputting logs from the browser to the Node.js terminal during development.

Example:
```ts
import { terminal } from 'winjs';
// The following three commands will output logs with different colors in the win startup terminal
terminal.log('i am log level');
terminal.warn('i am warn level');
terminal.error('i am error level');
```
Note that `terminal` only works when the environment variable `NODE_ENV` is not `production`. In WinJS build artifacts, the corresponding log function calls have no effect, so you don't need to remove `terminal` calls from your code.

### useAppData

`useAppData` returns global application data.

Type definition:

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
Note: This API may still be subject to changes.

## Routing APIs

When using Vue 3, WinJS routing is based on [Vue Router 4.0](https://router.vuejs.org/api). For more information, please refer to the official documentation. Vue 2 uses [Vue Router 3.x](https://v3.router.vuejs.org/).

### createWebHashHistory

Creates a hash history. Very useful for web applications hosted without a server (like `file://`) or when you can't configure your server to handle arbitrary URLs.

Type definition:
```ts
createWebHashHistory(base?): RouterHistory
```

Usage example:
```ts
// create a HashHistory
import { createWebHashHistory } from 'winjs';
// based on https://example.com/folder
createWebHashHistory() // gives a `https://example.com/folder#` URL
createWebHashHistory('/folder/') // gives a `https://example.com/folder/#` URL
// if the base location is provided with a `#`, it won't be added by `createWebHashHistory`
createWebHashHistory('/folder/#/app/') // gives a `https://example.com/folder/#/app/` URL
// you should avoid doing this because it changes the original URL and breaks copying URLs
createWebHashHistory('/other-folder/') // gives a `https://example.com/other-folder/#` URL

// based on file:///usr/etc/folder/index.html
// for locations without a host, the base is ignored
createWebHashHistory('/iAmIgnored') // gives a `file:///usr/etc/folder/index.html#` URL
```

### createWebHistory

Creates an HTML5 history. This is the most common history for single page applications.

The main difference between `WebHashHistory` and `WebHistory` is that `WebHashHistory` stores the current location in the hash portion of the URL, meaning it doesn't send requests to the server during route changes. If you're hosting your site on a server you can't fully control, or in an Electron app that only serves a single page, `WebHashHistory` is recommended.

Type definition:
```ts
createWebHistory(base?): RouterHistory
```  

Usage example:
```ts
// create a WebHistory
import { createWebHistory } from 'winjs';
const history = createWebHistory();
```

### createMemoryHistory

Creates a memory-based history. The main purpose of this history is to handle server-side rendering. It starts from a special location that doesn't exist. You can replace this location with a starting location by calling router.push or router.replace.
`MemoryHistory` is not manipulated or read from the address bar. It's also perfect for testing and other rendering environments.

Type definition:
```ts
createMemoryHistory(base?): RouterHistory
```  

Usage example:
```ts
const history = createMemoryHistory(location)
```

### createRouter

Creates a router instance that can be used by a Vue application. Check [router options](https://router.vuejs.org/api/interfaces/RouterOptions.html) for a list of all properties that can be passed.

Type definition:
```ts
createRouter(options): Router
```

### getRouter 

- **Version**: <VersionTag version="0.13.11" />

Returns the router instance, equivalent to using $router in template syntax.

Type definition:
```ts
getRouter(): Router
```

```ts
import { getRouter } from 'winjs';

const router = getRouter();

router.push('/hello');
```

### getRoute

- **Version**：<VersionTag version="0.17.4" />

Return the current routing object information of the router. It is equivalent to using $route in the template syntax and is only applicable to vue-router 3.x.

Type definition：
```ts
getRoute(): Route
```

```ts
import { getRoute } from 'winjs';

export const getCurrentRoute = () => {
  const route = getRoute();
  console.log('current route:', route?.path);
  return route;
};
```

### onBeforeRouteUpdate

Adds a navigation guard that is triggered whenever the current location is updated. Similar to `beforeRouteUpdate`, but can be used in any component. The guard is removed when the component is unmounted.

Type definition:
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

Adds a navigation guard that is triggered whenever a component for the current location is about to be left. Similar to `beforeRouteLeave`, but can be used in any component. The guard is removed when the component is unmounted.

Type definition:
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

Uses a custom component router link to create links instead of using regular anchor tags. This allows Vue Router to change URLs without reloading the page, handling URL generation and encoding.

```html
<router-link to="/about">Go to About</router-link>
```

You can check the [official documentation](https://router.vuejs.org/api/interfaces/RouterLinkProps.html) for more RouterLink props. Check the [official documentation](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#Properties-custom) for RouterLink scoped slots.

### useLink

Returns the same result as RouterLink's scoped slot properties. Check the [official API](https://next.router.vuejs.org/api/#router-link-s-v-slot) for more information.

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

### useRoute

Returns the current route instance, equivalent to using $route in templates. Must be called inside a setup function.

Type definition:
```ts
useRoute(): RouteLocationNormalizedLoaded
```

Example:

```ts
import { useRoute } from "win";

export default {
  setup() {
    const route = useRoute();
  },
};
```

### useRouter

Returns the router instance, equivalent to using $router in template syntax. Must be called inside a setup function.

Type definition:
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

router-view will display the route component corresponding to the current URL. You can place it anywhere to fit your layout.

```html
<router-view></router-view>
<router-view v-slot="{ Component, route }">
  <component :is="Component" />
</router-view>
```

You can check the [official documentation](https://router.vuejs.org/api/interfaces/RouterViewProps.html) for more RouterView props. Check the [official documentation](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#Properties-custom) for RouterView scoped slots.

### Other Router Methods

Check the [vue-router](https://router.vuejs.org/) official documentation for more information.

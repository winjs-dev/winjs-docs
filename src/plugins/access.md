# Access Control

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-locale?style=flat-square&colorB=646cff)

For frontend applications, "access control" refers to whether pages are accessible and whether page elements are visible.

## Setup

1. Install the plugin

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

2. Enable the plugin in the `.winrc` configuration file

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
   * @name Access Control Plugin
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

## Introduction

In this plugin design, one page permission corresponds to one route. For example, when accessing the `'/admin'` route, if the current role doesn't have permission for this route, the component will not be rendered.

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

Usage example:

```vue

<template>
  <Access :id="accessId">Only visible to Admin</Access>
  <div v-access="accessId">Only visible to Admin</div>
</template>

<script setup lang="ts">
const accessId = '/admin';
</script>
```

::: tip Note  
We uniformly refer to pages and page elements as resources, and use resource IDs to identify and distinguish them:

- The resource ID of a page defaults to the page's route `path`. For example, the route `path` of page `pages/a.vue` is `/a`. When the page accesses `/a`, the current page will be rendered, and `/a` is the page's `accessId`.
- Page elements' resource IDs have no default value and need to be customized.
  :::

### Matching Rules

#### Exact Matching

The default matching rule for resources is exact matching. For example, if page `pages/a.vue` corresponds to route `path` `/a`, then `/a` is the page's resource ID. If we set:

```js
access.setAccess(['/a']);
```

Since the permission list contains `/a`, it indicates having permission for this page.

#### Fuzzy Matching

Page `@id.vue` will be mapped to dynamic route `/:id`. There are two ways to match this page:

- **access.setAccess(['/:id'])**
- **access.setAccess(['/*'])**

The second is fuzzy matching, where `*` represents any path. For example, if role `admin` needs full permissions:

```js
export default {
  access: {
    roles: {
      admin: ['*']
    }
  }
};
```

## Compile-time Configuration

When executing `win dev` or `win build`, runtime code is generated through this configuration. Configure in the `.winrc.js` configuration file:

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

- **Type**: `Record<string, []>;`
- **Default**: `{}`

- **Details**:

  Predefined role list. `key` is the role ID, and `value` is the resource list corresponding to the role ID.

## Runtime Configuration

Configure in `app.js`

### unAccessHandler

- **Type**: `Function`
- **Default**: `null`
- **Details**: When entering a route, if the page corresponding to the route doesn't belong to the visible resource list, entry will be paused and the `unAccessHandler` function will be called.

- **Parameters**
  - router: Router instance created by createRouter
  - to: Route being navigated to
  - from: Route being navigated away from
  - next: [next function](https://router.vuejs.org/guide/advanced/navigation-guards.html#optional-third-argument-next)

Example:

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

- **Type**: `Function`
- **Default**: `null`
- **Details**: When entering a route, if the page corresponding to the route doesn't exist, the `noFoundHandler` function will be called.
- **Parameters**
  - router: Router instance created by createRouter
  - to: Route being navigated to
  - from: Route being navigated away from
  - next: [next function](https://router.vuejs.org/guide/advanced/navigation-guards.html#optional-third-argument-next)

Example:

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

- **Type**: `Array<string>`
- **Default**: `null`
- **Details**: Configure pages that should ignore access control validation.

Example:

```js
export const access = {
  ignoreAccess: ['/login'],
};
```

## API

WinJS uses custom directives, specifically the `v-access` directive, passing in the object returned by useAccess to control component rendering.

Plugin APIs are exported through `winjs`:

```js
import { access } from 'winjs';
```

#### access.hasAccess

- **Type**: `( accessId: string | number ) => Promise\<boolean\>`
- **Details**: Determine whether a resource is visible.
- **Parameters**:
  - accessId: Resource ID
- **Returns**: Whether access is granted

#### access.isDataReady

- **Type**: `() => boolean`
- **Details**: Permissions can be set using asynchronous data. `isDataReady` is used to determine whether asynchronous data has finished loading.
- **Parameters**: null
- **Returns**: Boolean

```js
import { access } from 'winjs';

console.log(access.isDataReady());
```

#### access.setRole

- **Type**: `Function`
- **Details**: Set the current role.
- **Parameters**:
- roleId: Role ID, has two types:
  - String: Corresponds to the `key` in the `roles` configuration object.
  - Promise: The result of Promise resolve should correspond to the `key` in the `roles` configuration object.

```js
import { access } from 'winjs';

access.setRole('admin');
```

#### access.getRole

- **Type**: `Function`
- **Details**: Get the current role.

```js
import { access } from 'winjs';

access.getRole();
```

#### access.setAccess

- **Type**: `Function`
- **Details**: Set the current access permissions.
- **Parameters**:
- accessIds: Array of resource IDs, has two types:
  - Array: Array items correspond to the `key` in the `roles` configuration object.
  - Promise: The result of Promise resolve should be `Array<accessId>`.

```js
import { access } from 'winjs';

access.setAccess(['/a', '/b', '/c']);
```

#### access.getAccess

- **Type**: `Function`
- **Details**: Return the current list of visible resources.
- **Parameters**: null

```js
import { access } from 'winjs';

access.getAccess();
```

### useAccess

- **Type**: [Composition](https://vuejs.org/guide/extras/composition-api-faq.html#what-is-composition-api) function
- **Details**: Determine whether a resource is visible.
- **Parameters**:
  - accessId: Resource ID
- **Returns**: `ref`

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

Pass `accessId` into the `v-access` directive. When `accessId` has permission, the DOM will be displayed; when there's no permission, the DOM will be hidden.

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

### Access Component

Pass `accessId` into the `Access` component. When `accessId` has permission, this component will be rendered; when there's no permission, this component will be hidden.

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

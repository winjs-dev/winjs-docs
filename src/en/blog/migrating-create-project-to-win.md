# Migrating create-project to WinJS

> This document serves only as a basic guide for migrating `@winner-fed/create-project` to WinJS. For real project migration, you may also need to read our documentation to learn more about [plugins](../plugins/index) and [configuration](../config/config).

Actually, migrating a `@winner-fed/create-project` project to WinJS is relatively straightforward. The main thing to pay attention to is the differences in some default behaviors. Next, we'll migrate a `@winner-fed/create-project` initial project to WinJS through the following steps.

## Dependency Management

Modify dependencies in `package.json` and update project startup commands. For more information about win CLI, check [our documentation](../cli/commands).

```diff
{
  "scripts": {
-    "dev": "npm run serve",
+    "dev": "win dev",
-    "build": "node build/index.js --no-module",
+    "build": "win build",
  },
  "dependencies": {
+    "@winner-fed/winjs": "^0.5.1"
  },
+ "devDependencies": {
+    "@winner-fed/preset-vue": "^0.5.1",
+    "@winner-fed/plugins": "^0.5.1"
+ }
}
```

## Modifying the Root Component

The entry point for `@winner-fed/create-project` is `src/App.vue`. In WinJS, there's no real exposed main application entry, but we can perform the same operations in [layouts](../guides/directory-structure#layouts-index-vue).

Transfer the logic from `src/App.vue` to `src/layouts/index.vue`. After completing the operation, your code should look like:

```vue

<template>
  <div class="pages">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/docs">Docs</router-link>
      </li>
    </ul>
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<style scoped lang="less">
.navs {
  ul {
    padding: 0;
    list-style: none;
    display: flex;
  }

  li {
    margin-right: 1em;
  }
}
</style>

```

## Moving Page Files

Move page components to the [`src/pages`](../guides/routes#convention-based-routing) directory.

## HTML Template

Remove the `public/index.html` file.

WinJS has deprecated `index.html`. You can directly compose the final HTML through exposed related APIs. For details, refer to [here](../guides/faq#where-did-index-html-go-how-to-customize-html-template).

## Starting the Project

Execute `win dev`, and the project will start at `http://localhost:8000/`. If you're accustomed to using port `3000`, you can set it through [environment variables](../guides/env-variables). Now the project should look consistent with the effect before migration.

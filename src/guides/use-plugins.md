# Plugins {#use-plugins}

## Using Plugins

In regular WinJS applications, **no plugins are included by default**, and you need to manually install plugins and enable them:

For example, to install the request plugin:

```bash
pnpm add -D @winner-fed/plugin-request
```

To enable the request plugin:

```ts
// .winrc.ts
export default {
  plugins: ['@winner-fed/plugin-request'],
  request: {}
}
```

## Project-level Plugins

If you want to quickly use plugin functionality in your project (such as [modifying the build output HTML](./faq#documentejs-去哪了如何自定义-html-模板)), you can create a `plugin.ts` file in the project root directory to write a project-level plugin, which will be automatically loaded as a plugin.

For more detailed directory structure information, please refer to the [Directory Structure](./directory-structure) chapter.

## Developing Plugins

Please refer to the [Developing Plugins](./plugins) chapter.





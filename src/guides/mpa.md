# MPA Mode

WinJS supports traditional MPA mode. In this mode, `*/index.[jt]sx?` files in the `src/pages` directory are used as webpack entries for bundling, with no routing, no history, and no win.js, meeting the needs of scenarios such as H5 development and kitchen plugin development.

Note: This MPA mode has no routing mechanism and cannot use many plugin capabilities. It's only suitable for use as a build tool.

## Usage

MPA is a built-in feature that can be enabled through configuration.

```js
export default {
  mpa: {
    template: string,
    getConfigFromEntryFile: boolean,
    layout: string,
    entry: object,
  },
}
```

The MPA directory structure is `src/pages/${dir}/index.[jt]sx`. Each folder `${dir}` generates a page, and the `index.[jt]sx` file within the folder is the entry file for that page.

Configuration options:

- `template`: HTML template for build artifacts. For example, `template/index.html` will search from the project root directory and use the `index.html` at the corresponding path as the HTML template for build artifacts.
- `getConfigFromEntryFile`: Read page-specific configuration from each page's entry file (`src/*/index.tsx`).
- `layout`: Global default layout.
- `entry`: Configuration for each entry file. For example, `{ foo: { title: '...' } }` can configure the `title` property for the `src/foo/index.tsx` page.

## Conventional Entry Files

The default entry files are `*/index.[jt]sx?` files in the `src/pages` directory.

For example:

```
+ src/pages
  - foo/index.tsx
  - bar/index.tsx
  - hoo.tsx
```

Then, the `entry` structure would be:

```ts
{
  foo: 'src/pages/foo/index.tsx',
  bar: 'src/pages/bar/index.tsx'
}
```

After building, corresponding HTML files will be generated for each entry file, resulting in artifacts `foo.html` and `bar.html`.

### Page-level Configuration

### config.json

Configuration is conventionally declared through `config.json` at the same level as the entry file. For example, with the following directory structure:

```
+ src/pages
  + foo
    - index.tsx
    - config.json
```

`foo/config.json` configures the page's independent `layout` and `title`:

```json
{
  "layout": "@/layouts/bar.ts",
  "title": "foooooo"
}
```

Currently supported configuration options include:

* **template**: Template path. Refer to [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) template syntax, using variables through lodash template syntax.
* **layout**: Page layout. It's recommended to reference files in the src directory starting with `@/`.
* **title**: Page title. Default is the directory name where the entry file is located.
* **mountElementId**: The ID of the node to mount to when rendering the page. Default is `root`.

### getConfigFromEntryFile

WinJS also experimentally supports another configuration reading method, enabled by configuring `mpa: { getConfigFromEntryFile: true }`.

In this case, you can avoid using `config.json` and instead export the page configuration through `export const config` in the entry file.

For example:

```ts
// src/pages/foo/index.tsx
export const config = {
  layout: '@/layouts/bar.ts',
  title: 'foooooo',
}
```

### entry

You can also configure each page in `.winrc.ts`:

```ts
  mpa: {
    entry: {
      foo: { title: 'foo title' }
    }
  }
```

### On-demand Startup

Supports specifying which pages to start by setting `env.MPA_FILTER` to improve build speed:

```text
# file .env
# Only bar and foo pages will be started
MPA_FILTER=bar,foo
```

## Rendering

The default rendering method is Vue. Entry files only need to export Vue components for rendering.

```tsx
<script setup>
  import { ref } from 'vue';
  /**
  * The following is example code only and can be extended and modified freely
  */
  const title = ref('Welcome to Your Vue.js App.');
</script>
<template>
  <div class="page page-hello">
    <div class="page-content">
      <!-- Static resource path example -->
      <img class="logo" src="@/assets/img/logo.png" alt="logo" />
      <h1>{{ title }}</h1>
      <p>
        For custom configuration guidance, please visit
        <a href="https://winjs-dev.github.io/create-project/" target="_blank" rel="noopener"
        >create-project documentation</a
        >.
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped src="./style.less"></style>
```

## Template

The default template is as follows:

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
  </head>
  <body>
    <div id="<%= mountElementId %>"></div>
  </body>
</html>
```

You can customize the global HTML template through the `template` configuration, or configure page-level settings to use different templates for different pages. Please ensure that variables include at least `<%= title %>` and `<%= mountElementId %>`.

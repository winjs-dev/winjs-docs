# Styling {#styling}

This article introduces various ways to use styles in WinJS projects.

## Global Styles

Based on the project's long-term accumulated `reset.c[le]ss` as a modern alternative to CSS style reset.

```less
/*
  1. Use a more-intuitive box-sizing model.
*/
*,
*::before,
*::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

*:not(input, textarea) {
  // Non-standard property
  // When you touch and hold a touch target, disable or show the system default menu. On iOS, when you touch and hold a touch target, such as a link, Safari browser will show the system default menu related to the link. This property allows you to disable the system default menu.
  -webkit-touch-callout: none;
  // If set to none on iOS, input and textarea input cannot trigger onchange or oninput events
  // This will cause the problem of not being able to input values
  -webkit-user-select: none;
  user-select: none;
}

html,
body {
  height: 100%;
  // https://www.zhangxinxu.com/wordpress/2018/10/scroll-behavior-scrollintoview-%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8/
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  font-size: 14px;
  line-height: 1.4;
  color: #414141;
  background-color: #fff;
  // Improve text rendering
  -webkit-font-smoothing: antialiased;
}

// Margin & Padding
html,
body,
h1,
h2,
h3,
h4,
p,
form,
button,
input,
select,
ul,
ol,
dl,
dd {
  padding: 0;
  margin: 0;
}

// Font
h1,
h2,
h3,
h4,
i,
em,
strong {
  font-weight: normal;
}

i,
em,
b {
  font-style: normal;
  font-weight: normal;
}

// Link
a {
  color: @colorBlueMain;
  text-decoration: none;
}

a:active {
  text-decoration: none;
  outline: 0;
}

// Forms
button,
html input[type="button"],
input[type="reset"],
input[type="submit"] {
  cursor: pointer;
}

button[disabled],
html input[disabled] {
  cursor: default;
}

button,
input {
  border: none;
  outline: none;
}

// Tables
table {
  border-collapse: collapse;
  border-spacing: 0;
}

ul,
li {
  list-style: none;
}

/*
  6. Improve media defaults
*/
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/*
  7. Remove built-in form typography styles
*/
input,
button,
textarea,
select {
  font: inherit;
}

/*
  8. Avoid text overflows
*/
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/*
  9. Create a root stacking context
*/
#root,
#__next {
  isolation: isolate;
}

// --- Project-level additions
// Prevent images from being stretched or compressed
img {
  object-fit: cover;
}

```

Common styles used in the project are stored in the `src/assets/style/` directory.

## Using CSS Styles

You can use `.css` files to declare various styles in WinJS projects, then import them in `.js` files to take effect.

For example, declare the `.title` class style as red in the `src/pages/index.css` file with the following code:

```css
.title {
  color: red;
}
```

Then import it in the `src/pages/index.tsx` file to take effect.

```jsx
// src/pages/index.tsx

import './index.css';

export default function () {
  return <div className="title">Hello World</div>;
}
```

Styles imported in this way will take effect throughout the WinJS project, meaning that regardless of which `.js` file you import from, the declared styles can be used in any page and component. If you want to avoid this situation, you can use [CSS Modules](#using-css-modules) functionality to limit the scope of styles.

## Using CSS Modules

When importing styles in `js` files, if you assign it a variable name, you can import the styles as CSS Modules.

```jsx
// src/pages/index.tsx

import styles from './index.css';

export default function () {
  return <div className={styles.title}>
    Hello World
  </div>;
}
```

In the above example, the styles declared in the `index.css` file will not affect global styles and will only take effect for styles used from the `styles` variable.

## Using CSS Preprocessors

WinJS supports importing LESS (recommended), SASS, and SCSS styles by default. You can directly import and use these styles processed by CSS preprocessors in the same way as importing CSS files. It also provides some LESS-based `mixins` function library [magicless](https://github.com/cloud-templates/magicless) accumulated over time. Moreover, the scaffolding has globally injected common **variables and functions**, so they can be used directly in actual page development.

::: tip Tip
Using Sass(Scss) in WinJS requires additional installation of preprocessing dependencies such as: `npm add -D sass`
:::

```jsx
// src/pages/index.tsx

import './index.less';
import './index.sass';
import './index.scss';

export default function () {
  return <div className="title">Hello World</div>;
}
```

CSS Module usage is also supported:

```jsx
// src/pages/index.tsx

import lessStyles from './index.less';
import sassStyles from './index.sass';
import scssStyles from './index.scss';

export default function () {
  return <div className={lessStyles.title}>
    Hello World
    <p className={sassStyles.blue}>I am blue</p>
    <p className={scssStyles.red}>I am red</p>
  </div>;
}
```

WinJS also provides built-in support for `.styl` and `.stylus` files. To use them, you must install the corresponding `stylus` preprocessor dependency. Other usage can refer to the examples above.

```bash
# .styl and .stylus
npm add -D stylus
```

### Scoped

Adding the `scoped` attribute to `<style>` makes its CSS only apply to elements in the current component, and parent component styles will not penetrate into child components. This can avoid global pollution.

```vue

<style scoped>
  .page-content {
    background-color: #fff;
  }
</style>
```

### Deep Selectors

If you want a selector in `scoped` styles to work "deeper", for example, to affect child components, you can use the `>>>` operator. Some preprocessors like `Sass` cannot parse `>>>` correctly. In this case, you can use `/deep/` or `::v-deep` operators instead—both are aliases for `>>>` and work the same way.

Since using `scoped` prevents parent component styles from penetrating into child components, we can solve this using the following methods:

```vue
<!-- Method 1: Using ::v-deep -->
<style scoped>
  ::v-deep(.win-card) {
    background-color: #940000;
  }
</style>

<!-- Method 2: Using >>> operator-->
<style scoped>
  >>> .win-card {
    background-color: #940000;
  }
</style>
<!-- Method 3: Using /deep/ -->
<style scoped>
  /deep/ .win-card {
    background-color: #940000;
  }
</style>
<!-- Method 4: Using :deep(<inner-selector>) -->
<style lang="scss" scoped>
  :deep(.win-card) {
    background-color: #940000;
  }
</style>
```

::: tip Tip

- Methods 1 and 4 both support Sass preprocessors. However, in the Vue 3.0 single-file specification, if you still use method 1, you will encounter the following warning:

```text
[@vue/compiler-sfc] ::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead.
```

- Method 1 has been deprecated in Vue 3.0. When developing Vue 3.0 projects in the future, method 4 is recommended.

- Regarding methods 1 and 3, they mainly don't support Sass preprocessor parsing, and the >>> operator has browser compatibility issues.

:::

## Advanced Settings

If you need to use other style preprocessors besides the common LESS, SASS, or SCSS, you can add the Loaders you need through the [chainWebpack interface](../config/config#chainwebpack) provided by WinJS plugins.

## Using Tailwindcss

WinJS provides a [Tailwindcss](https://tailwindcss.com/) [plugin](https://www.npmjs.com/package/@winner-fed/plugin-tailwindcss), and you can conveniently enable it directly using the [micro-generator](./generator#tailwind-css-configuration-generator).

::: tip Tip
Depending on your needs, you can selectively import CSS styles provided by Tailwind CSS. Please refer to the [`@tailwind` documentation](https://tailwindcss.com/docs/functions-and-directives#tailwind) to learn about the detailed usage of the `@tailwind` directive.
:::

## Using UnoCSS

Like Tailwindcss, WinJS also provides [UnoCSS](https://github.com/unocss/unocss) [plugin](https://www.npmjs.com/package/@winner-fed/plugin-unocss), which can also be enabled using the [micro-generator](./generator#unocss) in the same way.

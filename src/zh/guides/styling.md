# 样式 {#styling}

本文介绍各种在 WinJS 项目中使用样式的方式。

## 全局样式

根据项目长期累积的 `reset.c[le]ss` 作为 CSS 样式重置的一个现代替代方案。

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
  // 非标准属性
  // 当你触摸并按住触摸目标时候，禁止或显示系统默认菜单。在iOS上，当你触摸并按住触摸的目标，比如一个链接，Safari浏览器将显示链接有关的系统默认菜单。这个属性可以让你禁用系统默认菜单。
  -webkit-touch-callout: none;
  // iOS 若设置为 none, 则 input,textarea 输入无法触发 onchange 或者 oninput 事件
  // 会出现输入不了值的问题
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

// --- 项目级别添加
// 防止图像被拉伸或压缩
img {
  object-fit: cover;
}

```

项目中使用的通用样式，都存放于 `src/assets/style/` 目录下。

## 使用 CSS 样式

你可以在 WinJS 项目中使用 `.css` 文件声明各种样式，然后在 `.js` 文件中引入即可生效。

例如，在 `src/pages/index.css` 文件按照以下代码声明 `.title` 类的样式为红色：

```css
.title {
  color: red;
}
```

然后在 `src/pages/index.tsx` 文件中引入即可生效。

```jsx
// src/pages/index.tsx

import './index.css';

export default function () {
  return <div className="title">Hello World</div>;
}
```

按照此种引入方式的样式会在整个 WinJS 项目中生效，即无论你从哪个 `.js`
文件引入，他声明的样式可以在任何页面和组件中使用。如果你想要避免这种情况，可以使用 [CSS Modules](#使用-css-modules)
的功能来限制样式的作用域。

## 使用 CSS Modules

在 `js` 文件中引入样式时，如果赋予他一个变量名，就可以将样式以 CSS Module 的形式引入。

```jsx
// src/pages/index.tsx

import styles from './index.css';

export default function () {
  return <div className={styles.title}>
    Hello World
  </div>;
}
```

上面的示例中，`index.css` 文件中声明的样式不会对全局样式造成影响，只会对从 `styles` 变量中使用的样式生效。

## 使用 CSS 预处理器

WinJS 默认支持 LESS (推荐)，SASS 和 SCSS 样式的导入，你可以直接按照引入 CSS 文件的方式引入并使用这些由 CSS
预处理器处理的样式。同时，提供了一些基于 LESS 积累的 `mixins`
函数库 [magicless](https://github.com/cloud-templates/magicless)。并且，脚手架已经全局注入了常用的**变量和函数**
，故可以在实际的页面开发中直接使用。

::: tip 提示
在 WinJS 中使用 Sass(Scss) 需要额外安装预处理依赖 如: `npm add -D sass`
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

同样也支持 CSS Module 的用法：

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

WinJS 也同时提供了对 `.styl` 和 `.stylus` 文件的内置支持。使用必须安装 `stylus` 相应的预处理器依赖, 其他用法可以参考上面的例子

```bash
# .styl and .stylus
npm add -D stylus
```

### Scoped

为 `<style>` 添加 `scoped` 属性，它的 CSS 只作用于当前组件中的元素，父组件的样式将不会渗透到子组件。可以避免造成全局污染。

```vue

<style scoped>
  .page-content {
    background-color: #fff;
  }
</style>
```

### 深度选择器

如果你希望 `scoped` 样式中的一个选择器能够作用得「更深」，例如影响子组件，你可以使用 `>>>` 操作符。有些像 `Sass`
之类的预处理器无法正确解析 >>>。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

由于使用 `scoped` 后，父组件的样式将不会渗透到子组件中。我们可以使用以下方式解决：

```vue
<!-- 写法1 使用 ::v-deep -->
<style scoped>
  ::v-deep(.win-card) {
    background-color: #940000;
  }
</style>

<!-- 写法2 使用 >>> 操作符-->
<style scoped>
  >>> .win-card {
    background-color: #940000;
  }
</style>
<!-- 写法3 使用 /deep/ -->
<style scoped>
  /deep/ .win-card {
    background-color: #940000;
  }
</style>
<!-- 写法4 使用 :deep(<inner-selector>) -->
<style lang="scss" scoped>
  :deep(.win-card) {
    background-color: #940000;
  }
</style>
```

::: tip 提示

- 写法1和写法4，都支持 Sass 预处理器。但是在 Vue3.0 单文件规范中，如果你还是使用写法1，会碰到如下警告:

```text
[@vue/compiler-sfc] ::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead.
```

- 写法1在 Vue3.0 中已经被弃用了，以后在开发 Vue3.0 项目的时候，推荐使用写法4。

- 关于写法1和写法3，主要是不支持 Sass 预处理器的解析，且 >>> 操作符存在浏览器兼容性问题

:::

## 进阶设置

如果你需要使用除了常见的 LESS, SASS 或 SCSS 以外的其他样式预处理器，你可以透过 WinJS
插件提供的 [chainWebpack 接口](../config/config#chainwebpack)来加入自己需要的 Loader。

## 使用 Tailwindcss

WinJS 提供了 [Tailwindcss](https://tailwindcss.com/)
[插件](https://www.npmjs.com/package/@winner-fed/plugin-tailwindcss))，并且可以直接方便地使用 [微生成器](./generator#tailwind-css-配置生成器) 来启用。

::: tip 提示
根据需求不同，你可以选择性地导入 Tailwind CSS 提供的 CSS 样式。请参考 [`@tailwind` 文档](https://tailwindcss.com/docs/functions-and-directives#tailwind) 来了解 `@tailwind` 指令的详细用法。
:::

## 使用 UnoCSS

与 Tailwindcss 相同，WinJS 也提供了 [UnoCSS](https://github.com/unocss/unocss)
[插件](https://www.npmjs.com/package/@winner-fed/plugin-unocss)，同样也可以使用[微生成器](./generator#unocss)相同方式开启。

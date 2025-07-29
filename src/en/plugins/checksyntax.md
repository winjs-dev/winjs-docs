# 分析构建产物高级语法

用于分析产物的语法兼容性，判断是否存在导致兼容性问题的高级语法。

<p>
  <a href="https://npmjs.com/package/@winner-fed/plugin-check-syntax">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-check-syntax?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-check-syntax?minimal=true"><img src="https://img.shields.io/npm/dm/@winner-fed/plugin-check-syntax.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## 功能特性

- 🔍 检查 ECMAScript 语法兼容性
- 🎯 支持自定义目标浏览器范围
- 📦 支持 Vite、Webpack、Rspack 构建工具
- ⚙️ 灵活的配置选项
- 🚫 支持排除特定文件

## 安装

```bash
npm add @winner-fed/plugin-check-syntax -D
```

## 使用方法

在 `.winrc.ts` 配置文件中添加插件：

```ts
// .winrc.ts
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  // 启用语法检查
  checkSyntax: {
    // 目标浏览器范围
    targets: ['> 1%', 'last 2 versions'],
    
    // 排除文件
    exclude: ['node_modules', '\\.min\\.js$'],
    
    // ECMAScript 版本
    ecmaVersion: 2018
  }
};
```

## 配置选项

### targets

指定项目的目标浏览器范围，值为标准的 browserslist 数组。

- 类型: `string[]`
- 默认值: `undefined`
- 示例:

```js
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: {
    targets: ['> 1%', 'last 2 versions', 'not ie <= 8']
  }
};
```

### exclude

用于在检测期间排除部分源文件。可以传入一个或多个正则表达式来匹配源文件的路径。

- 类型: `string | string[]`
- 默认值: `undefined`
- 示例:

```js
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: {
    exclude: [
      'node_modules',
      '\\.min\\.js$',
      'vendor/'
    ]
  }
};
```

### ecmaVersion

指定构建产物中可以使用的最低 ECMAScript 语法版本。`ecmaVersion` 的优先级高于 `targets`。

- 类型: `3 | 5 | 6 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 'latest'`
- 默认值: `undefined`
- 示例:

```js
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: {
    ecmaVersion: 2018
  }
};
```

## 简单配置

如果你只想启用默认的语法检查，可以直接设置为 `true`：

```ts
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: true
};
```

## 支持的构建工具

- ✅ Vite
- ✅ Webpack
- ✅ Rspack

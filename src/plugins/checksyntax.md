# Analyze Build Output Advanced Syntax

Used to analyze build output syntax compatibility and determine if there are advanced syntax features that may cause compatibility issues.

<p>
  <a href="https://npmjs.com/package/@winner-fed/plugin-check-syntax">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-check-syntax?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-check-syntax?minimal=true"><img src="https://img.shields.io/npm/dm/@winner-fed/plugin-check-syntax.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Features

- 🔍 Check ECMAScript syntax compatibility
- 🎯 Support for custom target browser ranges
- 📦 Support for Vite, Webpack, Rspack build tools
- ⚙️ Flexible configuration options
- 🚫 Support for excluding specific files

## Installation

```bash
npm add @winner-fed/plugin-check-syntax -D
```

## Usage

Add the plugin to your `.winrc.ts` configuration file:

```ts
// .winrc.ts
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  // Enable syntax checking
  checkSyntax: {
    // Target browser range
    targets: ['> 1%', 'last 2 versions'],
    
    // Exclude files
    exclude: ['node_modules', '\\.min\\.js$'],
    
    // ECMAScript version
    ecmaVersion: 2018
  }
};
```

## Configuration Options

### targets

Specify the target browser range for your project as a standard browserslist array.

- Type: `string[]`
- Default: `undefined`
- Example:

```js
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: {
    targets: ['> 1%', 'last 2 versions', 'not ie <= 8']
  }
};
```

### exclude

Used to exclude certain source files during detection. You can pass one or more regular expressions to match source file paths.

- Type: `string | string[]`
- Default: `undefined`
- Example:

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

Specify the minimum ECMAScript syntax version that can be used in build outputs. `ecmaVersion` has higher priority than `targets`.

- Type: `3 | 5 | 6 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 'latest'`
- Default: `undefined`
- Example:

```js
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: {
    ecmaVersion: 2018
  }
};
```

## Simple Configuration

If you just want to enable default syntax checking, you can set it directly to `true`:

```ts
export default {
  plugins: ['@winner-fed/plugin-check-syntax'],
  checkSyntax: true
};
```

## Supported Build Tools

- ✅ Vite
- ✅ Webpack
- ✅ Rspack

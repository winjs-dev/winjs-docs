# Legacy Browser Compatibility {#legacy-browser}

## Default Compatibility Description

WinJS does not support IE by default. The compilation compatibility target `targets` is `chrome: 80`. If you need to adjust this, please specify explicit [targets](../config/config#targets):

```ts
// .winrc.ts

export default {
  targets: { chrome: 67 }
}
```

For more feedback on compatibility issues or to participate in discussions, please visit: [issue / 8656](https://github.com/umijs/umi/issues/8658)

## Compatible with Non-Modern Browsers

If you don't need to support IE but only want to improve your project's compatibility with non-modern browsers, you can adjust the compatibility target [targets](../config/config#targets).

WinJS uses modern build tools by default, generating artifacts to `es6`. If you need to bundle as `es5` artifacts, please adjust the configuration:

```ts
// .winrc.ts
export default {
  jsMinifier: 'terser',
  cssMinifier: 'cssnano'
}
```

## Compatible with Legacy Browsers (IE 11)

Since IE has been deprecated and is no longer mainstream, when you need to support IE, please read the following solutions.

### Framework's Built-in Legacy Mode

WinJS provides a built-in `legacy` configuration for build downgrading (see [legacy](../config/config#legacy) for usage restrictions and details):

```ts
// .winrc.ts

export default {
  legacy: {}
}
```

By default, it only takes effect during build time and will attempt to build artifacts that are IE-compatible.

### More Customization for Legacy Mode

When `legacy` is enabled, all `node_modules` are transpiled by default, which can significantly increase build time in large projects.

If you understand the third-party dependencies used in your current project (knowing which ones no longer provide `es5` artifacts), you can disable `node_modules` transformation and use [`extraBabelIncludes`](../config/config#extrababelincludes) to specifically configure packages that need to be included in the transformation scope.

An example:

```ts
// .winrc.ts

export default {
  legacy: {
    nodeModulesTransform: false
  },
  extraBabelIncludes: [
    'some-es6-pkg',
    /@scope\//
  ]
}
```

### Improving Compatibility Robustness

The `legacy` option cannot 100% guarantee that artifacts will run in deprecated browsers **without edge cases**. You may also need to add **preloaded** full polyfills to enhance your project's [robustness](https://en.wikipedia.org/wiki/Robustness_(computer_science)).

```ts
// .winrc.ts

export default {
  headScripts: [
    'http://polyfill.alicdn.com/v3/polyfill.min.js' // or https://polyfill.io/v3/polyfill.min.js
  ],
  legacy: {}
}
```

Reference approaches include:

| Solution | Description |
|:--|:--|
| CDN Import | Import polyfill js files that are missing in the target browser environment in **script form and preloaded** via CDN, such as [es6-shim](https://github.com/paulmillr/es6-shim). |
| Manual core-js | Use [core-js](https://github.com/zloirock/core-js) tools, such as building your own needed polyfill artifacts through [core-js-builder](https://github.com/zloirock/core-js/tree/master/packages/core-js-builder), then import them into the project as **preloaded script**. |
| Dynamic Polyfill Service | Use services that dynamically deliver required polyfills based on the current browser request UA, such as [polyfill.io (alicdn)](http://polyfill.alicdn.com/v3/polyfill.min.js) or [polyfill.io (CloudFlare)](https://cdnjs.cloudflare.com/polyfill/) services. You can also use [polyfill-service](https://github.com/cdnjs/polyfill-service) to build your own dynamic polyfill delivery service. |

Notes:

1. When you're in an isolated internal/external network development environment, consider transferring all polyfill js content to the internal network, using it on internal CDN, or placing it in the public directory.

2. The significance of using preloaded script imports is to prepare a complete, polyfilled API environment before the project's js resources run.

### Verification in Development Environment

The recommended approach is: after building, start a service locally through [`win preview`](../cli/commands#preview) or [`serve`](https://www.npmjs.com/package/serve), nginx, etc., to verify the feasibility of running artifacts in IE 11.

When you need to verify in the development environment:

1. Set `legacy.buildOnly` to `false`.

2. Since es6 code injected by hmr and other development tools always runs first, you need to add a preloaded polyfill in script form to prepare the environment in advance.

```ts
// .winrc.ts

const isProd = process.env.NODE_ENV === 'production'
export default {
  legacy: {
    buildOnly: false
  },
  headScripts: isProd 
    ? [] 
    : ['http://polyfill.alicdn.com/v3/polyfill.min.js']
}
```

Note: IE 11 cannot fully support hot reloading during development, and cache may need to be manually cleared in the console to see the latest page.

## Extended Knowledge

Before dealing with browser compatibility issues, it's recommended that you understand the following background knowledge to better handle related problems.

### Syntax Downgrading and API Downgrading

When you use high-version syntax and APIs in your project, to make the compiled code run stably in low-version browsers, you need to complete two parts of downgrading: syntax downgrading and API downgrading.

**WinJS downgrades syntax through syntax transpilation and downgrades APIs through polyfills.**

> Syntax and APIs are not strongly bound. When implementing engines, browser vendors will support some syntax early or implement some APIs early according to specifications or their own needs. Therefore, different vendors' browsers from the same period may not have the same compatibility for syntax and APIs. So in general practice, syntax and APIs are handled as two separate parts.

### Syntax Transpilation

**Syntax is a series of rules about how a programming language organizes code**. Code that doesn't follow these rules cannot be correctly recognized by the programming language's engine and therefore cannot be executed. In JavaScript, the following examples are all syntax rules:

- In `const foo = 1`, `const` indicates declaring an immutable constant.
- In `foo?.bar?.baz`, `?.` indicates optional chaining to access properties.
- In `async function () {}`, `async` indicates declaring an asynchronous function.

Since different browsers' parsers support different syntax, especially older browser engines support fewer syntax features, some syntax will cause errors during the AST parsing stage when running in low-version browser engines.

For example, the following code will error in IE browsers or low-version Node.js:

```js
const foo = {};
foo?.bar();
```

Running this code in low-version Node.js will produce the following error message:

```bash
SyntaxError: Unexpected token .
  at Object.exports.runInThisContext (vm.js:73:16)
  at Object.<anonymous> ([eval]-wrapper:6:22)
  at Module._compile (module.js:460:26)
  at evalScript (node.js:431:25)
  at startup (node.js:90:7)
  at node.js:814:3
```

From the error message, you can clearly see this is a syntax error (SyntaxError). This indicates that this syntax is not supported in low-version engines.

**Syntax cannot be supported through polyfills or shims**. If you want to run syntax that's not originally supported in low-version browsers, you need to transpile the code into syntax that low-version engines can support.

Transpiling the above code to the following code allows it to run in low-version engines:

```js
var foo = {};
foo === null || foo === void 0 ? void 0 : foo.bar();
```

After transpilation, the code's syntax changed, replacing syntax that low-version engines cannot understand with syntax they can understand, **but the code's meaning itself hasn't changed**.

If the engine encounters unrecognizable syntax when converting to AST, it will report a syntax error and halt code execution. In this case, if your project doesn't use capabilities like SSR or SSG, the page will directly show a white screen, making the page unusable.

If the code is successfully converted to AST, the engine will convert the AST to executable code and execute it normally within the engine.

### API Polyfill

JavaScript is an interpreted scripting language, different from compiled languages like Rust. Rust checks calls in code during compilation, while JavaScript doesn't know if functions called in a line of code exist until it actually runs that line, so some errors only appear at runtime.

For example, this code:

```js
var str = 'Hello world!';
console.log(str.notExistedMethod());
```

The above code has correct syntax and can be correctly converted to AST in the first stage of engine runtime, but when actually running, since `String.prototype` doesn't have the `notExistedMethod` method, it will error during actual execution:

```bash
Uncaught TypeError: str.notExistedMethod is not a function
  at <anonymous>:2:17
```

As ECMAScript iterates, some built-in objects also get new methods. For example, `String.prototype.replaceAll` was introduced in ES2021, so in most browsers' engines before 2021, the built-in object `String.prototype` doesn't have the `replaceAll` method. Therefore, the following code can run in the latest Chrome but cannot run in earlier versions:

```js
'abc'.replaceAll('abc', 'xyz');
```

To solve the problem of missing `replaceAll` in `String.prototype` in older browsers, we can extend the `String.prototype` object in old browsers and add the `replaceAll` method, for example:

```js
// This polyfill implementation may not conform to standards and is for example only.
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(str).toLowerCase() === '[object regexp]'
    ) {
      return this.replace(str, newStr);
    }
    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);
  };
}
```

> This technique of providing implementations for old environments to align with new APIs is called polyfill.

### Downgrading Methods
In WinJS, we can categorize code into three types:
- The first type is source code in the current project.
- The second type is third-party dependency code installed via npm.
- The third type is code not from the current project, such as code in other directories in a monorepo.

By default, Rsbuild only compiles and downgrades the first type of code, while other types of code are not downgraded by default.

The reasons for this approach include several considerations:

- Downgrading all third-party dependency code would **significantly degrade build performance**.
- Most third-party dependencies have already been downgraded before publishing, and secondary downgrading might introduce new issues.
- Code not from the current project may have already been compiled, or the compilation configuration required may differ from the current project.

#### Downgrading Current Project Code

Current project code is downgraded by default, so you don't need to add extra configuration. Just ensure you've correctly set the browser range.

#### Downgrading Third-party Dependencies

When you find that certain third-party dependency code causes compatibility issues, you can add this dependency to WinJS's [extraBabelIncludes](/config/config/extrababelincludes) configuration to make WinJS perform additional compilation on that dependency.

Taking the `query-string` npm package as an example, you can configure it as follows:

```ts
import path from 'path';

export default {
  extraBabelIncludes: [
    /node_modules[\\/]query-string[\\/]/
  ],
};
```

### Downgrading Non-Current Project Code

When you reference code not from the current project, if that code hasn't been compiled, you also need to configure [extraBabelIncludes](/config/source/extrababelincludes) to compile it.

For example, if you need to reference a module in the `packages` directory of a monorepo, you can add the following configuration:

```ts
import path from 'path';

export default {
  source: {
    include: [
      // Method 1:
      // Compile all files in the Monorepo's package directory
      path.resolve(__dirname, '../../packages'),

      // Method 2:
      // Compile source code of a specific package in the Monorepo's package directory
      // This approach has a more precise matching scope and less impact on overall compilation performance
      path.resolve(__dirname, '../../packages/abc/src'),
    ],
  },
};
```

## Querying Browser Support

During development, we need to understand browser support for certain features or APIs. We can query this on the [caniuse](https://caniuse.com/) website.

For example, if we need to know the browser support for `Promise`, we just need to enter `Promise` in [caniuse](https://caniuse.com/) to see the following results:

![caniuse-promise-example.png](/images/guide/caniuse-promise-example.png)

From the table above, we can see that `Promise` gained native support in Chrome 33 and iOS 8, but is not supported in IE 11.

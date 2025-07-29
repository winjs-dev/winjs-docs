# 非现代浏览器兼容 {#legacy-browser}

## 默认兼容说明

WinJS 默认不支持 IE ，编译兼容目标 `targets` 为 `chrome: 80` ，如需调整，请指定明确的 [targets](../config/config#targets) ：

```ts
// .winrc.ts

export default {
  targets: { chrome: 67 }
}
```

若想反馈更多关于兼容性的问题，或参与讨论，请前往：[issue / 8656](https://github.com/umijs/umi/issues/8658)

## 兼容非现代浏览器

如果你并不需要兼容至 IE ，只为了提升项目对非现代浏览器的兼容性，可调整兼容目标 [targets](../config/config#targets) 。

WinJS 默认使用现代构建工具，产物生成至 `es6` ，如果你有要打包为 `es5` 产物的考量，请调整配置：

```ts
// .winrc.ts
export default {
  jsMinifier: 'terser',
  cssMinifier: 'cssnano'
}
```

## 兼容旧时代浏览器 ( IE 11 ) 

由于 IE 已经淘汰不再主流，当需要兼容至 IE 时，请阅读以下对策。

### 框架自带的 legacy mode

WinJS 自带提供一个 `legacy` 配置用于构建降级（使用限制等详见 [legacy](../config/config#legacy) ）：

```ts
// .winrc.ts

export default {
  legacy: {}
}
```

默认仅在构建时生效，将尝试构建能使 IE 兼容的产物。

### legacy mode 的更多自定义

`legacy` 开启时，默认会转译全部 `node_modules` ，这在大型项目中，会极大的增加构建时间。

若你了解当前项目使用的第三方依赖情况（知道哪些不再提供 `es5` 产物了），可以关闭 `node_modules` 的转换，改为使用 [`extraBabelIncludes`](../config/config#extrababelincludes) 定点配置那些需要额外纳入转换范围的包。

一个例子：

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

### 提高兼容的鲁棒性

`legacy` 选项并不能 100% 保证产物 **没有边界情况** 的运行在被淘汰的浏览器内，你可能还需要添加 **前置的** 全量 polyfill 来增强项目的 [鲁棒性](https://baike.baidu.com/item/%E9%B2%81%E6%A3%92%E6%80%A7/832302) 。

```ts
// .winrc.ts

export default {
  headScripts: [
    'http://polyfill.alicdn.com/v3/polyfill.min.js' // or https://polyfill.io/v3/polyfill.min.js
  ],
  legacy: {}
}
```

参考的思路有：

方案 | 说明                                                                                                                                                                                                                                                                                 
:-|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
CDN 引入 | 以 cdn 形式引入 **script 形式且前置的** 、目标浏览器环境缺少的 polyfill js 文件，如 [es6-shim](https://github.com/paulmillr/es6-shim) 。                                                                                                                                                                      
人工 core-js | 利用 [core-js](https://github.com/zloirock/core-js) 系工具，如通过 [core-js-builder](https://github.com/zloirock/core-js/tree/master/packages/core-js-builder) 构建自己需要的 polyfill 产物，再以 **前置 script 脚本** 形式引入项目。                                                                              
动态 polyfill 服务 | 使用根据当前浏览器请求 UA 动态下发所需 polyfill 的服务，比如 [polyfill.io (alicdn)](http://polyfill.alicdn.com/v3/polyfill.min.js) 或 [polyfill.io (CloudFlare)](https://cdnjs.cloudflare.com/polyfill/) 服务。另外，你还可以使用 [polyfill-service](https://github.com/cdnjs/polyfill-service) 自建相同的动态 polyfill 下发服务。 |

注：

1. 当你处于内外网隔离开发环境时，可以考虑将全部 polyfill 的 js 内容传入内网，在内网的 CDN 使用，或放入 public 目录等方式使用。

2. 使用 script 前置引入的意义在于，在项目 js 资源运行前就准备好一个完整的、被 polyfill 过 api 的环境。

### 在开发环境验证

推荐的做法是：构建后在本地通过 [`win preview`](../cli/commands#preview) 或 [`serve`](https://www.npmjs.com/package/serve) 、nginx 等启动服务，来验证产物的 IE 11 运行可行性。

当你需要在开发环境验证时：

1. 将 `legacy.buildOnly` 置为 `false` 。

2. 由于 hmr 等开发注入的 es6 代码始终在第一位运行，你需要以 script 形式添加一个前置的 polyfill ，提前准备好环境。

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

注：IE 11 并不能完整支持开发时的热更新，且缓存可能需要人为在控制台进行清除后才能看到最新的页面，请做好准备。

## 扩展知识

在处理浏览器兼容性问题之前，建议你了解以下背景知识，以更好地处理相关问题。

### 语法降级和 API 降级

当你在项目中使用高版本语法和 API 时，为了让编译后的代码能稳定运行在低版本浏览器中，需要完成两部分降级：语法降级和 API 降级。

**WinJS 通过语法转译来对语法进行降级，通过 polyfill 来对 API 进行进行降级。**

> 语法和 API 并不是强绑定的，浏览器厂商在实现引擎的时候，会根据规范或者自身需要提前支持一些语法或者提前实现一些 API。因此，同一时期的不同厂商的浏览器，对语法和 API 的兼容都不一定相同。所以在一般的实践中，语法和 API 是分成两个部分进行处理的。

### 语法转译

**语法是编程语言如何组织代码的一系列规则**，不遵守这些规则的代码无法被编程语言的引擎正确识别，因此无法被运行。在 JavaScript 中，以下几个示例都是语法规则：

- 在 `const foo = 1` 中，`const` 表示声明一个不可变的常量。
- 在 `foo?.bar?.baz` 中，`?.` 表示可选链访问属性。
- 在 `async function () {}` 中，`async` 表示声明一个异步函数。

由于不同浏览器的解析器所能支持的语法不同，尤其是旧版本浏览器引擎所能支持的语法较少，因此一些语法在低版本浏览器引擎中运行时，就会在解析 AST 的阶段报错。

比如下面这段代码在 IE 浏览器或低版本 Node.js 下会报错：

```js
const foo = {};
foo?.bar();
```

我们在低版本 Node.js 中运行这段代码，会出现以下错误信息：

```bash
SyntaxError: Unexpected token .
  at Object.exports.runInThisContext (vm.js:73:16)
  at Object.<anonymous> ([eval]-wrapper:6:22)
  at Module._compile (module.js:460:26)
  at evalScript (node.js:431:25)
  at startup (node.js:90:7)
  at node.js:814:3
```

从错误信息里可以明显看到，这是一个语法错误（SyntaxError）。这说明这个语法在低版本的引擎中是不受支持的。

**语法是不能通过 polyfill 或者 shim 进行支持的**。如果想在低版本浏览器中运行一些它原本不支持的语法，那么就需要对代码进行转译，转译成低版本引擎所能支持的语法。

将上述代码转译为以下代码即可在低版本引擎中运行：

```js
var foo = {};
foo === null || foo === void 0 ? void 0 : foo.bar();
```

转译后，代码的语法变了，把一些低版本引擎无法理解的语法用其可理解的语法替代，**但代码本身的意义没有变**。

如果引擎在转换为 AST 的时候遇到了无法识别的语法，就会报语法错误，并中止代码执行流程。在这种情况下，如果你的项目没有使用 SSR 或 SSG 等能力的话，页面将会直接白屏，导致页面不可用。

如果代码被转换为 AST 成功，引擎会将 AST 转为可执行代码，并在引擎内部正常执行。

### API Polyfill

JavaScript 是解释型脚本语言，不同于 Rust 等编译型语言。Rust 会在编译阶段对代码中的调用进行检查，而 JavaScript 在真正运行到某一行代码之前，并不知道这一行代码所调用的函数是否存在，因此一些错误只有在运行时才会出现。

举个例子，下面这段代码：

```js
var str = 'Hello world!';
console.log(str.notExistedMethod());
```

上面这段代码有着正确的语法，在引擎运行时的第一个阶段也能正确转换为 AST，但是在真正运行的时候，由于 `String.prototype` 上不存在 `notExistedMethod` 这个方法，所以在实际运行的时候会报错：

```bash
Uncaught TypeError: str.notExistedMethod is not a function
  at <anonymous>:2:17
```

随着 ECMAScript 的迭代，一些内置对象也会迎来新的方法。比如 `String.prototype.replaceAll` 是在 ES2021 中被引入的，那么在大部分 2021 年前的浏览器的引擎的内置对象 `String.prototype` 中是不存在 `replaceAll` 方法的，因此下面这段代码在最新的 Chrome 里可以运行，但是在较早的版本里无法运行：

```js
'abc'.replaceAll('abc', 'xyz');
```

为了解决在旧版浏览器中的 `String.prototype` 缺少 `replaceAll` 的问题，我们可以在老版本的浏览器里扩展 `String.prototype` 对象，给它加上 `replaceAll` 方法，例如：

```js
// 该 polyfill 的实现并不一定符合标准，仅作为示例。
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

> 这种为旧环境提供实现来对齐新 API 的技术被称作 polyfill。

### 降级方式
在 WinJS 中我们可以将代码分为三类：
- 第一类是当前项目中的源代码。
- 第二类是通过 npm 安装的第三方依赖代码。
- 第三类是非当前项目的代码，比如 monorepo 中其他目录下的代码。

默认情况下，Rsbuild 只会对第一类代码进行编译和降级，而其他类型的代码默认是不进行降级处理的。

之所以这样处理，主要有几个考虑：

- 将所有第三方依赖代码都进行降级的话会**导致构建性能显著下降**。
- 大部分第三方依赖在发布前已经进行了降级处理，二次降级可能会引入新问题。
- 非当前项目的代码可能已经经过了编译处理，或者编译所需的配置与当前项目并不相同。

#### 降级当前项目代码

当前项目的代码会被默认降级，因此你不需要添加额外的配置，只需要保证正确设置了浏览器范围即可。

#### 降级第三方依赖

当你发现某个第三方依赖的代码导致了兼容性问题时，你可以将这个依赖添加到 WinJS 的 [extraBabelIncludes](/config/config/extrababelincludes) 配置中，使 WinJS 对该依赖进行额外的编译。

以 `query-string` 这个 npm 包为例，你可以做如下的配置：

```ts
import path from 'path';

export default {
  extraBabelIncludes: [
    /node_modules[\\/]query-string[\\/]/
  ],
};
```

### 降级非当前项目的代码

当你引用非当前项目的代码时，如果该代码未经过编译处理，那么你也需要配置 [extraBabelIncludes](/config/source/extrababelincludes) 来对它进行编译。

比如，你需要引用 monorepo 中 `packages` 目录下的某个模块，可以添加如下的配置：

```ts
import path from 'path';

export default {
  source: {
    include: [
      // 方法一:
      // 编译 Monorepo 的 package 目录下的所有文件
      path.resolve(__dirname, '../../packages'),

      // 方法二:
      // 编译 Monorepo 的 package 目录里某个包的源代码
      // 这种写法匹配的范围更加精准，对整体编译性能的影响更小
      path.resolve(__dirname, '../../packages/abc/src'),
    ],
  },
};
```

## 查询浏览器支持情况

在开发时，我们需要了解某些特性或 API 的浏览器支持情况，此时我们可以在 [caniuse](https://caniuse.com/) 网站上进行查询。

比如我们需要知道 `Promise` 的浏览器支持情况，只需要在 [caniuse](https://caniuse.com/) 中输入 `Promise`，就可以看到以下结果：

![caniuse-promise-example.png](/images/guide/caniuse-promise-example.png)

从上表可以看出，`Promise` 在 Chrome 33 和 iOS 8 中得到了原生支持，但是在 IE 11 中不被支持。

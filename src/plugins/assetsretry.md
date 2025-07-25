# Assets Retry 插件 {#assetsretry}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-assets-retry?style=flat-square&colorB=646cff)

用于在静态资源加载失败时自动发起重试请求。

## 开启方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-assets-retry -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-assets-retry -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-assets-retry -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-assets-retry -D
```
:::

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-assets-retry'],
  /**
   * @name assetsRetry插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/assetsretry.html
   */
  assetsRetry: {
    // domain list, only resources in the domain list will be retried.
    domain: ['https://www.winner123.cn', 'https://www.winner123.cn/namespace'],
    // maximum retry count for each asset, default is 3
    maxRetryCount: 3,
    // onRetry hook is how you can customize retry logic with, default is x => x
    onRetry(currentUrl) {
      return currentUrl
    },
    // for a given resource (except background-images in css),
    // either onSuccess or onFail will be eventually called to
    // indicate whether the resource has been successfully loaded
    onSuccess(currentUrl) {
      console.log('currentUrl', currentUrl)
    },
    onFail(currentUrl) {
      console.log(currentUrl)
    }
  }
});
```

## 选项

你可以通过选项来配置资源加载失败时的重试逻辑。

- **类型：**

```ts
interface AssetsRetryOptions {
  maxRetryCount: number
  onRetry: RetryFunction
  onSuccess: SuccessFunction
  onFail: FailFunction
  domain: Domain
}

type RetryFunction = (
  currentUrl: string,
  originalUrl: string,
  retryCollector: null | RetryStatistics
) => string | null

interface RetryStatistics {
  retryTimes: number
  succeeded: string[]
  failed: string[]
}

type SuccessFunction = (currentUrl: string) => void
type FailFunction = (currentUrl: string) => void
type Domain = string[] | { [x: string]: string }
```

- **默认值：**

```ts
const defaultOptions = {
  domain: [],
  maxRetryCount: 3,
  onRetry: () => {
  },
  onSuccess: () => {
  },
  onFail: () => {
  },
};
```

### domain

- **类型：** `string[]`
- **默认值：** `[]`

指定资源加载失败时的重试域名列表。在 `domain` 数组中，第一项是当前使用的域名，后面几项为备用域名。当某个域名的资源请求失败时，插件会在数组中找到该域名，并替换为数组的下一个域名。
**数组类型：** 表示从域名列表中循环加载（1 -> 2 -> 3 -> ... -> n -> 1 -> ...），直到加载成功或超过限次
**对象类型：** 如 `{ 'a.cdn': 'b.cdn', 'c.cdn': 'd.cdn' }` 表示在 `a.cdn` 失败的资源应从 `b.cdn` 重试，在 `c.cdn`
失败的资源应从 `d.cdn` 重试。

举个例子：

```js
assetsRetry({
  domain: ['https://cdn1.com', 'https://cdn2.com', 'https://cdn3.com'],
});
```

添加以上配置后，当 `cdn1.com` 域名的资源加载失败时，请求域名会自动降级到 `cdn2.com`。

如果 `cdn2.com` 的资源也请求失败，则会继续请求 `cdn3.com`。

### maxRetryCount

- **类型：** `number`
- **默认值：** `3`

单个资源的最大重试次数。比如：

```js
assetsRetry({
  maxRetryCount: 5,
});
```

### onRetry

- **类型：** `(currentUrl: string, originalUrl: string, retryCollector: null | RetryStatistics) => string | null`

资源重试时的回调函数。

该函数接收 3 个参数：

- `currentUrl`: 即将被选为重试地址的 `URL`
- `originalUrl`: 上一次加载失败的 `URL`
- `retryCollector`: 为当前资源的数据收集对象，如果资源为 CSS 中使用 `url` 引用的图片资源，**该参数为 `null`**
  。当该参数不为 `null` 时，包含 3 个属性：
- `retryTimes`: 表示当前为第 x 次重试（从 1 开始）
- `failed`: 已失败的资源列表（从同一域名加载多次时，可能重复）
- `succeeded`: 已成功的资源列表
  - 该函数的返回值必须为字符串或 `null` 对象。
  - 当返回 `null` 时，表示终止该次重试
  - 当返回字符串（url）时，会尝试从 url 中加载资源。

该函数的返回值必须为字符串或 `null` 对象。
- 当返回 `null` 时，表示终止该次重试
- 当返回字符串（url）时，会尝试从 url 中加载资源。

比如：

```js
assetsRetry({
  onRetry (currentUrl, originalUrl, statistics) {
    console.log(
      `Retry currentUrl ${currentUrl}, originalUrl: ${originalUrl}, statistics: ${statistics}`,
    );
    return currentUrl;
  },
});
```

### onSuccess

- **类型：** `(currentUrl: string) => void`

在域名列表内的资源最终加载成功时执行。

该函数接收 1 个参数：
- `currentUrl`: 资源名，可通过该名称来找到当前资源的数据收集对象

比如：
```js
assetsRetry({
  onSuccess: (currentUrl) => {
    console.log(
      `Retry currentUrl: ${currentUrl}`,
    );
  },
});
```

### onFail

- **类型：** `(currentUrl: string) => void`

在域名列表内的资源最终加载失败时执行。

该函数接收 1 个参数：
- `currentUrl`: 资源名，可通过该名称来找到当前资源的数据收集对象

比如：
```js
assetsRetry({
  onFail: (currentUrl) => {
    console.log(
      `Retry currentUrl: ${currentUrl}`,
    );
  },
});
```

## 工作原理

Assets-Retry 的实现主要分为三部分：

1. 如何自动获取加载失败的静态资源（同步加载的 `<script>`, `<link>`, `<img>`）并重试
2. 如何自动获取加载失败的异步脚本并重试
3. 如何自动获取加载失败的背景图片并重试

### 获取加载失败的静态资源

这部分实现较为简单，监听 `document` 对象的 `error` 事件便能够捕获到静态资源加载失败的错误。当 `event.target` 为需要重试的元素时，重试加载该元素即可。但需要注意以下场景：

```html
<script src="/vendor.js"></script>
<script src="/app.js"></script>
```

在上面的代码中， `app.js` 依赖 `vendor.js` 中的功能，这在使用 webpack 打包的项目中极其常见，如果使用 `document.createElement('script')` 来对其进行重试，在网络环境不确定的情况下，`app.js` 很有可能比 `vendor.js` 先加载完毕，导致页面报错不可用。

所以对于在 `html` 中同步加载的 `script` 标签，在页面还未加载完毕时，需要使用 `document.write`，阻塞式地将 `script` 标签动态添加到 `html` 中。

## 参考
- 底层依赖：[assets-retry](https://github.com/Nikaple/assets-retry)

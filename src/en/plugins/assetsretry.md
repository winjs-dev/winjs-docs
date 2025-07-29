# Assets Retry Plugin {#assetsretry}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-assets-retry?style=flat-square&colorB=646cff)

Automatically retry requests when static asset loading fails.

## Setup

1. Install the plugin

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

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-assets-retry'],
  /**
   * @name assetsRetry plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/assetsretry.html
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

## Options

You can configure the retry logic when resource loading fails through options.

- **Type:**

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

- **Default:**

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

- **Type:** `string[]`
- **Default:** `[]`

Specify the retry domain list when resource loading fails. In the `domain` array, the first item is the currently used domain, and the following items are backup domains. When a resource request from a certain domain fails, the plugin will find that domain in the array and replace it with the next domain in the array.
**Array type:** Indicates cyclic loading from the domain list (1 -> 2 -> 3 -> ... -> n -> 1 -> ...), until loading succeeds or exceeds the limit.
**Object type:** For example, `{ 'a.cdn': 'b.cdn', 'c.cdn': 'd.cdn' }` means that resources that fail on `a.cdn` should retry from `b.cdn`, and resources that fail on `c.cdn` should retry from `d.cdn`.

Example:

```js
assetsRetry({
  domain: ['https://cdn1.com', 'https://cdn2.com', 'https://cdn3.com'],
});
```

After adding the above configuration, when resources from the `cdn1.com` domain fail to load, the request domain will automatically downgrade to `cdn2.com`.

If resources from `cdn2.com` also fail to load, it will continue to request from `cdn3.com`.

### maxRetryCount

- **Type:** `number`
- **Default:** `3`

Maximum retry count for a single resource. For example:

```js
assetsRetry({
  maxRetryCount: 5,
});
```

### onRetry

- **Type:** `(currentUrl: string, originalUrl: string, retryCollector: null | RetryStatistics) => string | null`

Callback function when retrying resources.

This function receives 3 parameters:

- `currentUrl`: The `URL` that will be selected as the retry address
- `originalUrl`: The `URL` that failed to load last time
- `retryCollector`: Data collection object for the current resource. If the resource is an image referenced with `url` in CSS, **this parameter is `null`**. When this parameter is not `null`, it contains 3 properties:
- `retryTimes`: Indicates the current retry count (starting from 1)
- `failed`: List of failed resources (may be duplicated when loading multiple times from the same domain)
- `succeeded`: List of successful resources
  - The return value of this function must be a string or `null` object.
  - When returning `null`, it indicates terminating this retry
  - When returning a string (url), it will attempt to load the resource from the url.

The return value of this function must be a string or `null` object.
- When returning `null`, it indicates terminating this retry
- When returning a string (url), it will attempt to load the resource from the url.

For example:

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

- **Type:** `(currentUrl: string) => void`

Executed when resources in the domain list are finally loaded successfully.

This function receives 1 parameter:
- `currentUrl`: Resource name, through which you can find the data collection object of the current resource

For example:
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

- **Type:** `(currentUrl: string) => void`

Executed when resources in the domain list finally fail to load.

This function receives 1 parameter:
- `currentUrl`: Resource name, through which you can find the data collection object of the current resource

For example:
```js
assetsRetry({
  onFail: (currentUrl) => {
    console.log(
      `Retry currentUrl: ${currentUrl}`,
    );
  },
});
```

## How It Works

The implementation of Assets-Retry is mainly divided into three parts:

1. How to automatically capture failed static resources (synchronously loaded `<script>`, `<link>`, `<img>`) and retry them
2. How to automatically capture failed asynchronous scripts and retry them
3. How to automatically capture failed background images and retry them

### Capturing Failed Static Resources

This part is relatively simple to implement. By listening to the `error` event of the `document` object, you can capture errors when static resources fail to load. When `event.target` is an element that needs to be retried, just retry loading that element. However, you need to pay attention to the following scenario:

```html
<script src="/vendor.js"></script>
<script src="/app.js"></script>
```

In the above code, `app.js` depends on functionality in `vendor.js`, which is extremely common in projects using webpack bundling. If you use `document.createElement('script')` to retry them, in uncertain network conditions, `app.js` is very likely to finish loading before `vendor.js`, causing page errors and making it unusable.

Therefore, for `script` tags that are synchronously loaded in `html`, when the page has not finished loading, you need to use `document.write` to dynamically add `script` tags to the `html` in a blocking manner.

## Reference
- Underlying dependency: [assets-retry](https://github.com/Nikaple/assets-retry)

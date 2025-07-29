# HTTP Request {#request}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-request?style=flat-square&colorB=646cff)

`WinJS` provides a built-in plugin solution. Based on [axios](https://axios-http.com/)
and [VueHookPlus](https://inhiblab-core.gitee.io/docs/hooks/useRequest/)'s `useRequest`, it offers a unified network request and error handling solution.

::: warning Note
`useRequest` is only compatible with Vue 3.
:::

```js
import { request, useRequest } from 'winjs';

request;
useRequest;
```

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-request -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-request -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-request -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-request -D
```
:::

2. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-request'],
  /**
   * @name Request Plugin
   * @description Request plugin based on axios
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/request.html
   */
  request: {},
});
```

## Configuration

### Build-time Configuration

```js
export default {
  request: {
    dataField: 'data'
  },
};
```

Build-time configuration allows you to configure the `dataField` for useRequest, with a default value of `data`. The main purpose of this configuration is to facilitate direct data consumption by useRequest. If you want to access the raw backend data when consuming data, you need to configure `dataField` as `''` here.

For example, if your backend returns data in the following format:

```json
{
  success: true,
  data: 123,
  code: 1
}
```

Then useRequest can directly consume `data`, with a value of 123, instead of `{ success, data, code }`.

### Runtime Configuration

In `src/app.ts`, you can configure the request item to set unified and personalized request settings for your project.

```ts
import type { RequestConfig } from 'winjs';

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler() {
    },
    errorThrower() {
    }
  },
  requestInterceptors: [],
  responseInterceptors: []
};
```

All configurations except `errorConfig`, `requestInterceptors`, and `responseInterceptors` are directly passed through to [axios](https://axios-http.com/docs/req_config) request configuration. **Rules configured here will apply to all** `request` **and** `useRequest` **methods**.

Below we'll introduce the runtime configuration options for `plugin-request`. At the end of this section, we'll provide a complete runtime configuration example and describe its functionality in detail.

#### errorConfig

If you want to set a unified error handling solution for your requests, you can configure it here.

The `errorThrower` receives data returned by your backend and needs to throw a custom error. You can process the backend data here as needed.

Our `request` will catch the error thrown by `errorThrower` and execute your `errorHandler` method, which receives two parameters: the first parameter is the caught error, and the second parameter is the request opts.

The `errorHandler` and `errorThrower` here need to be used together. There's a complete example at the end of the documentation.

If you find this approach to error handling too cumbersome, you can implement your own error handling directly in interceptors.

::: tip Note
`errorThrower` is implemented using `responseInterceptors`, and its trigger condition is: when `data.success` is `false`.
:::

#### requestInterceptors

Adds request-phase interceptors to the request method.

Pass in an array where each element is an interceptor. They will be registered sequentially on the axios instance in order. The interceptor syntax is consistent with axios request interceptors - it needs to receive the request config as a parameter and return it.

We recommend using `RequestConfig`, which helps you write your interceptors in a standardized way.

e.g.

```ts
const request: RequestConfig = {
  requestInterceptors: [
    // Write a function directly as an interceptor
    (url, options) => {
      // do something
      return { url, options }
    },
    // A tuple, first element is the request interceptor, second element is error handling
    [(url, options) => {
      return { url, options }
    }, (error) => {
      return Promise.reject(error)
    }],
    // Array, omitting error handling
    [(url, options) => {
      return { url, options }
    }]
  ]

}
```

#### responseInterceptors

Adds response-phase interceptors to the request method.

Pass in an array where each element is an interceptor. They will be registered sequentially on the axios instance in order. The interceptor syntax is consistent with axios response interceptors. It receives axios response as a parameter and returns it.

We recommend using `RequestConfig`, which helps you write your interceptors in a standardized way.

e.g.

```ts
const request: RequestConfig = {
  responseInterceptors: [
    // Write a function directly as an interceptor
    (response) => {
      // No need for async processing to read response body content, can be read directly from data, some fields can be found in config
      const { data = {} as any, config } = response;
      // do something
      return response
    },
    // A tuple, first element is the request interceptor, second element is error handling
    [(response) => {
      return response
    }, (error) => {
      return Promise.reject(error)
    }],
    // Array, omitting error handling
    [(response) => {
      return response
    }]
  ]

}
```

::: warning Note
We will register interceptors sequentially according to your array order, but their execution order follows axios: for requests, later additions execute first; for responses, later additions execute last.
:::

## API

### request

Through `import { request } from '@@/plugin-request'` you can use the built-in request method.

The `options` that `request` receives, in addition to passing through all [axios](https://axios-http.com/docs/req_config) config, we've also added several additional properties: `skipErrorHandler`, `getResponse`, `requestInterceptors`, and `responseInterceptors`.

Example:

```typescript
request('/api/user', {
  params: { name: 1 },
  timeout: 2000,
  // other axios options
  skipErrorHandler: true,
  getResponse: false,
  requestInterceptors: [],
  responseInterceptors: [],
}
```

When you want a specific request to skip error handling, you can set `skipErrorHandler` to `true`.

By default, request returns your backend data. If you want to get the complete axios response structure, you can pass `{ getResponse: true }`.

The syntax for `requestInterceptors` and `responseInterceptors` is the same as the interceptor syntax in runtime configuration. They register interceptors for the request. The difference is that interceptors registered here are "one-time". Additionally, interceptors written here will be registered after those in runtime configuration.
   
::: warning Note
When you use errorHandler, response interceptors registered here will be ineffective because errors will be thrown in errorHandler.
:::

### RequestConfig

This is an interface definition that can help you better configure runtime settings.

```typescript
import type { RequestConfig } from 'winjs';

export const request: RequestConfig = {};
```

Note that you should add `type` when importing.

### useRequest

The plugin has built-in [VueHooks/useRequest](https://inhiblab-core.gitee.io/docs/hooks/useRequest/). You can use this Hook within components to consume data simply and conveniently. Example:

```typescript
import { useRequest } from 'winjs';

export default function Page() {
  const { data, error, loading } = useRequest(() => {
    return services.getUserList('/api/test');
  });
  if (loading) {
    return <div>loading
  ...
    </div>;
  }
  if (error) {
    return <div>{ error.message } < /div>;
  }
  return <div>{ data.name } < /div>;
};
```

In the code above, `data` is not the data returned by your backend, but the internal `data` (because the build-time configuration default is 'data').

## Runtime Configuration Example

Here's a complete runtime configuration example to help you better set up personalized request solutions for your project.

```ts
import { RequestConfig } from './request';

// Error handling solution: error types
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// Response data format agreed upon with backend
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// Runtime configuration
export const request: RequestConfig = {
  // Unified request settings
  timeout: 1000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // Error handling
  errorConfig: {
    // Error throwing
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // Throw custom error
      }
    },
    // Error receiving and handling
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // Errors thrown by our errorThrower
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warn(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios errors
        // Request was made and server responded with a status code outside the 2xx range
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        // `error.request` is an instance of XMLHttpRequest in the browser,
        // and an instance of http.ClientRequest in node.js
        message.error('None response! Please retry.');
      } else {
        // Something happened in setting up the request
        message.error('Request error, please retry.');
      }
    },

  },

  // Request interceptors
  requestInterceptors: [
    (config) => {
      // Intercept request configuration for personalized processing
      const url = config.url.concat('?token = 123');
      return { ...config, url };
    }
  ],

  // Response interceptors
  responseInterceptors: [
    (response) => {
      // Intercept response data for personalized processing
      const { data } = response;
      if (!data.success) {
        message.error('Request failed!');
      }
      return response;
    }
  ]
};
```

You can also implement your own error handling by writing response interceptors, **not necessarily limited to errorConfig**.

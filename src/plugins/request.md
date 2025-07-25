# HTTP 请求 {#request}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-request?style=flat-square&colorB=646cff)

`WinJS` 内置了插件方案。它基于 [axios](https://axios-http.com/)
和 [VueHookPlus](https://inhiblab-core.gitee.io/docs/hooks/useRequest/) 的 `useRequest` 提供了一套统一的网络请求和错误处理方案。

::: warning 注意
`useRequest` 只适用于 Vue3。
:::

```js
import { request, useRequest } from 'winjs';

request;
useRequest;
```

## 开启方式

1. 安装插件

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

2. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-request'],
  /**
   * @name 请求插件
   * @description 基于 axios 的请求插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/request.html
   */
  request: {},
});
```

## 配置

### 构建时配置

```js
export default {
  request: {
    dataField: 'data'
  },
};
```

构建时配置可以为 useRequest 配置 `dataField` ，该配置的默认值是 `data`。该配置的主要目的是方便 useRequest
直接消费数据。如果你想要在消费数据时拿到后端的原始数据，需要在这里配置 `dataField` 为 `''` 。

比如你的后端返回的数据格式如下。

```json
{
  success: true,
  data: 123,
  code: 1
}
```

那么 useRequest 就可以直接消费 `data`。其值为 123，而不是 `{ success, data, code }` 。

### 运行时配置

在 `src/app.ts` 中你可以通过配置 request 项，来为你的项目进行统一的个性化的请求设定。

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

除了 `errorConfig`, `requestInterceptors`, `responseInterceptors`
以外其它配置都直接透传 [axios](https://axios-http.com/docs/req_config) 的 request 配置。**在这里配置的规则将应用于所有的
** `request` 和 `useRequest` **方法**。

下面分别介绍 `plugin-request` 的运行时配置项。本节的末尾，我们会给出一个完整的运行时配置示例，并且对它的功能进行一个详细的描述。

#### errorConfig

如果你想要为自己的请求设定统一的错误处理方案，可以在这里进行配置。

其中 `errorThrower` 接收你后端返回的数据并且需要抛出一个你自己设定的 error， 你可以在这里根据后端的数据进行一定的处理。

我们的 `request` 会 catch `errorThrower` 抛出的错误，并且执行你的 `errorHandler` 方法，该方法接收两个参数，第一个参数是
catch 到的 error，第二个参数则是 request 的 opts。

这里面的 `errorHandler` 和 `errorThrower` 需要配套使用。文档的末尾有一个完整的例子。

如果你觉得这种方式进行错误处理过于繁琐，可以直接在拦截器中实现自己的错误处理。

::: tip 说明
`errorThrower` 是利用 `responseInterceptors` 实现的，它的触发条件是: 当 `data.success` 为 `false` 时。
:::

#### requestInterceptors

为 request 方法添加请求阶段的拦截器。

传入一个数组，每个元素都是一个拦截器，它们会被按顺序依次注册到 axios 实例上。拦截器的写法同 axios request interceptor
一致，它需要接收 request config 作为参数，并且将它返回。

我们建议你使用 `RequestConfig`，它能帮助你规范地书写你的拦截器。

e.g.

```ts
const request: RequestConfig = {
  requestInterceptors: [
    // 直接写一个 function，作为拦截器
    (url, options) => {
      // do something
      return { url, options }
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [(url, options) => {
      return { url, options }
    }, (error) => {
      return Promise.reject(error)
    }],
    // 数组，省略错误处理
    [(url, options) => {
      return { url, options }
    }]
  ]

}
```

#### responseInterceptors

为 request 方法添加响应阶段的拦截器。

传入一个数组，每个元素都是一个拦截器，它们会被按顺序依次注册到 axios 实例上。拦截器的写法同 axios response interceptor一致。接收
axios 的 response 作为参数，并且将它返回。

我们建议你使用 `RequestConfig`，它能帮助你规范地书写你的拦截器。

e.g.

```ts
const request: RequestConfig = {
  responseInterceptors: [
    // 直接写一个 function，作为拦截器
    (response) => {
      // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
      const { data = {} as any, config } = response;
      // do something
      return response
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [(response) => {
      return response
    }, (error) => {
      return Promise.reject(error)
    }],
    // 数组，省略错误处理
    [(response) => {
      return response
    }]
  ]

}
```

::: warning 注意
我们会按照你的数组顺序依次注册拦截器，但是其执行顺序参考 axios，request 是后添加的在前，response 是后添加的在后。
:::

## API

### request

通过 `import { request } from '@@/plugin-request'` 你可以使用内置的请求方法。

`request` 接收的 `options`除了透传 [axios](https://axios-http.com/docs/req_config) 的所有 config
之外，我们还额外添加了几个属性 `skipErrorHandler`，`getResponse`，`requestInterceptors` 和 `responseInterceptors` 。

示例如下：

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

当你的某个请求想要跳过错误处理时，可以通过将`skipErrorHandler`设为 `true` 来实现

request 默认返回的是你后端的数据，如果你想要拿到 axios 完整的 response 结构，可以通过传入 `{ getResponse: true }` 来实现。

`requestInterceptors` 和 `responseInterceptors` 的写法同运行时配置中的拦截器写法相同，它们为 request
注册拦截器。区别在于这里注册的拦截器是 "一次性" 的。另外，这里写的拦截器会在运行时配置中的拦截器之后被注册。
   
::: warning 注意
 当你使用了 errorHandler 时，在这里注册的 response 拦截器会失效，因为在 errorHandler 就会 throw error
:::

### RequestConfig

这是一个接口的定义，可以帮助你更好地配置运行时配置。

```typescript
import type { RequestConfig } from 'winjs';

export const request: RequestConfig = {};
```

注意，在导入时要加 `type`。

### useRequest

插件内置了 [VueHooks/useRequest](https://inhiblab-core.gitee.io/docs/hooks/useRequest/) ，你可以在组件内通过该 Hook
简单便捷的消费数据。示例如下：

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

上面代码中 data 并不是你后端返回的数据，而是其内部的 data，（因为构建时配置默认是 'data')

## 运行时配置示例

这里给出一个完整的运行时配置示例，以帮助你能够更好的去为自己的项目设定个性化的请求方案。

```ts
import { RequestConfig } from './request';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// 运行时配置
export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 1000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
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
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },

  },

  // 请求拦截器
  requestInterceptors: [
    (config) => {
      // 拦截请求配置，进行个性化处理。
      const url = config.url.concat('?token = 123');
      return { ...config, url };
    }
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if (!data.success) {
        message.error('请求失败！');
      }
      return response;
    }
  ]
};
```

你也可以通过写响应拦截器的方式来进行自己的错误处理，**不一定局限于 errorConfig**。

## 示例 demo

更多详见 demo

- [with-request](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/-/tree/dev/examples/with-request)

# 数据请求 {#data-request}

我们需要使用更为优雅的方式，来处理 HTTP 相关的请求。使其能够支持链式调用，同时对返回数据统一处理，精简返回内容，使得在获取到最终结果处，可以尽可能简单和优雅。

## 接口请求封装

推荐使用 `src/services/request.js` 发送服务端接口的相关请求。`request.js` 是基于 [request](../plugins/request.md) 的封装，便于统一处理 POST，GET 等请求参数，请求头，以及错误提示信息等。具体可以参看 request.js。它封装了全局 request 拦截器、response 拦截器、统一的错误处理、baseURL 设置等。

### 接口定义

- 所有的接口名应定义在 `src/services/RESTFULURL.js` 文件里。可以使用**数据服务层的解决方案** [Nemo](https://www.npmjs.com/package/@winner-fed/nemo-engine)，自动化生成请求的代码。

### 接口配置地址

默认基础的请求地址在配置文件 `.winrc` 的 [`appConfig`](../config/config.html#appconfig) 属性里，字段名为 `API_HOME`。当然也可以根据不同的服务接口地址进行拓展字段，比如下面的 `API_UPLOAD`： 

```javascript
// .winrc.ts
export default {
  appConfig: {
    // 本地调试环境
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    // 测试环境
    test: {
      API_HOME: 'https://test.github.com/',
      API_UPLOAD: 'https://test.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: true
    },
    // 生产环境
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      // vconsole 开关
      IS_OPEN_VCONSOLE: false
    }
  }
}
```

### 请求拦截
```javascript
/**
 * requestInstance 实例全局请求扩展配置
 * 添加一个请求拦截器 
 */
export const httpRequest = {
  success: (config) => {
    // 以下代码，鉴权token,可根据具体业务增删。
    // demo示例:
    if (config['url'].indexOf('operatorQry') !== -1) {
      config.headers['accessToken'] = 'de4738c67e1bb450be71b660f0716aa4675860cec1ff9bc23d800efb40519cf3';
    }
    return config;
  },
  error: (error) => Promise.reject(error)
};

```

### 响应拦截

```javascript
/**
 * requestInstance 实例全局请求响应处理
 * 添加一个返回拦截器 （于transformResponse之后处理）
 * 返回的数据类型默认是json，若是其他类型（text）就会出现问题，因此用try,catch捕获异常
 */
export const httpResponse = {
  success: (response) => {
    responseLog(response);
    return checkStatus(response);
  },
  error: (error) => {
    const { response, code } = error;
    // 接口请求异常统一处理
    if (code === 'ECONNABORTED') {
      // Timeout error
      console.log('Timeout error', code);
    }
    if (response) {
      // 请求已发出，但是不在2xx的范围
      // 对返回的错误进行一些处理
      return Promise.reject(checkStatus(response));
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      console.log('断网了~');
    }
  }
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

function responseLog(response) {
  if (process.env.NODE_ENV === 'development') {
    const randomColor = `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(
      Math.random() * 255
    )})`;
    console.log('%c┍------------------------------------------------------------------┑', `color:${randomColor};`);
    console.log('| 请求地址：', response.config.url);
    console.log('| 请求参数：', Qs.parse(response.config.data));
    console.log('| 返回数据：', response.data);
    console.log('%c┕------------------------------------------------------------------┙', `color:${randomColor};`);
  } else {
    console.log('| 请求地址：', response.config.url);
    console.log('| 请求参数：', Qs.parse(response.config.data));
    console.log('| 返回数据：', response.data);
  }
}

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response) {
    const { status, statusText } = response;
    if ((status >= 200 && status < 300) || status === 304) {
      // 如果不需要除了data之外的数据，可以直接 return response.data
      return response.data;
    }
    return {
      status,
      msg: codeMessage[status] || statusText
    };
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  };
}

```
 
### 主体函数实现

```js


/**
 * 基于 request 请求
 * @param url
 * @param method
 * @param timeout
 * @param prefix 用来拼接url地址
 * @param data
 * @param headers
 * @param dataType
 * @returns {Promise.<T>}
 */
export default function (
  url,
  { method = 'post', timeout = TIMEOUT, prefix = '', data = {}, headers = {}, dataType = 'json' }
) {
  const baseURL = autoMatchBaseUrl(prefix);

  const formatHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    ...headers
  };

  const defaultConfig = {
    baseURL,
    url: formatURL(url, data),
    method,
    params: data,
    data,
    timeout,
    headers: formatHeaders,
    responseType: dataType
  };

  if (method.toLowerCase() === 'get') {
    // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
    defaultConfig.params = Object.assign(defaultConfig.params || {}, { _t: new Date().getTime() });
  }

  return request(defaultConfig.url, defaultConfig);
}

```

最后在 `src/app.t[j]s` 文件里添加以下代码即可。

```js
import { TIMEOUT } from '@/constant';
import { RequestConfig } from 'winjs';
import { httpRequest, httpResponse } from './services/request';

export const request: RequestConfig = {
  timeout: TIMEOUT,
  requestInterceptors: [
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (config) => {
        console.log('requestInterceptors 1', config);
        return httpRequest.success(config);
      },
      (error) => {
        console.log('error', error);
        return httpRequest.error(error);
      },
    ],
  ],
  responseInterceptors: [
    [
      (response) => {
        console.log('responseInterceptors 1', response);
        return httpResponse.success(response);
      },
      (error) => {
        console.log('responseInterceptors 2', error);
        return httpResponse.error(error);
      },
    ],
  ],
};
```

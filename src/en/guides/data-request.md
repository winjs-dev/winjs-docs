# Data Requests {#data-request}

We need to use a more elegant approach to handle HTTP-related requests. This should support chaining calls, unified processing of returned data, and streamlined return content, making it as simple and elegant as possible when obtaining final results.

## API Request Encapsulation

We recommend using `src/services/request.js` to send server API requests. `request.js` is an encapsulation based on [request](../plugins/request.md), facilitating unified handling of POST, GET, and other request parameters, request headers, and error messages. You can refer to request.js for specifics. It encapsulates global request interceptors, response interceptors, unified error handling, baseURL settings, etc.

### API Definition

- All API names should be defined in the `src/services/RESTFULURL.js` file. You can use the **data service layer solution** [Nemo](https://www.npmjs.com/package/@winner-fed/nemo-engine) to automatically generate request code.

### API Configuration Address

The default base request address is in the [`appConfig`](../config/config.html#appconfig) property of the configuration file `.winrc`, with the field name `API_HOME`. You can also extend fields based on different service API addresses, such as `API_UPLOAD` below: 

```javascript
// .winrc.ts
export default {
  appConfig: {
    // Local development environment
    development: {
      API_HOME: 'https://api.github.com/',
      API_UPLOAD: 'https://api.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: true
    },
    // Test environment
    test: {
      API_HOME: 'https://test.github.com/',
      API_UPLOAD: 'https://test.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: true
    },
    // Production environment
    production: {
      API_HOME: 'https://production.github.com/',
      API_UPLOAD: 'https://production.github.com/upload',
      // vconsole switch
      IS_OPEN_VCONSOLE: false
    }
  }
}
```

### Request Interceptor
```javascript
/**
 * requestInstance global request extension configuration
 * Add a request interceptor
 */
export const httpRequest = {
  success: (config) => {
    // The following code handles authentication tokens, can be modified based on specific business needs.
    // Demo example:
    if (config['url'].indexOf('operatorQry') !== -1) {
      config.headers['accessToken'] = 'de4738c67e1bb450be71b660f0716aa4675860cec1ff9bc23d800efb40519cf3';
    }
    return config;
  },
  error: (error) => Promise.reject(error)
};

```

### Response Interceptor

```javascript
/**
 * requestInstance global request response handling
 * Add a response interceptor (processed after transformResponse)
 * The returned data type is json by default, if it's other types (text) there will be problems, so use try,catch to capture exceptions
 */
export const httpResponse = {
  success: (response) => {
    responseLog(response);
    return checkStatus(response);
  },
  error: (error) => {
    const { response, code } = error;
    // Unified handling of API request exceptions
    if (code === 'ECONNABORTED') {
      // Timeout error
      console.log('Timeout error', code);
    }
    if (response) {
      // Request has been sent, but not in the 2xx range
      // Handle returned errors
      return Promise.reject(checkStatus(response));
    } else {
      // Handle network disconnection
      // eg: When request timeout or network disconnection, update state's network status
      // network status controls the display/hide of a global network disconnection prompt component in app.vue
      // About refreshing and re-fetching data in the disconnection component, will be explained in the disconnection component
      console.log('Network disconnected~');
    }
  }
};

const codeMessage = {
  200: 'Server successfully returned requested data.',
  201: 'New or modified data successfully.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Data deleted successfully.',
  400: 'There was an error in the request sent, and the server did not create or modify data.',
  401: 'User has no permission (token, username, password error).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The request sent is for a record that does not exist, and the server did not operate.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be available again.',
  422: 'When creating an object, a validation error occurred.',
  500: 'Server error, please check the server.',
  502: 'Gateway error.',
  503: 'Service unavailable, server temporarily overloaded or under maintenance.',
  504: 'Gateway timeout.'
};

function responseLog(response) {
  if (process.env.NODE_ENV === 'development') {
    const randomColor = `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(
      Math.random() * 255
    )})`;
    console.log('%c┍------------------------------------------------------------------┑', `color:${randomColor};`);
    console.log('| Request URL：', response.config.url);
    console.log('| Request Parameters：', Qs.parse(response.config.data));
    console.log('| Response Data：', response.data);
    console.log('%c┕------------------------------------------------------------------┙', `color:${randomColor};`);
  } else {
    console.log('| Request URL：', response.config.url);
    console.log('| Request Parameters：', Qs.parse(response.config.data));
    console.log('| Response Data：', response.data);
  }
}

function checkStatus(response) {
  // If http status code is normal, return data directly
  if (response) {
    const { status, statusText } = response;
    if ((status >= 200 && status < 300) || status === 304) {
      // If you don't need data other than data, you can directly return response.data
      return response.data;
    }
    return {
      status,
      msg: codeMessage[status] || statusText
    };
  }
  // In abnormal state, return error information
  return {
    status: -404,
    msg: 'Network error'
  };
}

```
 
### Main Function Implementation

```js


/**
 * Based on request
 * @param url
 * @param method
 * @param timeout
 * @param prefix Used to concatenate url address
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
    // Add timestamp parameter to get requests to avoid getting data from cache.
    defaultConfig.params = Object.assign(defaultConfig.params || {}, { _t: new Date().getTime() });
  }

  return request(defaultConfig.url, defaultConfig);
}

```

Finally, add the following code to the `src/app.t[j]s` file.

```js
import { TIMEOUT } from '@/constant';
import { RequestConfig } from 'winjs';
import { httpRequest, httpResponse } from './services/request';

export const request: RequestConfig = {
  timeout: TIMEOUT,
  requestInterceptors: [
    // A tuple, the first element is the request interceptor, the second element is error handling
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

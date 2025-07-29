# Mock {#mock}

WinJS 提供了开箱即用的 Mock 功能，能够用方便简单的方式来完成 Mock 数据的设置。

::: tip 说明
什么是 Mock 数据：在前后端约定好 API 接口以后，前端可以使用 Mock 数据来在本地模拟出 API 应该要返回的数据，这样一来前后端开发就可以同时进行，不会因为后端 API
还在开发而导致前端的工作被阻塞。
:::

一个标准的 mock 由三部分组成，以 List 配置为例。

```tsx
export default {
  'GET /api/rule': [{ name: '12' }],
  'POST /api/rule': (req: Request, res: Response, u: string) => {
    res.send({
      success: true,
    });
  },
};
```

第一部分是 网络请求的 Method 配置，完整的列表可以看[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)。一般我们都会使用 GET 和 POST。

第二部分是 URL 也就是我们发起网络请求的地址。一般我们会使用统一的前缀方便代理的使用。

第三部分是 数据处理，我们可以配置一个 JSON，JSON 数据会直接返回。或者是配置一个 function，function 有三个参数 [req](https://expressjs.com/en/4x/api.html#req)，[res](https://expressjs.com/en/4x/api.html#res)，url 。具体使用方式与 [express](https://expressjs.com/) 相同。数据必须要通过 `res.send` 来返回。

## 目录约定

WinJS 约定 `/mock` 目录下的所有文件为 [Mock 文件](#mock-文件)，例如这样的目录结构：

```text
.
├── mock
    ├── todos.ts
    ├── items.ts
    └── users.ts
└── src
    └── pages
        └── index.tsx
```

则 `/mock` 目录中的 `todos.ts`, `items.ts` 和 `users.ts` 就会被 WinJS 视为 [Mock 文件](#mock-文件) 来处理。

## Mock 文件

Mock 文件默认导出一个对象，而对象的每个 Key 对应了一个 Mock 接口，值则是这个接口所对应的返回数据，例如这样的 Mock 文件：

```ts
// ./mock/users.ts

export default {

  // 返回值可以是数组形式
  'GET /api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' }
  ],

  // 返回值也可以是对象形式
  'GET /api/users/1': { id: 1, name: 'foo' },

}
```

就声明了两个 Mock 接口，透过 `GET /api/users` 可以拿到一个带有两个用户数据的数组，透过 `GET /api/users/1` 可以拿到某个用户的模拟数据。

### 请求方法

当 Http 的请求方法是 GET 时，可以省略方法部分，只需要路径即可，例如：

```ts
// ./mock/users.ts

export default {

  '/api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' }
  ],

  '/api/users/1': { id: 1, name: 'foo' },

}
```

也可以用不同的请求方法，例如 `POST`，`PUT`，`DELETE`：

```ts
// ./mock/users.ts

export default {

  'POST /api/users': { result: 'true' },

  'PUT /api/users/1': { id: 1, name: 'new-foo' },

}
```

### 自定义函数

除了直接静态声明返回值，也可以用函数的方式来声明如何计算返回值，例如：

```ts
export default {

  'POST /api/users/create': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  }

}
```

关于 `req` 和 `res` 的 API 可参考 [Express@4 官方文档](https://expressjs.com/en/api.html) 来进一步了解。

### defineMock

另外，也可以使用 `defineMock` 类型帮助函数来提供编写 mock 对象的代码提示，如：
```ts
import { defineMock } from "win";

export default defineMock({
  /* 属性为具体的 method 和 请求 url，值为 object 或 array 作为请求的结果 */
  "GET /api/users": [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
  ],
  
  /* method 默认为 GET */
  "/api/users/1": { id: 1, name: "foo" },

  /* 可以使用自定义函数根据请求动态返回数据, req & res 都是 Node.js HTTP 原生对象 */
  "GET /api/users/2": (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ id: 2, name: "bar" });
  },
});
```
`defineMock` 仅仅提供类型提示，入参与出参完全一致。

## 关闭 Mock

WinJS 默认开启 Mock 功能，如果不需要的话可以从配置文件关闭：

```ts
// .winrc.ts

export default {
  mock: false,
};
```

或是用环境变量的方式关闭：

```bash
MOCK=none win dev
```

## 引入 Mock.js

在 Mock 中我们经常使用 [Mock.js](http://mockjs.com/) 来帮我们方便的生成随机的模拟数据，如果你使用了 WinJS 的 Mock
功能，建议你搭配这个库来提升模拟数据的真实性：

```ts
import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
  }),
};
```

:::tip 更多随机数据生成库

- [Chancejs](https://github.com/chancejs/chancejs)
- [Mock](https://github.com/nuysoft/Mock/wiki/Getting-Started)

:::

## 延迟响应

- 可以使用浏览器「 弱网模拟 」的功能实现。
- 可以通过 `setTimeout` 为单个接口设置延迟，例如：

```js
export default {
  'api/getInfo': (req, res) => {
    setTimeout(() => {
      res.end('delay 2000ms');
    }, 2000);
  },
};
```

## 其他配置

关于 Mock 功能完整的的其他配置项，请在文档的 [配置](../config/config#mock) 章节中查看。

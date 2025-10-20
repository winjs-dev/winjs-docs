# Mock {#mock}

WinJS provides out-of-the-box Mock functionality that allows you to set up Mock data in a convenient and simple way.

::: tip Description
What is Mock data: After the frontend and backend agree on API interfaces, the frontend can use Mock data to locally simulate the data that the API should return. This way, frontend and backend development can proceed simultaneously, without the frontend work being blocked because the backend API is still under development.
:::

A standard mock consists of three parts, using List configuration as an example.

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

The first part is the Method configuration for network requests. You can see the complete list [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). Generally, we use GET and POST.

The second part is the URL, which is the address where we initiate network requests. Generally, we use a unified prefix to facilitate proxy usage.

The third part is data processing. We can configure a JSON object, and the JSON data will be returned directly. Or we can configure a function with three parameters: [req](https://expressjs.com/en/4x/api.html#req), [res](https://expressjs.com/en/4x/api.html#res), and url. The usage is the same as [express](https://expressjs.com/). Data must be returned through `res.send`.

## Directory Convention

WinJS conventionally treats all files in the `/mock` directory as [Mock files](#mock-files). For example, with this directory structure:

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

The `todos.ts`, `items.ts`, and `users.ts` files in the `/mock` directory will be treated as [Mock files](#mock-files) by WinJS.

## Mock Files

Mock files export a default object, where each Key corresponds to a Mock interface, and the value is the return data for that interface. For example, this Mock file:

```ts
// ./mock/users.ts

export default {

  // Return value can be in array form
  'GET /api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' }
  ],

  // Return value can also be in object form
  'GET /api/users/1': { id: 1, name: 'foo' },

}
```

This declares two Mock interfaces. Through `GET /api/users`, you can get an array with two user data entries, and through `GET /api/users/1`, you can get mock data for a specific user.

### Request Methods

When the HTTP request method is GET, you can omit the method part and only need the path, for example:

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

You can also use different request methods, such as `POST`, `PUT`, `DELETE`:

```ts
// ./mock/users.ts

export default {

  'POST /api/users': { result: 'true' },

  'PUT /api/users/1': { id: 1, name: 'new-foo' },

}
```

### Custom Functions

Besides directly declaring static return values, you can also use functions to declare how to calculate return values, for example:

```ts
export default {

  'POST /api/users/create': (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  }

}
```

For more information about `req` and `res` APIs, refer to the [Express@4 official documentation](https://expressjs.com/en/api.html).

### defineMock

Additionally, you can use the `defineMock` type helper function to provide code hints when writing mock objects:

```ts
import { defineMock } from "win";

export default defineMock({
  /* Properties are specific method and request url, values are object or array as request results */
  "GET /api/users": [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
  ],
  
  /* method defaults to GET */
  "/api/users/1": { id: 1, name: "foo" },

  /* You can use custom functions to dynamically return data based on requests, req & res are both Node.js HTTP native objects */
  "GET /api/users/2": (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ id: 2, name: "bar" });
  },
});
```

`defineMock` only provides type hints; input and output parameters are completely identical.

## Disabling Mock

WinJS enables Mock functionality by default. If not needed, you can disable it from the configuration file:

```ts
// .winrc.ts

export default {
  mock: false,
};
```

Or disable it using environment variables:

```bash
MOCK=none win dev
```

## Integrating Mock.js

In Mock, we often use [Mock.js](http://mockjs.com/) to help us conveniently generate random mock data. If you use WinJS's Mock functionality, we recommend pairing it with this library to improve the realism of mock data:

```ts
import mockjs from 'mockjs';

export default {
  // Using third-party libraries like mockjs
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
  }),
};
```

:::tip More Random Data Generation Libraries

- [Chancejs](https://github.com/chancejs/chancejs)
- [Mock](https://github.com/nuysoft/Mock/wiki/Getting-Started)

:::

## Delayed Response

- You can use the browser's "slow network simulation" feature to implement this.
- You can set delays for individual interfaces through `setTimeout`, for example:

```js
export default {
  'api/getInfo': (req, res) => {
    setTimeout(() => {
      res.end('delay 2000ms');
    }, 2000);
  },
};
```

## Other Configurations

For complete information about other configuration options for Mock functionality, please check the [Configuration](../config/config#mock) section in the documentation.

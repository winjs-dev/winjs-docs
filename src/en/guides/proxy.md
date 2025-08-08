# Proxy {#proxy}

> A proxy, also called a network proxy, is a special network service that allows one endpoint (usually a client) to connect indirectly with another endpoint (usually a server) through this service. - [Wikipedia](https://en.wikipedia.org/wiki/Proxy_server)

In project development (dev), all network requests (including resource requests) are responded to and distributed through the local server. We use the [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) middleware to proxy specified requests to another target server. For example, requesting `fetch('/api')` to get data from the remote `http://jsonplaceholder.typicode.com/`.

To achieve the above requirement, we only need to use the proxy configuration in the configuration file:

```ts
export default {
  proxy: {
    '/api': {
      'target': 'http://jsonplaceholder.typicode.com/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
}
```

The above configuration means that requests with the `/api` prefix are proxied to `http://jsonplaceholder.typicode.com/`, replacing `/api` in the request address with `''`, and modifying the request origin to the target URL. For example, when requesting `/api/a`, it actually requests `http://jsonplaceholder.typicode.com/a`.

:::tip Additional Information
Configuration format can refer to: [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware).
:::  

Generally, we use this capability to solve cross-origin access issues in development. Due to the same-origin policy in browsers (or webviews), we previously had the server cooperate using Cross-Origin Resource Sharing (CORS) policy to bypass cross-origin access issues. Now with a local node service, we can use proxy to solve this problem.

> XMLHttpRequest cannot load https://api.example.com. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8000' is therefore not allowed access.

The principle is actually simple: browsers have cross-origin issues, but servers don't. We request the same-origin local service, then let the local service request the non-same-origin remote service. It's important to note that request proxy proxies the request service and doesn't directly modify the initiated request URL. It only passes the data returned by the target server to the frontend. So the request address you see in the browser is still `http://localhost:8000/api/a`.

It's worth noting that proxy can currently only solve cross-origin access issues during development (dev), and you can use same-origin deployment during deployment. If cross-origin issues occur in production (build), similar configurations can be transferred to Nginx containers.

### Matching Rules

```
 foo://example.com:3000/over/there?name=ferret#nose
 \_/   \______________/\_________/ \_________/ \__/
  |           |            |            |        |
scheme     authority       path        query   fragment
```

- `/` matches all rules
- `/api` matches paths that start with `/api`




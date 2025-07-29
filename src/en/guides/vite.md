# Vite Mode

[Vite](https://vitejs.dev/) is a new type of frontend build tool. Compared to Webpack, Vite is based on the browser's native ES Module specification, which enables faster debugging services and hot module replacement, improving the developer experience. WinJS supports both Webpack@5 and Vite@4 modes, allowing developers to choose as needed. For incremental business, we recommend using Vite's build mode.

## Enable Vite Mode

Configure the following in the configuration file `.winrc` to enable Vite mode:

```ts
export default { 
  vite: {}
};
```

## Common Issues

### Local development works fine, but production environment reports `require is not defined`

![vite-error](/images/guide/vite-error.png)

This situation is generally caused by using non-standard npm packages: a file that mixes ESM (import) and CJS (require). This requires the corresponding npm package to be standardized. You can quickly identify which npm package is causing the issue through the following steps:

1. Add the `jsMinifier: 'none'` option in `.winrc.ts` to disable compression during build
2. Run `npm run build` to build
3. Run `npm run preview` to preview the build output:

```bash
$ cd winjs-demo/
$ npm run build
$ npm run preview
```

After starting, access the page through the browser, locate which npm package is causing the issue based on the error location in the code, and then push for the corresponding package to be modified.

### How to proxy debug local dev resources in online page environment?

In some special scenarios, such as when the local server environment is unstable or issues that can only be reproduced on online pages, we usually want to debug local start resources in the online page environment. In the original Webpack mode, we only needed to use Chrome plugins (such as XSwitch) to proxy online resources (js/css) in the page to local `//127.0.0.1:8000/js/index.js`. However, in Vite mode, the build output and start output are very different, so this method cannot be used. In Vite mode, we recommend maintaining a dev HTML structure on the server side. When the URL contains a special query, render that HTML content to facilitate frontend debugging. The HTML content is as follows:

```html
<!DOCTYPE html><html>
<head>
  <script type="module" src="http://localhost:8000/@vite/client"></script>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1">
  <meta name="viewport" content="width=device-width">
</head>
<body>
  <div id="ice-container"></div>
  <script type="module" src="http://localhost:8000/src/app"></script>
</body></html>
```

When the server returns this HTML content, it will load local dev resources while using online interface data.

### How to be compatible with inline loader imports in Webpack build mode

Code with inline loader syntax will fail in Vite build mode:

```js
import Styles from '!style-loader!css-loader?modules!./styles.css';
```

Remove inline loader syntax. Most requirements can be handled by built-in engineering capabilities. For custom loader capabilities, we recommend using Vite plugin's [transform](https://vitejs.dev/guide/api-plugin.html#transforming-custom-file-types) for processing.

# Building for Production {#build}

## Build

```bash [Production]
npm run build
```

After successful build packaging, a `dist` folder will be generated in the project root directory, containing the built and packaged files, along with generated `.gz` files. Therefore, the server also needs to configure `gzip` to be enabled, so that when users access the site, they will request smaller `.gz` files, speeding up page browsing and access.
 
## Local Preview

The `dist` directory needs to be served over an HTTP server to access (unless you have configured publicPath to a relative value), so opening dist/index.html directly with the file:// protocol won't work. The simplest way to preview the production build locally is to use `preview` directly:

```bash
npm run preview
```

Or use a Node.js static file server, such as serve:

```bash
npm install -g serve
# The -s parameter means to serve it in Single-Page Application mode
# This mode will handle the routing issues mentioned below
serve -s dist
```

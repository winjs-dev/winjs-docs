# 构建生产版本 {#build}

## 构建

```bash [生产环境]
npm run build
```

构建打包成功之后，会在项目根目录生成 `dist` 文件夹，里面是构建打包好的文件，同时生成含有 `.gz` 的文件。所以也需要服务器配置 `gzip` 的开启，这样用户访问时，会请求更小的 `.gz` 文件，加快页面的浏览访问。
 
## 本地预览

`dist` 目录需要启动一个 HTTP 服务器来访问 (除非你已经将 publicPath 配置为了一个相对的值)，所以以 file:// 协议直接打开 dist/index.html 是不会工作的。 在本地预览生产环境构建最简单的方式，直接使用 `preview`

```bash
npm run preview
```

或者使用一个 Node.js 静态文件服务器，例如 serve：    

```bash
npm install -g serve
# -s 参数的意思是将其架设在 Single-Page Application 模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```

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

## 构建 SEE 包

::: code-group 

```bash [测试包]
npm run build:see 
```

```bash [生产包]
npm run build:see prod
# or（兼容财富中台前端构建的命令）
npm run build:see yes
```

:::

::: tip 提示
                           
测试包及生产包的主要区别在于 **包名**。

- 测试包：主要是提供给测试人员用的，包名是构建**带时间串和gitcommitid**的。如  `hscs-company-web-V202101-00-000-20211201092557.ea48d3ef.zip` 
- 生产包：主要是用于生产环境部署的，包名**不带时间串和gitcommitid**的。如 `hscs-company-web-V202101-00-000.zip`

其中 `V202101-00-000` 取自 `package.json` 的 "buildVersion": "V202101-00-000"
:::
 

## 构建 Docker 包
构建支持容器化部署的 SEE 发布物。

::: code-group
```bash [测试包]
npm run build:see -dockerSeePack=true
```

```bash [生产包]
npm run build:see prod -dockerSeePack=true
# or（兼容财富中台前端构建的命令）
npm run build:see yes -dockerSeePack=true
```

:::

::: tip 提示

测试包及生产包的主要区别在于 **包名**。

- 测试包：主要是提供给测试人员用的，包名是构建**带时间串和 gitcommitid**的。如  `hscs-company-web-docker-V202101-00-000-20211201092557.ea48d3ef.zip`
- 生产包：主要是用于生产环境部署的，包名**不带时间串和 gitcommitid**的。如 `hscs-company-web-docker-V202101-00-000.zip`

其中 `V202101-00-000` 取自 `package.json` 的 "buildVersion": "V202101-00-000"
:::
    
## 构建子系统
构建适用于 Hui pro 1.0 的包，并可以运行在财富中台外框架及操作员中心外框架内。

::: code-group
```bash [子包]
npm run child
```

```bash [SEE 包]
npm run build:see:child
```

```bash [Docker 包]
npm run build:see:child -dockerSeePack=true
```
:::

::: tip 提示

子系统的 SEE 包和 Docker 包，同样也是区分测试包和生产包的。构建命令后添加的参数，区分规则和上面保持一致。

:::
 
## 文件打包格式

```text
hscs-company-web-docker-V202101-00-000-20211201092557.ea48d3ef.zip

[平台]-[产品]-[项目][行业]-[web/h5]-[容器]-[构建版本号/版本号]-[时间戳].[hash].zip
```

# 快速上手 {#quick-start}

## 环境准备

在开始使用前，你需要安装 [Node.js](https://nodejs.org/)，并保证 Node.js 版本 18 或以上。

有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node.js 版本。

你可以通过以下命令检查当前使用的 Node.js 版本：

```bash
node -v
```

推荐用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 来管理 Node.js 版本，Windows 下推荐用 [nvm-windows](https://github.com/coreybutler/nvm-windows)。

Mac 或 Linux 下安装 nvm。

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ nvm -v
0.39.1
```

下面是通过 nvm 安装 Node.js 18 LTS 版本的例子：

```
# 安装 Node.js 18 的长期支持版本
$ nvm install 18 --lts

# 将刚安装的 Node.js 18 设置为默认版本
nvm alias default 18

# 切换到刚安装的 Node.js 18
nvm use 18
```

:::tip 说明
nvm 和 fnm 都是 Node.js 版本管理工具。相对来说，nvm 较为成熟和稳定，而 fnm 是使用 Rust 实现的，比 nvm 提供了更好的性能。
:::

此外，在安装 nvm 或 fnm 后，然后只要仓库根目录下有内容为 `lts/hydrogen` 的 `.nvmrc` 文件，进入这个仓库时就会自动安装或切换到正确的 Node.js 版本。

然后，需要包管理工具。Node.js 默认包含 npm，但也可以选择其他方案，

* [pnpm](https://pnpm.io/installation)
* [Yarn](https://yarnpkg.com/getting-started/install)

安装 pnpm。

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
$ pnpm -v
7.3.0
```

::: tip 提示
WinJS 只支持 yarn 1.x / pnpm 6+ / npm 8+。
:::

## 创建项目

通过官方工具创建项目，

::: code-group

```bash [PNPM]
$ pnpm dlx @winjs-dev/create-win@latest
✔ Install the following package: @winjs-dev/create-win? (Y/n) · true
✔ Pick Npm Client › pnpm
✔ Pick Npm Registry › winner
Write: .gitignore
Write: .npmrc
Write: .winrc.ts
Copy:  layouts/index.vue
Write: package.json
Copy:  pages/index.vue
Copy:  pages/users.vue
Copy:  pages/users/foo.vue
> @ postinstall /private/tmp
> win setup
info  - generate files
```

```bash [BUN]
$ bunx @winjs-dev/create-win
✔ Pick Win App Template › Simple App
✔ Pick Npm Client › pnpm
✔ Pick Npm Registry › winner
Write: .gitignore
Write: .npmrc
Write: .winrc.ts
Write: package.json
Copy:  src/assets/img/logo.png
Write: src/layouts/index.vue
Copy:  src/pages/docs.vue
Copy:  src/pages/index.vue
Write: tsconfig.json
Copy:  typings.d.ts
ready - Git initialized successfully
```

```bash [NPM]
$ npx @winjs-dev/create-win@latest
Need to install the following packages:
  @winjs-dev/create-win@latest
Ok to proceed? (y) y
✔ Pick Win App Template › Simple App
✔ Pick Npm Client › npm
✔ Pick Npm Registry › winner
Write: .gitignore
Write: .npmrc
Write: .winrc.ts
Write: package.json
Copy:  src/assets/img/logo.png
Write: src/layouts/index.vue
Copy:  src/pages/docs.vue
Copy:  src/pages/index.vue
Write: tsconfig.json
Copy:  typings.d.ts

> postinstall
> win setup
```

```bash [YARN]
$ yarn create @winner-fed/win
success Installed "@winjs-dev/create-win@0.0.3" with binaries:
      - @winjs-dev/create-win
✔ Pick Win App Template › Simple App
✔ Pick Npm Client › yarn
✔ Pick Npm Registry › winner
Write: .gitignore
Write: .npmrc
Write: .winrc.ts
Write: package.json
Copy:  src/assets/img/logo.png
Write: src/layouts/index.vue
Copy:  src/pages/docs.vue
Copy:  src/pages/index.vue
Write: tsconfig.json
Copy:  typings.d.ts
yarn install v1.22.18
success Saved lockfile.
$ win setup
info  - generate files
```

:::

注：使用 bun 初始化项目会更快，需要 bun >= `0.4.0` 版本。

这一步会自动安装依赖，同时安装成功后会自动执行 `win setup` 做一些文件预处理等工作。

### 从模板创建项目

```bash
# 从 @winner-fed/taro-template 创建一个 taro 模板
yarn create @winner-fed/win --template taro
```

### 参数选项

使用 `@winjs-dev/create-win` 创建项目时，可用的参数如下：


|     option     | description                |
| :--------------: | :--------------------------- |
|   `--no-git`   | 创建项目，但不初始化 Git   |
| `--no-install` | 创建项目，但不自动安装依赖 |
    

> 想了解更多模板的介绍，可以参考[脚手架](./boilerplate.md)   

## 启动项目

执行 `pnpm dev` 命令，

```bash
$ pnpm dev

info  - MFSU eager strategy enabled
event - [MFSU][eager] start build deps
info  - [MFSU] buildDeps since cacheDependency has changed
        ╔════════════════════════════════════════════════════╗
        ║ App listening at:                                  ║
        ║  >   Local: http://localhost:8000                  ║
ready - ║  > Network: http://10.188.41.199:8000              ║
        ║                                                    ║
        ║ Now you can open browser with the above addresses↑ ║
        ╚════════════════════════════════════════════════════╝
```

在浏览器里打开 [http://localhost:8000/](http://localhost:8000/)，能看到以下界面，

![](/images/guide/quick-start.png)

## 启用 Prettier（可选）

如果需要用 prettier 做项目代码的自动格式化，执行 `pnpm win g`，

```bash
$ pnpm win g
✔ Pick generator type › Enable Prettier -- Enable Prettier
info  - Write package.json
info  - Write .prettierrc
info  - Write .prettierignore
info  - Install dependencies with pnpm
```

## 部署发布

执行 `pnpm build` 命令，

```bash
> win build
event - compiled successfully in 1179 ms (567 modules)
event - build index.html
```

产物默认会生成到 `./dist` 目录下，

```
./dist
├── index.html
├── win.css
└── win.js
```

完成构建后，就可以把 dist 目录部署到服务器上了。

## 浏览器支持

本地开发：推荐使用 <SpecialRemark text="Chrome" /> 最新版浏览器。

生产环境： Web 及 H5 支持现代浏览器，
其中 `Vue3` **不支持 <SpecialRemark text="IE" />**。详见[Vue 支持哪些浏览器](https://cn.vuejs.org/about/faq.html#what-browsers-does-vue-support)

::: tip 注意
使用 Vue 3.x 需要考虑更多的兼容性

1. Vue3.x 不支持 ie11
2. Vue3.x 不兼容安卓6以下 webview 的 Chrome 版本

:::

具体如下：

- Vue3
  - Web 端
  
  | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/internet-explorer_9-11@1.1.16/internet-explorer_9-11_32x32.png" alt="internet-explorer_9-11"/><br />IE          | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/edge/edge_32x32.png" alt="Edge"/><br />Edge            |  <img src="https://cdn.jsdelivr.net/npm/@browser-logos/firefox/firefox_32x32.png" alt="Firefox"/><br />Firefox         | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/chrome/chrome_32x32.png" alt="Chrome"/><br />Chrome          | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/safari/safari_32x32.png" alt="Safari"/><br />Safari          |
    | ----------- | --------------- | --------------- | --------------- | --------------- |
  | not support | last 2 versions | last 2 versions | last 2 versions、>=51 | last 2 versions |
  
  - 移动端 H5
  
  | Android         | iOS           |
    | ---------- | --------------- |
  | >= 6.0 | >= 10.0 |

- Vue2
  - Web 端
  
    | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/internet-explorer_9-11@1.1.16/internet-explorer_9-11_32x32.png" alt="internet-explorer_9-11"/><br />IE         | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/edge/edge_32x32.png" alt="Edge"/><br />Edge            |  <img src="https://cdn.jsdelivr.net/npm/@browser-logos/firefox/firefox_32x32.png" alt="Firefox"/><br />Firefox         | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/chrome/chrome_32x32.png" alt="Chrome"/><br />Chrome          | <img src="https://cdn.jsdelivr.net/npm/@browser-logos/safari/safari_32x32.png" alt="Safari"/><br />Safari |
    | ----------- | --------------- | --------------- | --------------- | --------------- |
    | >= 11 | last 2 versions | last 2 versions、>= 34 | last 2 versions、>=51 | last 2 versions |
  
  - 移动端 H5
    | Android | iOS |
    |---------------------------------------------------------------------------------------------------------------------| --------------- |
    | >= 6.0 | >= 10.0 |`

# 命令行 {#commands}

WinJS 提供了很多内置的命令行用于启动，构建项目，另外还有一些辅助开发的命令，如生成器等。

要获取可用的命令列表，你可以在项目目录中运行 help 命令：

```bash
win help
```

你应该能看到类似如下的日志：

```bash
Usage: win <command> [options]

Commands:

    build     build app for production
    config    win config cli
    cache     manage win cache
    dev       dev server for development
    help      show commands help
    info      print debugging information about your environment
    lint      lint source code using eslint and stylelint
    setup     setup project
    see       generate possessing by SEE platform
    ftp       FTP uploads local files to the target server
    deadcode  check dead code
    version   show win version
    v         show win version
    plugin    inspect win plugins
    verify-commit verify the commit message, which is usually used with husky.
    preview   locally preview production build
    zip       compress the package to zip package
    run       run the script commands, support for ts and zx
    generate  generate code snippets quickly
    g         generate code snippets quickly

Run `win help <command>` for more information of specific commands.
Visit https://winjs-dev.github.io/winjs-docs/ to learn more about WinJS.
```

> 为方便查找，以下命令通过字母排序。

## build

构建项目，适用于生产环境的部署。

```bash
$ win build
```

## config

通过命令行快速查看和修改配置。

查看配置，可以用 `list` 或 `get`。

```bash
$ win config list
 - [key: polyfill] false
 - [key: externals] { esbuild: true }

$ win config get externals
 - [key: externals] { esbuild: true }
```

修改配置，可以用 `set` 或 `remove`。

```bash
$ win config set polyfill false
set config:polyfill on /private/tmp/sorrycc-wsYpty/.winrc.ts

$ win config remove polyfill
remove config:polyfill on /private/tmp/sorrycc-wsYpty/.winrc.ts
```

## cache

WinJS 将 `node_modules/.cache` 作为缓存目录，有时候需要手动清除缓存，例如改了 `node_modules` 里的文件想验证结果，或者 mf 报错清了缓存就好了。可以执行此命令清除缓存。

```bash
$ win cache clean
```

也支持输出缓存目录树及大小，显示缓存文件夹信息，`--depth` 表示层数可选，默认值为 1 层，cache层为第 0 层

执行以下命令：
```bash
win cache ls [--depth]
```

```bash
info  - [win cache] dir info
└─ [40.71 MB] node_modules/.cache
   ├─ [16.52 MB] bundler-webpack-eager
   └─ [166 KB] logger
```


## deadcode

用于查找 src 目录下未被引用的文件，并在根目录输出文件。

```bash
$ win deadcode
- Preparing...
- begin check deadCode
- write file /examples/win-run/DeadCodeList-{timeStamp}.txt
- check dead code end, please be careful if you want to remove them
```

## dev

启动本地开发服务器，进行项目的开发与调试。

```bash
$ win dev
        ╔═════════════════════════════════════════════════════╗
        ║ App listening at:                                   ║
        ║  >   Local: https://127.0.0.1:8001                  ║
ready - ║  > Network: https://192.168.1.1:8001                ║
        ║                                                     ║
        ║ Now you can open browser with the above addresses👆 ║
        ╚═════════════════════════════════════════════════════╝
event - compiled successfully in 1051 ms (416 modules)
```

## ftp

通过 FTP 工具将本地文件上传到目标服务器。通常在 package.json 的 `scripts.ftp` 里设置。

默认读取 `.winrc.ts` 配置中的 ftpOptions 属性，该属性配置具体可以参考[配置 ftpOptions](../config/config#ftpoptions)。

```bash
{
  "scripts": { "ftp": "win ftp" }
}
```
 

## generate

用于增量生成文件或启用功能，命令行别名是 `g`。

不加任何参数时会给交互式的生成器选择。

```bash
$ win g
# 或
$ win generate
? Pick generator type › - Use arrow-keys. Return to submit.
❯   Create Pages -- Create a win page by page name
    Enable Tailwind CSS -- Setup Tailwind CSS configuration
    Enable Uno CSS -- Setup Uno CSS configuration
    Generate Component -- Generate component boilerplate code
    Generate mock -- Generate mock boilerplate code
    Enable E2E Testing with Cypress -- Setup Cypress Configuration
    Generator api -- Generate api route boilerplate code
    Generate Precommit -- Generate precommit boilerplate code
    Generate huipro -- Generate subsystem build tool for hui 1.0 pro
```

也可以指定参数。

```bash
# 生成路由文件
$ win g page index --typescript --less
```

## help

查看帮助。

```bash
$ win help
Usage: win <command> [options]

Commands:

    build     build app for production
    config    win config cli
    dev       dev server for development
    help      show commands help
    setup     setup project
    see       generate possessing by SEE platform
    version   show win version
    plugin    inspect win plugins
    generate  generate code snippets quickly

Run `win help <command>` for more information of specific commands.
Visit https://winjs-dev.github.io/winjs-docs/ to learn more about WinJS.
```

也可指定命令，查看特定命令的详细帮助。

```bash
$ win help build
Usage: win build [options]
build app for production.

Details:
    win build

    # build without compression
    COMPRESS=none win build

    # clean and build
    win build --clean
```

## info   

打印有关环境的调试信息

```
$ win info

Usage: win info

 System:
    OS: macOS 11.4
    CPU: (8) arm64 Apple M1
  Binaries:
    Node: 18.16.0 - ~/Library/Caches/fnm_multishells/13409_1689559164099/bin/node
    npm: 9.6.7 - ~/Library/Caches/fnm_multishells/13409_1689559164099/bin/npm
  Browsers:
    Chrome: 114.0.5735.198
    Edge: Not Found
    Safari: 14.1.1
  npmPackages:
    vue: Not Found
    vue-router: Not Found
    win: workspace:* => 0.0.13 
  npmGlobalPackages:
    win: Not Found

``` 

## lint

用于检查及修正代码是否符合规则。

```bash
$ win lint
Usage: win lint

  # automatically fix, where possible
  win lint --fix
  
  # disable reporting on warnings
  win lint --quiet
  
  # generate a report
  win lint --report
  
  # scan the directory
  win lint --include src

```

## mfsu

::: danger 已移除
`win mfsu` 命令（含 `ls` / `build` / `remove` 子命令）已从 WinJS `0.19.1` 起随 MFSU 功能一并移除，执行会报未知命令。
:::

## plugin

插件相关操作，目前只支持 `list` 子命令。

列出所有插件。

```bash
$ win plugin list
- @winner-fed/core/dist/service/servicePlugin
- @winner-fed/preset-win (from preset)
- @winner-fed/preset-win/dist/registerMethods (from preset)
- @winner-fed/preset-win/dist/features/appData/appData (from preset)
- @winner-fed/preset-win/dist/features/check/check (from preset)
- @winner-fed/preset-win/dist/features/configPlugins/configPlugins (from preset)
- virtual: config-styles
- virtual: config-scripts
- virtual: config-routes
- virtual: config-plugins
...
```

## preview

`win preview` 命令会在本地启动一个静态 Web 服务器，将 dist 文件夹运行在 http://127.0.0.1:4172, 用于预览构建后产物, 支持 proxy、mock 等设置。

你可以通过 `--port` 参数来配置服务的运行端口。

```bash
$ win preview --port 9527

# specify hostname
win preview --host [host]

# specify port
win preview --port [port]

# specify build directory
win preview --dir [dir]

# specify url prefix
win preview --prefix [prefix]

# access path：http://localhost:4172/boilerplate
```

现在 `preview` 命令会将服务器运行在 http://127.0.0.1:9527.

通过 `--host` 参数来指定 配置服务运行的 hostname。
通过 `--port` 参数来指定 配置服务运行的 port。
通过 `--dir` 参数来指定构建后的输出目录，默认为 dist。
通过 `--prefix` 参数来允许自定义 URL 前缀，默认为配置文件里的 `base`。

以下用户配置在 `preview` 时也会生效

* [https](../config/config#https)
* [proxy](../guides/proxy)
* [mock](../guides/mock)

注意 `dist` 目录会随着配置 `outputPath` 的变更而变更。

## run

`win run` 命令可以让你像 node 运行 js 一样来运行 TypeScript 和 ESM 文件。你可以搭配 [zx](https://github.com/google/zx) 来更好的使用脚本命令。

```bash
$ win run ./script.ts
```

## setup

初始化项目，会做临时文件的生成等操作。通常在 package.json 的 `scripts.postinstall` 里设置。

```bash
{
  "scripts": { "postinstall": "win setup" }
}
```

## see

将构建后的静态资源生成 SEE 平台发布物。通常在 package.json 的 `scripts.see` 里设置。

::: tip 提示
该命令只会以构建后输出目录下现有的静态资源做包，不会执行源码编译。
:::

默认读取 `.winrc.ts` 配置中的 seeOptions 属性，该属性配置具体可以参考[配置 seeOptions](../config/config#seeoptions)。

```bash
{
  "scripts": { "see": "win see" }
}
```

## verify-commit

验证 commit message 信息，通常和 [husky](https://github.com/typicode/husky) 搭配使用。

比如在 `.husky/commit-msg` 做如下配置，

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install win verify-commit $1
```

## version

查看 `win` 版本，等同于 `win -v`。

```bash
$ win version
0.0.3
```

## zip

将指定的目录压缩成 zip 包。通常在 package.json 的 `scripts.zip` 里设置。

默认读取 `.winrc.ts` 配置中的 zipOptions 属性，该属性配置具体可以参考[配置 zipOptions](../config/config#zipoptions)。

```bash
{
  "scripts": { "zip": "win zip" }
}
```

```bash
$ win zip

info - Win v0.0.4
Building examplesample-v1001687759573867.zip...
info - Zip successfully! At /Users/liwenbo/Desktop/xxx/winjs/examples/sample/dist-zip/examplesample-v1001687759573867.zip

```

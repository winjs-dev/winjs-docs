# Command Line Interface {#commands}

WinJS provides many built-in CLI commands for starting and building projects, as well as some development assistance commands such as generators.

To get a list of available commands, you can run the help command in your project directory:

```bash
win help
```

You should see output similar to the following:

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

> For easy reference, the following commands are sorted alphabetically.

## build

Builds the project for production deployment.

```bash
$ win build
```

## config

Quickly view and modify configurations through the command line.

To view configurations, use `list` or `get`.

```bash
$ win config list
 - [key: polyfill] false
 - [key: externals] { esbuild: true }

$ win config get mfsu
 - [key: externals] { esbuild: true }
```

To modify configurations, use `set` or `remove`.

```bash
$ win config set polyfill false
set config:polyfill on /private/tmp/sorrycc-wsYpty/.winrc.ts

$ win config remove polyfill
remove config:polyfill on /private/tmp/sorrycc-wsYpty/.winrc.ts
```

## cache

WinJS uses `node_modules/.cache` as the cache directory. Sometimes you need to manually clear the cache, for example, when you've modified files in `node_modules` and want to verify the results, or when mf errors can be resolved by clearing the cache. You can execute this command to clear the cache.

```bash
$ win cache clean
```

It also supports outputting the cache directory tree and size, displaying cache folder information. `--depth` indicates the optional number of layers, with a default value of 1 layer, where the cache layer is level 0.

Execute the following command:
```bash
win cache ls [--depth]
```

```bash
info  - [win cache] dir info
└─ [40.71 MB] node_modules/.cache
   ├─ [16.52 MB] bundler-webpack-eager
   ├─ [166 KB] logger
   ├─ [4.50 MB] mfsu
   └─ [19.53 MB] mfsu-deps
```


## deadcode

Used to find unreferenced files in the src directory and output the results to a file in the root directory.

```bash
$ win deadcode
- Preparing...
- begin check deadCode
- write file /examples/win-run/DeadCodeList-{timeStamp}.txt
- check dead code end, please be careful if you want to remove them
```

## dev

Starts the local development server for project development and debugging.

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

Uploads local files to the target server through FTP tools. Usually set in `scripts.ftp` of package.json.

By default, it reads the ftpOptions property from the `.winrc.ts` configuration. For specific configuration details, refer to [configuring ftpOptions](../config/config#ftpoptions).

```bash
{
  "scripts": { "ftp": "win ftp" }
}
```
 

## generate

Used for incremental file generation or enabling features. The command line alias is `g`.

When run without any parameters, it provides an interactive generator selection.

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

You can also specify parameters.

```bash
# Generate route files
$ win g page index --typescript --less
```

## help

Shows help information.

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

You can also specify a command to view detailed help for a specific command.

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

Prints debugging information about your environment.

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

Used to check and fix code compliance with rules.

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

The `win mfsu` command can view MFSU dependency information, rebuild MFSU dependencies, and clear MFSU dependencies.


Get MFSU command help

```bash
$ win mfsu
```

Get MFSU dependency list
```bash
$ win mfsu ls
warning@0.0.3
regenerator-runtime/runtime.js@0.13.11
react/jsx-dev-runtime@18.1.0
react-intl@3.12.1
react-error-overlay/lib/index.js@6.0.9
react@18.1.0
qiankun@2.8.4
lodash/noop@4.17.21
lodash/mergeWith@4.17.21
lodash/concat@4.17.21
...
```

Rebuild MFSU dependencies

```bash
$ win mfsu build
info  - Preparing...
info  - MFSU eager strategy enabled
warn  - Invalidate webpack cache since mfsu cache is missing
info  - [MFSU] buildDeps since cacheDependency has changed
...
info  - [plugin: @winner-fed/preset-win/dist/commands/mfsu/mfsu] [MFSU][eager] build success
```

Clear MFSU dependencies
```bash
$ # Delete dependency information list
$ win mfsu remove
$ # Delete dependency information list and build artifacts
$ win mfsu remove --all
```

## plugin

Plugin-related operations. Currently only supports the `list` subcommand.

List all plugins.

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

The `win preview` command starts a local static web server, serving the dist folder at http://127.0.0.1:4172 to preview build artifacts. It supports proxy, mock, and other settings.

You can configure the service port using the `--port` parameter.

```bash
$ win preview --port 9527
```

Now the `preview` command will run the server at http://127.0.0.1:9527.

Use the `--host` parameter to specify the hostname for the service.

The following user configurations will also take effect during `preview`:

* [https](../config/config#https)
* [proxy](../guides/proxy)
* [mock](../guides/mock)

Note that the `dist` directory will change according to the `outputPath` configuration.

## run

The `win run` command allows you to run TypeScript and ESM files just like running JavaScript with node. You can combine it with [zx](https://github.com/google/zx) for better script command usage.

```bash
$ win run ./script.ts
```

## setup

Initializes the project and performs operations such as generating temporary files. Usually set in `scripts.postinstall` of package.json.

```bash
{
  "scripts": { "postinstall": "win setup" }
}
```

## see

Generates SEE platform artifacts from built static resources. Usually set in `scripts.see` of package.json.

::: tip Note
This command only packages existing static resources in the build output directory and does not perform source code compilation.
:::

By default, it reads the seeOptions property from the `.winrc.ts` configuration. For specific configuration details, refer to [configuring seeOptions](../config/config#seeoptions).

```bash
{
  "scripts": { "see": "win see" }
}
```

## verify-commit

Verifies commit message information, usually used in combination with [husky](https://github.com/typicode/husky).

For example, configure in `.husky/commit-msg` as follows:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install win verify-commit $1
```

## version

View the `win` version, equivalent to `win -v`.

```bash
$ win version
0.0.3
```

## zip

Compresses the specified directory into a zip package. Usually set in `scripts.zip` of package.json.

By default, it reads the zipOptions property from the `.winrc.ts` configuration. For specific configuration details, refer to [configuring zipOptions](../config/config#zipoptions).

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

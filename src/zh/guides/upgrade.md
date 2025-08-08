# 版本升级 {#upgrade}

## 官方包

WinJS 所有的官方包目前都使用统一版本号进行发布。

| 包名                        | 版本                                                                                                         |
|---------------------------|------------------------------------------------------------------------------------------------------------|
| @winjs-dev/create-win    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |
| @winner-fed/preset-vue    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fpreset-vue?style=flat-square&colorB=646cff)    |
| @winner-fed/preset-vue2   | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fpreset-vue2?style=flat-square&colorB=646cff)   |
| @winner-fed/renderer-vue  | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Frenderer-vue?style=flat-square&colorB=646cff)  |
| @winner-fed/renderer-vue2 | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Frenderer-vue2?style=flat-square&colorB=646cff) |
| @winner-fed/winjs         | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |

## 使用 Taze

我们推荐使用 [Taze](https://github.com/antfu-collective/taze) 来升级 WinJS 的版本，这是一个用于升级 npm 依赖版本的 CLI
工具。

### 用法

运行以下命令来升级所有名称中包含 `winner-fed` 的依赖：

```bash
npx taze --include /winner-fed/ -w
```

运行结果类似于：

```bash
winner-fed - 3 patch

  @winner-fed/core               dev  ~2mo  ^0.9.0  →  ^0.9.4
  @winner-fed/plugin-vue       dev  ~2mo  ^0.9.0  →  ^0.9.4
  @winner-fed/plugin-vue2  dev  ~2mo  ^0.9.0  →  ^0.9.4

ℹ changes written to package.json, run npm i to install updates.
```

你也可以调整 `include` 来匹配不同的包，比如仅升级 `@winner-fed` scope 下的包：

```bash
npx taze --include /@winner-fed/ -w
```

### 选项

下面是一些使用 taze 选项的示例。

- 在 monorepo 中，你可以添加 `-r` 选项来递归升级：

```bash
npx taze --include /winner-fed/ -w -r
```

- 添加 `-l` 来升级被锁定的版本：

```bash
npx taze --include /winner-fed/ -w -l
```

- 升级 major 版本：

```bash
npx taze major --include /winner-fed/ -w
```

> 更多选项请参考 [taze 文档](https://github.com/antfu-collective/taze)。
>

## 锁定子依赖

当项目某个子依赖出现问题，可能会导致 WinJS 或者项目工程无法更新，此时可以使用包管理器锁定子依赖版本。

### pnpm

对于使用 pnpm 的项目，请在**项目根目录**的 `package.json` 中添加以下配置，然后重新执行 `pnpm install`：

```json title="package.json"
{
  "pnpm": {
    "overrides": {
      "package-name": "^1.0.0"
    }
  }
}
```

### Yarn

对于使用 Yarn 的项目，请在**项目根目录**的 `package.json` 中添加以下配置，然后重新执行 `yarn install`：

```json title="package.json"
{
  "resolutions": {
    "package-name": "^1.0.0"
  }
}
```

### Npm

对于使用 Npm 的项目，请在**项目根目录**的 `package.json` 中添加以下配置，然后重新执行 `npm install`：

```json title="package.json"
{
  "overrides": {
    "package-name": "^1.0.0"
  }
}
```

::: tip 提示
对于 Monorepo 仓库，只能在项目根目录的 package.json 中锁定依赖版本，并且会影响 Monorepo 中的所有 package。
:::


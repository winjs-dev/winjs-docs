# F2ELint

F2ELint 是《前端规约》的配套 Lint 工具，可以为项目一键接入规约、一键扫描和修复规约问题，保障项目的编码规范和代码质量。

## 背景

我们引入了多个业界流行的 Linter 作为《前端规约》的配套，并根据规约内容定制了规则包，它们包括：

| 规约 | Lint 工具                                                    | 规则包 |
| -------- |------------------------------------------------------------| -------- |
| 《JavaScript 编码规约》 <br/> 《TypeScript 编码规约》 <br/> 《Vue 编码规约》     | [eslint](https://eslint.org/)                              | [@winner-fed/eslint-config-win](https://www.npmjs.com/package/@winner-fed/eslint-config-win) |
| 《CSS 编码规约》     | [stylelint](https://stylelint.io/)                         | [@winner-fed/stylelint-config-win](https://www.npmjs.com/package/@winner-fed/stylelint-config-win) |
| 《Git 规约》     | [commitlint](https://commitlint.js.org/#/)                 | [@winner-fed/commitlint-config-win](https://www.npmjs.com/package/@winner-fed/commitlint-config-win) |
| 《文档通用规约》     | [markdownlint](https://github.com/DavidAnson/markdownlint) | [@winner-fed/markdownlint-config-win](https://www.npmjs.com/package/@winner-fed/markdownlint-config-win) |

可以看到这些 Linter 和规则包众多且零散，全部安装它们会给项目增加十几个依赖，接入和升级成本都比较高。

F2ELint 收敛屏蔽了这些依赖和配置细节，提供简单的 CLI 和 Node.js API，可以让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡口，降低项目接入规约的成本。

## CLI 使用

### 安装

在终端执行：

```bash
npm install @winner-fed/f2elint -g
```

安装完成后，可执行 `f2elint -h` 以验证安装成功。

### 使用

`f2elint` 提供了以下命令使用： 

#### `f2elint init`：一键接入

在项目根目录执行 `f2elint init`，即可一键接入规约，为项目安装规约 Lint 所需的依赖和配置。

具体会做以下事情：

- 安装各种依赖：包括 Linter 依赖，如 [ESLint](https://eslint.org/)、[stylelint](https://stylelint.io/)
  、[commitlint](https://commitlint.js.org/#/)、[markdownlint](https://github.com/DavidAnson/markdownlint)
  等；配置依赖，如 [@winner-fed/eslint-config-win](https://www.npmjs.com/package/@winner-fed/eslint-config-win)
  、[@winner-fed/stylelint-config-win](https://www.npmjs.com/package/@winner-fed/stylelint-config-win)
  、[@winner-fed/commitlint-config-win](https://www.npmjs.com/package/@winner-fed/commitlint-config-win)
  、[@winner-fed/markdownlint-config-win](https://www.npmjs.com/package/@winner-fed/markdownlint-config-win) 等
- 写入各种配置文件，包括：
  - `.eslintrc.js`、`.eslintignore`：ESLint 配置（继承 @winner-fed/eslint-config-win）及黑名单文件
  - `.stylelintrc.js`、`.stylelintignore`：stylelint 配置（继承 @winner-fed/stylelint-config-win）及黑名单文件
  - `commitlint.config.js`：commitlint 配置（继承 @winner-fed/commitlint-config-win）
  - `.markdownlint.json`、`.markdownlintignore`：markdownlint 配置及黑名单文件
  - `.prettierrc.js`：符合规约的 [Prettier 配置](https://prettier.io/docs/en/configuration.html)
  - `.editorconfig`：符合规约的 [editorconfig](https://editorconfig.org/)
  - `.vscode/extensions.json`
    ：写入规约相关的 [VSCode 插件推荐](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions)
    ，包括 ESLint、stylelint、markdownlint、prettier 等
  - `.vscode/settings.json`
    ：写入规约相关的 [VSCode 设置](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations)，设置 ESLint 和
    stylelint 插件的 validate 及**保存时自动运行 fix**，如果选择使用 Prettier，会同时将 prettier-vscode 插件设置为各前端语言的 defaultFormatter，并配置**
    保存时自动格式化**
  - `f2elint.config.js`：f2elint 包的一些配置，如启用的功能等
- 配置 git commit 提交卡口：使用 [husky](https://www.npmjs.com/package/husky) 设置代码提交卡口，在 git commit
  时会运行 `f2elint commit-file-scan` 和 `f2elint commit-msg-scan` 分别对提交文件和提交信息进行规约检查。`f2elint commit-file-scan` 默认仅对 error
  问题卡口，如果你想对 warn 问题也卡口，可以增加 `--strict` 参数以开启严格模式

> 注 1：如果项目已经配置过 ESLint、stylelint 等 Linter，执行 `f2elint init` 将会提示存在冲突的依赖和配置，并在得到确认后进行覆盖：
>
> 注 2：如果项目的 .vscode/ 目录被 .gitignore 忽略，可以在拉取项目后单独执行 `f2elint init --vscode` 命令写入 `.vscode/extensions.json`
> 和 `.vscode/settings.json` 配置文件

#### `f2elint scan`：一键扫描

在项目的根目录执行命令，即可扫描项目的规约问题

支持下列参数：

- `-q` `--quiet` 仅报告 error 级别的问题
- `-o` `--output-report` 输出扫描出的规约问题日志
- `-i` `--include <dirpath>` 指定要进行规约扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则

> 注 1：事实上，你可以在任意目录执行 `f2elint scan`，F2ELint 会根据文件类型、JSON 等特征嗅探项目类型。但我们还是推荐在执行过 `f2elint init` 的项目根目录执行 `f2elint scan`
> ，以得到最准确的扫描结果。
>
> 注 2：F2ELint 会根据项目内有无 eslint 和 stylelint 配置文件判断使用项目的配置文件还是 F2ELint 默认配置进行扫描。若使用项目的，在未安装依赖时会帮其安装（执行 npm
> i）。若使用项目配置扫描失败，则使用默认配置扫描

#### `f2elint fix`：一键修复

在项目的根目录执行命令，即可修复部分规约问题

支持下列参数：

- `-i` `--include <dirpath>` 指定要进行修复扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则

注意请 review 下修复前后的代码，以免工具误修的情况。

#### `f2elint commit-file-scan` 提交文件扫描

在 git commit 时对提交文件进行规约问题扫描，需配合 git 的 pre-commit 钩子使用。

支持下列参数：

- `-s` `--strict` 严格模式，对 warn 和 error 问题都卡口，默认仅对 error 问题卡口

#### `f2elint commit-msg-scan` 提交信息扫描

git commit 时对 commit message 的格式进行扫描（使用 commitlint），需配合 [husky](https://www.npmjs.com/package/husky) 的 commit-msg 钩子使用。

## Node.js API 使用

### 安装

```bash
npm install @winner-fed/f2elint --save
```

### API

#### init：初始化

- f2elint.init(config)：将项目一键接入规约，效果等同于 `f2elint init`

示例：

```js
await f2elint.init({
  eslintType: 'vue',
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true,
  disableNpmInstall: false
});
```

config参数如下：

| 参数 | 类型 | 默认值 | 说明 |
| -------- | -------- | -------- | -------- |
| cwd | string | - | 项目绝对路径 |
| eslintType | ESLintType | - | 语言和框架类型，如果不配置，等同于 f2elint init，控制台会出现选择器，如果配置，控制台就不会出现选择器 |
| enableStylelint | boolean | - | 是否启用 stylelint，如果不配置，等同于 f2elint init，控制台会出现选择器，如果配置，控制台就不会出现选择器 |
| enableMarkdownlint | boolean | - | 是否启用 markdownlint，如果不配置，等同于 f2elint init，控制台会出现选择器，如果配置，控制台就不会出现选择器 |
| enablePrettier | boolean | - | 是否启用 Prettier |
| disableNpmInstall | boolean | false | 是否禁用自动在初始化完成后安装依赖 |

##### ESLintType

- `default`: JavaScript 项目（未使用 Vue 的 JS 项目）
- `vue`: JavaScript + Vue 项目
- `vue3`: JavaScript + Vue3 项目
- `typescript/default`: TypeScript 项目（未使用 Vue 的 TS 项目）
- `typescript/vue`: TypeScript + Vue 项目
- `es5`: ES5 及之前版本的 JavaScript 老项目

#### scan：扫描

- f2elint.scan(config): 扫描当前项目代码，效果等同 `f2elint scan`

示例：

```js
await f2elint.scan({
  cwd: path.resolve(__dirname, '../fe'),
  include: '.',
  fix: false,
  quiet: false,
  outputReport: false,
});
```

| 参数 | 类型 | 默认值 | 说明 |
| -------- | -------- | -------- | -------- |
| cwd | string | - | 项目绝对路径 |
| include | string | cwd | 指定要进行规约扫描的目录 |
| quiet | boolean | false | 仅报告错误信息 |
| fix |  boolean | false | 是否自动修复扫描到问题 |
| outputReport | boolean | false | 输出扫描出的规约问题日志 |

## 配置

F2ELint 基于一份配置进行扫描（但你也可以零配置使用），支持的配置参数有：

| 参数 | 类型 | 默认值 | 说明 |
| -------- | -------- | -------- | -------- |
| enableESLint | boolean | true | 是否启用 ESLint |
| enableStylelint | boolean | true | 是否启用 stylelint |
| enableMarkdownlint | boolean | true | 是否启用 markdownlint |
| enablePrettier | boolean | - | 是否启用 Prettier |
| eslintOptions | ESLint.Options | - | ESLint 配置项，若未设置将使用执行目录下或内置的默认 eslintrc 和 eslintignore 进行扫描 |
| stylelintOptions | stylelint.LinterOptions | - | stylelint 配置项，若未设置将使用执行目录下或内置的默认 stylelintrc 和 stylelintignore 进行扫描 |
| markdownlintOptions | markdownlint.Options | - | markdownlint 配置项，若未设置将使用执行目录下或内置的默认 markdownlint 配置文件进行扫描 |

### 使用自定义配置

当以命令行方式运行 `f2elint` 时， F2ELint 会读取执行目录下的 `f2elint.config.js` 或 `package.json` 中的属性作为配置文件。由于 F2ELint 本身也附带 TypeScript 类型，也直接支持 TS 配置文件。
F2ELint 支持以下的文件类型：

- `f2elint.config.ts`
- `f2elint.config.js`
- `f2elint.config.cjs`
- `f2elint.config.mjs`
- `f2elint.config.json`
- `package.json` 中 `f2elint` 属性

在上述的文件中，都可以使用 `default`、 `module.exports` 进行导出。

#### TypeScript/JavaScript

```js
 export default {
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true
};
```

或者可以使用 `@winner-fed/f2elint` 提供的 `defineConfig` 工具函数，以获得更好的类型提示：

```js
import { defineConfig } from '@winner-fed/f2elint';

export default defineConfig({
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true
});
```

#### package.json

```json
{
  "f2elint": {
    "enableESLint": true,
    "enableStylelint": true,
    "enableMarkdownlint": true,
    "enablePrettier": true
  }
}

```

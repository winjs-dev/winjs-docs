# 规范

写程序的时候，首先考虑到人，其次才考虑机器。 —— 出自《代码大全》 
  
## 编码规范

我们通常会在项目中使用 ESLint、Stylelint 来协助我们把控编码质量，为了实现低成本、高性能、更稳定地接入上述工具，WinJS 提供了开箱即用的 Lint 能力，包含以下特性：

1. **推荐配置**：提供 ESLint 及 Stylelint 推荐配置，可以直接继承使用
2. **统一的 CLI**：提供 `win lint` CLI，集成式调用 ESLint 和 Stylelint
3. **规则稳定**：始终确保规则的稳定性，不会出现上游配置更新导致存量项目 lint 失败的情况

其中，ESLint 配置具备如下特点：

1. **仅质量相关**：我们从数百条规则中筛选出数十条与编码质量相关的规则进行白名单开启，回归 Lint 本质，且不会与 Prettier 的规则冲突
2. **性能优先**：部分 TypeScript 的规则实用型低但项目全量编译的成本却很高，我们对这些规则进行禁用以提升性能
3. **内置常用插件**：包含 vue、@typescript/eslint 等，满足日常所需

来看看如何接入吧。

### 使用方式
第一次执行 `win lint`时，会检测当前工程中是否存在 [f2elint](f2elint.md) 的配置文件，如果没有，会引导安装。根据命令行里的提示进行安装即可。

在配置文件创建完毕后，我们其实已经可以通过 `eslint`、`stylelint` 命令来执行 lint 了，但我们仍然推荐使用 `win lint` 命令，以获得更便捷的体验。

提示：有关 `f2elint`的具体用法，可以参考[这里](f2elint.md)。

#### CLI

`win lint` 命令的用法如下：

```bash
$ win lint [--include dir] [--fix] [--quiet] [--report]
```

参数说明：

```bash
# automatically fix, where possible
win lint --fix

# disable reporting on warnings
win lint --quiet

# generate a report
win lint --report

# scan the directory
win lint --include src
```

通常来说，直接执行 `win lint` 应该就能满足大部分情况。

::: tip 提示

lint 默认检测的是 `src` 目录，也就是说当执行命令 `win lint` 时，也即执行 `win lint --include src` 是一样的效果。

:::

### 与 Git 工作流结合

我们也推荐使用 [lint-staged](https://github.com/okonet/lint-staged#readme) 和 [Husky](https://typicode.github.io/husky/)，将 `win lint` 与 Git 工作流结合使用，以便在**提交代码时**自动 lint **本次变更**的代码。

#### lint-staged

lint-staged 用来驱动 `win lint` 命令，每次仅将变更的内容交给 `win lint` 进行检查。

安装方式：

```bash
$ npm i lint-staged -D
#or 
$ pnpm add lint-staged -D
```

在 `package.json` 中配置 lint-staged：

```diff
{
+   "lint-staged": {
+     "*.{js,jsx,ts,tsx,css,less}": [
+       "win lint"
+     ]
+   }
}
```

此时如果执行 `git add sample.js` 后，再执行 `npx lint-staged`，就能实现仅检查 `sample.js` 本次的变更了。

#### Husky

Husky 用来绑定 Git Hooks、在指定时机（例如 `pre-commit`）执行我们想要的命令，安装方式请参考 Husky 文档：https://typicode.github.io/husky/#/?id=automatic-recommended

初始化完成后，需要手动修改 `.husky/pre-commit` 文件的内容：

```diff
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

- npm test
+ npx lint-staged
```

至此大功告成，每次执行 `git commit` 命令的时候，`win lint` 就能自动对本次变更的代码进行检查，在确保编码质量的同时也能确保执行效率。

### Prettier

在启用 `win lint` 的基础上，我们也建议与 [Prettier](https://prettier.io/docs/en/install.html) 一同使用，以确保团队的代码风格是基本一致的。

可参考 Prettier 文档将其配置到 lint-staged 中：https://prettier.io/docs/en/install.html#git-hooks
   

## 其他

### ESLint
代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。当我们设计了一套有关编码规范的规则集时，就需要借助工具来辅助检测。这就是 ESLint。它是一个集代码审查和修复的工具，它的核心功能是通过配置一个个规则来限制代码的合法性和风格。目前是社区内最流行、通用的JS Lint工具。ESLint 会默认读取配置文件 .eslintrc.* 文件，统一的规则集在 rules 中进行配置。

#### 配置解析器和解析参数
ESLint 默认使用 Espree 作为其解析器，也可以在配置文件中指定一个不同的解析器，比如
- @babel/eslint-parser - 一个对 Babel 解析器的包装，提供对一些 babel 语法的支持，使其能够与 ESLint 兼容。如果项目中使用了较新的 ES 语法，比如 ES2020中的 Optional Chaining（可选链操作符），可以指定其作为解析器。

- @typescript-eslint/parser - 将 TypeScript 转换成与 estree 兼容的形式，以便在 ESLint 中使用。如果项目是使用 TS 开发的，优先使用此作为解析器。

解析器选项可以在 .eslintrc.* 文件使用 parserOptions 属性设置。示例如下：
```javascript
 module.exports = {
    // ESLint 默认解析器，也可以指定成别的
    parser: "espree", 
    parserOption: {
        // 指定要使用的 ECMAScript 版本，默认值 5
        // 可以使用 6、7、8、9 或 10 来指定想要使用的 ECMAScript 版本。也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)，或 2020（同 11） 或 2021（同 12）
        ecmaVersion: 5,
        // 设置为 script (默认) 或 module（如果项目中的代码是 ECMAScript 模块)
        sourceType: "script",
        // 这是个对象，表示想使用的额外的语言特性，所有选项默认都是 false
        ecmafeatures: {
            // 是否允许在全局作用域下使用 return 语句
            globalReturn: false,
            // 是否启用全局 strict 模式（严格模式）
            impliedStrict: false,
            // 是否启用JSX
            jsx: false,
            // 是否启用对实验性的 object rest/spread properties 的支持
            experimentalObjectRestSpread: false
        }
    }
}
```
举个例子，使用 Vue 作为技术框架，创建的项目中使用的 ESLint 的配置文件

```javascript
module.exports = {
  // 需要指定可以可以解析 .vue 语法的解析器
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser'
  }
}
```

目前，团队采用 [eslint-config-win](https://github.com/winjs-dev/eslint-config-win) 来检验 JavaScript/Vue 的代码。

### StyleLint
StyleLint 是一个强大的、现代化的 CSS 检测工具, 与 ESLint 类似, 也是通过定义一系列的编码风格规则帮助我们避免在样式表中出现错误。支持最新的 CSS 语法、CSS-in-JS、以及其他类 CSS 语法(如SCSS、Less)。

#### 配置方式
按顺序查找，任何一项有值，就会结束查找：
- 在 package.json 中的 stylelint 属性指定规则
- 在 .stylelintrc 文件中指定，也是可以是 JSON 或者 YAML 文件格式。或者给该文件加后缀，如 .stylelintrc.json , .stylelintrc.yaml , .stylelintrc.yml , .stylelintrc.js
- stylelint.config.js 文件，该文件 exports 一个配置对象
#### 语法格式
rules 优先级大于 extends，建议采用 extends 或 plugins 方式统一管理

```javascript
module.exports = {
  processors: ['stylelint-my-processor'],
  plugins: ['stylelint-order', "./mySpecialRule.js"],
  extends: ['stylelint-config-standard', './myExtendableConfig'],
  rules: {
    // 要求或禁止使用空行 always-有必须有空行 never-之前不加空行
    // except 辅助选项
    'at-rule-empty-line-before': ['always',
      {
        except: [
          'blockless-after-same-name-blockless', // 同名规则可不加空行
          'first-nested' // 第一个子节点不加空行
        ],
        ignore: ['after-comment'] // 忽略注释后的规则
      }
    ],
    // 指定大小写
    'at-rule-name-case': 'lower',
    // 要求在 at 规则之后有一个换行符 多行
    'at-rule-name-newline-after': 'always-multi-line',
  }
};
```

目前，团队采用 [stylelint-config-win](https://github.com/cloud-templates/stylelint-config-win) 来检验 CSS/Less 的代码，具体规则可以参考这个[linter-docs/style](http://172.27.24.2/h5-linter-docs/?rule=style).。

### CommitLint

基于社区应用比较广泛的 Angular Commit message 写法规范
在实际项目开发过程中，Git 的每次提交代码，都需要写 Commit message（提交说明），规范的 Commit message有很多好处：

- 方便快速浏览查找，回溯之前的工作内容和当时处理问题的一些细节问题
- 可以直接从 Commit 生成 Change log (发布时用于说明版本差异)

#### 规范方式
可以借助 [commitlint](https://marionebl.github.io/commitlint/#/) 和 [husky](https://github.com/typicode/husky) 来进行提交检查，当执行 git commit 时会在对应的git钩子上做校验，只有符合格式的 Commit message 才能提交成功。为了方便使用，增加了对 [commitizen](https://github.com/commitizen/cz-cli) 的支持，可以使用 [cz-customizable](https://github.com/leonardoanalista/cz-customizable) 进行配置。支持使用 git cz 替代 git commit。
**脚手架已经内置了此功能（项目初建时，版本管理工具选择 Git 即可），借助 husky 实现在Git 提交前（pre-push）的钩子函数，增加 eslint 及 stylelint 的编码规范检测。**

#### Commit message 规范格式
此内容包含3个部分：Header（必选）、Body 和 Footer

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
其中 Header 主要包含以下部分：

`<type>(<scope>): <subject>`
// 注意冒号 : 后有空格
// 如 feat(miniprogram): 增加了小程序模板消息相关功能 复制代码

- **subject（必填）：** 用于对commit进行简短的描述
- **type（必填）：** 表示提交类型，值有以下几种：
  - feat 增加新功能
  - fix 修复问题/BUG
  - style 代码风格相关无影响运行结果的
  - perf 优化/性能提升
  - refactor 重构
  - revert 撤销修改
  - test 测试相关
  - docs 文档/注释
  - chore 依赖更新/脚手架配置修改等
  - workflow 工作流改进
  - ci 持续集成
  - types 类型定义文件更改
  - wip 开发中
- **scope（选填）：** 表示commit的作用范围，如数据层、视图层，也可以是目录名称

#### 跳过规约检查
强烈不建议你这么做，但你执意如此：

```bash
git commit -m "xxx" --no-verify
# or
git commit -m "xxx" -n
```

目前，团队采用 [@winner-fed/commitlint-config-win](https://www.npmjs.com/package/@winner-fed/commitlint-config-win) 来检验 git commit 的信息。配置文件可以参考工程模板根目录下的 `commitlint.config.js`。

### Markdown
Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。

使用它编写技术文档时，具备以下优势：

- Markdown 处处可用。人们使用它来创建 网站、文档、便签、书籍、演示文稿、邮件 和 技术文档。

- Markdown 是可移植的。几乎可以使用任何应用程序打开包含 Markdown 格式的文本文件。如果你不喜欢当前使用的 Markdown 应用程序了，则可以将 Markdown 文件导入另一个 Markdown 应用程序中。这与 Microsoft Word 等文字处理应用程序形成了鲜明的对比，Microsoft Word 将你的内容锁定在专有文件格式中。

- Markdown 是独立于平台的。你可以在运行任何操作系统的任何设备上创建 Markdown 格式的文本。

- Markdown 能适应未来的变化。即使你正在使用的应用程序将来会在某个时候不能使用了，你仍然可以使用文本编辑器读取 Markdown 格式的文本。当涉及需要无限期保存的书籍、大学论文和其他里程碑式的文件时，这是一个重要的考虑因素。

- Markdown 无处不在。例如 Reddit 和 GitHub 等网站都支持 Markdown，许多桌面和基于 Web 的应用程序也都支持 Markdown。

**因此，遵守行文规范，可以保证所有文章阅读体验的一致性。**

目前，团队采用 [@winner-fed/markdownlint-config-win](https://www.npmjs.com/package/@winner-fed/markdownlint-config-win) 来检验 markdown 文档的格式问题。配置文件可以参考工程模板根目录下的 `.markdownlint.json`。

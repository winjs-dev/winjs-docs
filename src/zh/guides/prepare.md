# 开发环境 {#prepare}

本文将带领你从零开始在本地搭建一个 WinJS 项目的开发环境。

## 终端应用程序

> 命令行工具已经是现代前端开发者必需的了。

通常，我们建议使用内置终端。

- 对于 Windows， 支持 **Command Prompt** 和 **PowerShell**
- 对于 macOS，支持内置的终端应用程序 **Terminal**

## Nodejs

WinJS 需要使用 [Node.js](https://nodejs.org/zh-cn/) 来进行开发，因此请先确保电脑已经安装了 Node.js 且版本在 14 以上。
 
::: tip 提示
如果你是 macOS 用户，建议使用 [nvm](https://github.com/nvm-sh/nvm) 来管理 Node.js 的版本；
Windows 用户建议使用 [nvm-windows](https://github.com/coreybutler/nvm-windows) 。
:::

本文将以 macOS 或 Linux 环境下使用 [nvm](https://github.com/nvm-sh/nvm) 的方式安装 [Node.js](https://nodejs.org/zh-cn/) ：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm -v

0.39.1
```

安装完成 [nvm](https://github.com/nvm-sh/nvm) 之后，使用以下命令来安装 [Node.js](https://nodejs.org/zh-cn/) ：

```bash
nvm install 16
nvm use 16
```

安装完成后，使用以下命令来检查是否安装成功并且安装了正确的版本：

```bash
node -v

v16.14.0
```

## 依赖管理

Node 安装完成后会自带 [npm](https://www.npmjs.com/) 依赖管理工具，但 WinJS 推荐使用 [pnpm](https://pnpm.io/) 来管理依赖：

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

安装完成后，可以用以下命令检查是否安装成功：

```bash
pnpm -v

7.3.0
```

## IDE

安装完 [Node.js](https://nodejs.org/zh-cn/) 及 [pnpm](https://pnpm.io/) (或其他依赖管理工具) 后，你需要一个自己习惯的 IDE 或文本编辑器来编写代码。如果你还没有习惯的 IDE，可以从下方挑选一个：

1. [Visual Studio Code](https://code.visualstudio.com/) (推荐)
2. [WebStorm](https://www.jetbrains.com/webstorm/) (推荐)
3. [IntelliJ IDEA](https://www.jetbrains.com/idea/)
4. [Sublime Text](https://www.sublimetext.com/)
5. [Atom](https://atom.io/)

## Git

在使用脚手架开发项目时，Git 不是必须的，但是我们强烈建议你安装和使用它。[Git](https://git-scm.com/) 是一个很高效流行的版本控制软件。

Git 通常伴随有 Git 主机，例如 GitHub，在这种情况下，需要进行其他设置。按照 Git 主机文档中的教程设置 Git：

- GitHub: [Set up Git](https://help.github.com/en/articles/set-up-git)
- GitLab: [Installing Git](https://docs.gitlab.com/ee/topics/git/how_to_install_git)
- Bitbucket: [Install Git](https://www.atlassian.com/git/tutorials/install-git)

否则，请遵循[官方安装说明](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。可以从[下载页面](https://git-scm.com/downloads)下载命令行实用程序。

要验证安装成功，请打开一个新的终端窗口并运行：

```shell
$ git --version
```

### Git GUI

Git 是一个命令行实用程序，但是有许多 [GUI 客户端](https://git-scm.com/downloads/guis/)可用。使用 GitHub 的时候，推荐使用[GitHub Desktop](https://desktop.github.com/)。其他 Git 主机，建议安装 [Sourcetree](https://www.sourcetreeapp.com/)。

## 下一步

恭喜你！你的本地环境已经准备好开始开发 WinJS 项目了，马上前往 [脚手架](boilerplate) 学习如何使用 WinJS 脚手架快速启动一个项目吧 🎉

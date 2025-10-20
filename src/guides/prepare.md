# Development Environment {#prepare}

This article will guide you through setting up a WinJS project development environment from scratch on your local machine.

## Terminal Application

> Command-line tools are now essential for modern frontend developers.

Usually, we recommend using the built-in terminal.

- For Windows, supports **Command Prompt** and **PowerShell**
- For macOS, supports the built-in terminal application **Terminal**

## Node.js

WinJS requires [Node.js](https://nodejs.org/) for development, so please ensure that Node.js is installed on your computer with version 14 or above.
 
::: tip Tip
If you're a macOS user, we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions;
Windows users are recommended to use [nvm-windows](https://github.com/coreybutler/nvm-windows).
:::

This article will install [Node.js](https://nodejs.org/) using [nvm](https://github.com/nvm-sh/nvm) in macOS or Linux environment:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm -v

0.39.1
```

After installing [nvm](https://github.com/nvm-sh/nvm), use the following commands to install [Node.js](https://nodejs.org/):

```bash
nvm install 16
nvm use 16
```

After installation is complete, use the following command to check if the installation was successful and the correct version was installed:

```bash
node -v

v16.14.0
```

## Dependency Management

After Node is installed, it comes with the [npm](https://www.npmjs.com/) dependency management tool, but WinJS recommends using [pnpm](https://pnpm.io/) to manage dependencies:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

After installation is complete, you can check if the installation was successful with the following command:

```bash
pnpm -v

7.3.0
```

## IDE

After installing [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) (or other dependency management tools), you need an IDE or text editor you're comfortable with to write code. If you don't have a preferred IDE yet, you can choose one from below:

1. [Visual Studio Code](https://code.visualstudio.com/) (Recommended)
2. [WebStorm](https://www.jetbrains.com/webstorm/) (Recommended)
3. [IntelliJ IDEA](https://www.jetbrains.com/idea/)
4. [Sublime Text](https://www.sublimetext.com/)
5. [Atom](https://atom.io/)

## Git

When developing projects using scaffolding, Git is not required, but we strongly recommend that you install and use it. [Git](https://git-scm.com/) is a very efficient and popular version control software.

Git usually comes with a Git host, such as GitHub. In this case, additional setup is required. Follow the tutorials in your Git host documentation to set up Git:

- GitHub: [Set up Git](https://help.github.com/en/articles/set-up-git)
- GitLab: [Installing Git](https://docs.gitlab.com/ee/topics/git/how_to_install_git)
- Bitbucket: [Install Git](https://www.atlassian.com/git/tutorials/install-git)

Otherwise, follow the [official installation instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). You can download the command-line utility from the [download page](https://git-scm.com/downloads).

To verify successful installation, open a new terminal window and run:

```shell
$ git --version
```

### Git GUI

Git is a command-line utility, but there are many [GUI clients](https://git-scm.com/downloads/guis/) available. When using GitHub, we recommend [GitHub Desktop](https://desktop.github.com/). For other Git hosts, we recommend installing [Sourcetree](https://www.sourcetreeapp.com/).

## Next Steps

Congratulations! Your local environment is ready to start developing WinJS projects. Head over to [Boilerplate](boilerplate) to learn how to use WinJS scaffolding to quickly start a project! 🎉

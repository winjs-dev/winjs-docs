# Boilerplate {#boilerplate}

WinJS officially provides a boilerplate that brings the following benefits:
1. Improved development efficiency: Templates provided by technical frameworks can help developers quickly set up the basic framework of applications, reducing the time and effort developers spend writing code from scratch, thereby improving development efficiency.
2. Standardized development process: Templates provided by technical frameworks usually include best practices and industry-standard implementation methods. Developers can build upon this foundation, avoiding excessive freedom and non-standard development processes.
3. Improved code quality: Templates provided by technical frameworks have been tested and validated in multiple aspects, and their code quality and performance are guaranteed. Developers can learn from framework-provided templates to write high-quality code, thereby improving the overall quality of applications.
4. Reduced development risks: Templates provided by technical frameworks have been tested in real-world scenarios multiple times, helping developers avoid common development risks and vulnerabilities, thus reducing the overall risk of applications.
5. Improved maintainability: Templates provided by technical frameworks usually include code documentation and comments, as well as clear code structure, which helps developers better understand and maintain code, thereby improving code maintainability.

Developers can easily and quickly create a project based on the following commands:

```bash
# Create project according to prompts
pnpm create @winner-fed/win
# Create project in my-winjs-app folder in current directory
pnpm create @winner-fed/win my-winjs-app
```

This command will install the `@winner-fed/create-win` boilerplate and run it automatically. After running, it provides three optional items to choose from:

1. Pick Win App Template - Choose application (built-in) template

You can choose the type of application you need to create from the following options:

- [Simple App](#simple)
- [Hybrid App](#hybrid)
- [PC Web](#pc)
- [H5 App](#app)
- [Win Plugin](#plugin)

2. Pick Npm Client - Choose Npm client

You can choose your preferred Node dependency management tool from the following options:

- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)

3. Pick Npm Registry - Choose Npm registry

Domestic developers are recommended to choose "taobao", otherwise choose "npm". Choosing npm taobao registry is usually faster when installing dependencies.

- [npm](https://www.npmjs.com/)
- [taobao](https://npmmirror.com/)

After selection, it will automatically generate a basic WinJS project and install dependencies according to the selected client and mirror source:

```text
.
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── assets
│   │   └── img
│   │       └── logo.png
│   ├── layouts
│   │   └── index.vue
│   └── pages
│       ├── docs.vue
│       └── index.vue
├── tsconfig.json
└── typings.d.ts
```

This completes the initialization of a WinJS project with one click.

## Built-in Template Introduction
To facilitate rapid application development, the following built-in templates are provided.

### H5 App {#app}
Template for H5 development

### Hybrid App {#hybrid}
Template for hybrid development

### PC Web {#pc}
PC Web template

### Win Plugin {#plugin}
Plugin development template

### Simple App {#simple}
A minimalist app template. If you want to try WinJS, you can choose this one to start from "0".

## Creating Projects from Remote Templates

You can use `create-win` to quickly create projects from mini-program templates of different technical frameworks.

```bash
# Create a taro mini-program project from @winner-fed/taro-template
yarn create @winner-fed/win --template taro
```

Mini-program templates for different technical frameworks are as follows:

1. taro-template
2. uniapp-template

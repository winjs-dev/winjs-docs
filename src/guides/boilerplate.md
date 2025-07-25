# 脚手架 {#boilerplate}

WinJS 官方提供了一个脚手架，带来的好处包括：
1. 提高开发效率：技术框架提供的模板可以帮助开发人员快速搭建起应用程序的基本框架，减少了开发人员从零开始编写代码的时间和精力，从而提高了开发效率。
2. 规范化开发流程：技术框架提供的模板通常会包括最佳实践和行业标准的实现方式，开发人员可以在这个基础上进行开发，避免了过多的自由度和不规范的开发流程。
3. 提高代码质量：技术框架提供的模板经过了多方面的测试和验证，其代码质量和性能已经得到了保证。开发人员可以借鉴框架提供的模板来编写高质量的代码，从而提高了整个应用程序的质量。
4. 降低开发风险：技术框架提供的模板经过了多次的实战检验，能够帮助开发人员避免一些常见的开发风险和漏洞，从而降低了整个应用程序的风险。
5. 提高可维护性：技术框架提供的模板通常会包含代码的文档说明和注释，以及代码的清晰结构，这有助于开发人员更好地理解和维护代码，从而提高了代码的可维护性。

开发人员可以基于以下命令，轻松快速创建一个项目：

```bash
# 根据提示创建项目
pnpm create @winner-fed/win
# 在当前目录的 my-winjs-app 文件夹下创建项目
pnpm create @winner-fed/win my-winjs-app
```

这个命令会安装 `@winner-fed/create-win` 脚手架并自动运行，运行后提供了三个可选项可以选择：

1. Pick Win App Template - 选择应用程序（内置）模板

你可以从以下几个选项中选择需要创建的应用程序类型：

- [Simple App](#simple)
- [Hybrid App](#hybrid)
- [PC Web](#pc)
- [Hui pro 1.0](#huipro)
- [H5 App](#app)
- [Win Plugin](#plugin)

2. Pick Npm Client - 选择 Npm 客户端

你可以从以下几个选项中选择习惯的 Node 依赖管理工具：

- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)

3. Pick Npm Registry - 选择 Npm 源

国内的开发者建议选「taobao」，否则选「npm」。选择 npm taobao 源在安装依赖时通常会更快一些。

如果是公司内部的项目，选择 「winner」

- [npm](https://www.npmjs.com/)
- [taobao](https://npmmirror.com/)
- [winner](公司内部镜像源)

::: warning 注意
Npm 源再选择 `winner` 时，用户如果没有默认镜像源的访问权限，可以自定义输入有权限的镜像源地址。
默认内置为： `http://artifactory.hundsun.com/artifactory/api/npm/winnerproject-npm-virtual/`。 
:::

选择后会自动生成一个最基本的 WinJS 项目，并根据选中的客户端和镜像源安装依赖：

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

这样就一键完成 WinJS 项目的初始化了。

## 内置模板介绍
为了便于快速开发应用程序，提供了下列内置的模板。

### H5 App {#app}
H5 开发的模板

### Hybrid App {#hybrid}
混合式开发的模板

### PC Web {#pc}
PC Web 模板

### Hui pro 1.0{#huipro}
HUI pro 1.0 模板

### Win Plugin {#plugin}
插件开发模板

### Simple App {#simple}
极简的 app 模板，如果想要尝试下 WinJS，可以选择这个，从 “0” 开始。

## 从远程模板创建项目

可以使用 `create-win` 从不同技术框架的小程序模板快速创建项目。  

```bash
# 从 @winner-fed/taro-template 创建一个 taro 小程序工程
yarn create @winner-fed/win --template taro
```

不同技术框架的小程序模板，如下

1. [taro-template](https://gitlab.hundsun.com/WhaleFE/winner-others/tree/taro-template)
2. [uniapp-template](https://gitlab.hundsun.com/WhaleFE/winner-others/tree/uniapp-template)
3. [hola-template](https://gitlab.hundsun.com/WhaleFE/winner-others/tree/hola-template)

::: warning 注意
Npm 源再选择 `winner` 时，需要输入公司效能平台对应的 「npm-api-key」。这样才可以下载公司内网的对应的模板工程。一定不要取错了，不然会下载失败。
:::

![效能平台1](/images/guide/devops2.png)
![效能平台2](/images/guide/devops.png)
![效能平台3](/images/guide/devops1.png)

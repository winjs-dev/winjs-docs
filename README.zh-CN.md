# WinJS 文档

<p align="center">
  <img src="src/public/images/logo.png" width="120" alt="WinJS Logo">
</p>

<p align="center">
  <strong>WinJS - 可扩展的 Vue.js 前端应用框架</strong>
</p>

<p align="center">
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node.js">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://app.netlify.com/projects/winjs-docs/deploys">
    <img src="https://api.netlify.com/api/v1/badges/1b9b4475-68fe-4125-a8ad-d93955df7ac4/deploy-status" alt="Netlify Status">
  </a>
</p>

[English](./README.md) | 简体中文

## 📖 关于此项目

这是 WinJS 框架的官方文档站点，使用 [VitePress](https://vitepress.dev/) 构建。文档涵盖了 WinJS 框架的完整使用指南、API
参考、插件开发等内容。

## ✨ WinJS 简介

WinJS 是一个可扩展的前端应用框架，Fork 自 UmiJS，专为 Vue.js 生态系统设计。它提供了完整的前端开发解决方案，从项目初始化到生产部署的全流程支持。

### 核心特性

- 💎 **大道至简** - 内置路由、状态管理、构建、部署等，仅需一个依赖即可开发
- 🎁 **功能丰富** - 支持 Web、插件、小程序、H5、离线包等多种应用类型
- 🎉 **可扩展** - 完整的插件化生命周期，所有功能均可通过插件扩展
- ⚖️ **多构建引擎** - 支持 Vite、Webpack、Rsbuild 等多种构建方案
- 🌴 **完备路由** - 基于 vue-router，支持嵌套、动态路由和按需加载
- 🚄 **面向未来** - 基于 Vue 3.0，拥抱最新的前端技术

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 7.4.0 (推荐) / npm >= 8 / yarn >= 1.x

### 创建项目

```bash
# 使用 pnpm (推荐)
pnpm dlx @winner-fed/create-win@latest

# 使用 npm
npx @winner-fed/create-win@latest

# 使用 yarn
yarn create @winner-fed/win
```

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📚 文档结构

```
src/
├── api/              # API 参考文档
├── guides/           # 开发指南
│   ├── getting-started.md    # 快速开始
│   ├── introduce.md          # 框架介绍
│   ├── build.md             # 构建配置
│   ├── routes.md            # 路由配置
│   └── ...
├── config/           # 配置说明
├── cli/              # CLI 命令
├── plugins/          # 插件文档
└── blog/             # 博客文章
```

## 💻 本地运行文档

### 环境准备

确保已安装 Node.js 18+ 和 pnpm 7.4+。

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173 查看文档。

### 构建文档

```bash
pnpm build
```

构建产物将生成在 `.vitepress/dist` 目录。

## 🤝 贡献指南

我们欢迎社区的贡献！如果你想要参与文档的改进：

1. Fork 此仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 文档规范

- 使用中文编写文档
- 遵循 Markdown 语法规范
- 代码示例需要完整可运行
- 新增内容需要更新相应的导航

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---
layout: home
title: WinJS
hero:
  name: WinJS
  text: 前端开发框架
  tagline: 用 WinJS 「拼搭」你的下一个 Web 应用
  image:
    src: /images/hero.png
    alt: WinJS
  actions:
    - text: 快速上手
      link: /zh/guides/getting-started.html
      theme: brand
    - text: 框架简介
      link: /zh/guides/introduce.html
      theme: alt
features:
  - icon: 💎
    title: 大道至简
    details: 内置路由、状态管理、构建、部署、测试、Lint、SvgIcon 等，仅需一个 WinJS 依赖即可上手开发。
  - icon:  🎁
    title: 功能丰富
    details: 一键创建 Web、插件、小程序、H5、离线包应用程序，快捷开发，开箱即用。贯彻“约定优于配置”思想。代码配置化了，配置约定化了。
  - icon: 🎉
    title: 可扩展
    details: 借鉴 UmiJs，实现了 web 应用开发的完整生命周期，并使之插件化，包括 WinJS 内部功能也是全由插件实现。
  - icon: ⚖️
    title: 多构建引擎
    details: 提供 Vite、 Webpack、Rsbuild 等多种构建模式供开发者选择，并尽可能保证它们之间功能的一致性。
  - icon: 🌴
    title: 完备路由
    details: 基于 vue-router，类 Nuxt.js，支持嵌套、动态、动态可选、按需加载、基于路由的请求优化等。
  - icon: 🚄
    title: 面向未来
    details: 在满足需求的同时，我们也不会停止对新技术的探索。已使用 Vue3.0 来提升应用性能。
footer: MIT Licensed | Copyright © 2016-present winjs-dev
---

<script setup>
import { onMounted } from 'vue';

function getNpmPackageVersion(packageName) {
  const url = `https://unpkg.com/${packageName}/package.json`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to retrieve version for ${packageName}.`);
      }
      return response.json();
    })
    .then(data => {
      const latestVersion = data.version;

      const tagLineParagragh = document.querySelector('div.VPHero.has-image.VPHomeHero > div > div.main > p.tagline')
      const docsReleaseTagSpan = document.createElement('samp')
      docsReleaseTagSpan.classList.add('docs-cn-github-release-tag')
      docsReleaseTagSpan.innerText = latestVersion
      tagLineParagragh?.appendChild(docsReleaseTagSpan)
      console.log(`Latest version of ${packageName}: ${latestVersion}`);
      console.log(`All versions of ${packageName}:`, Object.keys(versions));
    })
    .catch(error => {
      console.error(`Failed to retrieve version for ${packageName}. Error:`, error.message);
    });
}

onMounted(() => {
  getNpmPackageVersion('@winner-fed/winjs')
})
</script>

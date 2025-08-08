---
pagefind-indexed: false

layout: home
title: WinJS
hero:
  name: WinJS
  text: Frontend Development Framework
  tagline: Build your next web application with WinJS
  image:
    src: /images/hero.png
    alt: WinJS
  actions:
    - text: Get Started
      link: /guides/getting-started.html
      theme: brand
    - text: Introduction
      link: /guides/introduce.html
      theme: alt
features:
  - icon: 💎
    title: Simplicity First
    details: Built-in routing, state management, build tools, deployment, testing, linting, and SvgIcon support. Start developing with just one WinJS dependency.
  - icon:  🎁
    title: Feature Rich
    details: One-click creation of Web apps, plugins, mini-programs, H5, and offline packages. Fast development with out-of-the-box functionality. Embraces "convention over configuration" philosophy.
  - icon: 🎉
    title: Extensible
    details: Inspired by UmiJS, implements the complete lifecycle of web application development with plugin architecture. Even WinJS internal features are implemented as plugins.
  - icon: ⚖️
    title: Multiple Build Engines
    details: Provides multiple build solutions including Vite, Webpack, and Rsbuild for developers to choose from, ensuring functional consistency across different engines.
  - icon: 🌴
    title: Complete Routing
    details: Based on vue-router with Nuxt.js-like features. Supports nested routes, dynamic routes, optional dynamic routes, code splitting, and route-based request optimization.
  - icon: 🚄
    title: Future Ready
    details: While meeting current requirements, we never stop exploring new technologies. Built with Vue 3.0 to enhance application performance.
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

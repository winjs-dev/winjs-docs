# WinJS Introduction {#introduce}

<br />
<img src="/images/logo.png" width="120"/>

## What is WinJS?

WinJS is an extensible frontend application framework. It's forked from UmiJS and inherits UmiJS's excellent qualities. At the same time, it also references excellent implementation solutions from many frameworks and build tools, such as [Modern.js](https://modernjs.dev/), [rsbuild](https://rsbuild.dev/), [Fes.js](https://fesjs.mumblefe.cn/), etc.

WinJS is route-based, supporting both configuration-based routing and convention-based routing, ensuring complete routing functionality and extending features based on this foundation. It's then equipped with a comprehensive plugin system with complete lifecycle coverage, spanning from source code to build artifacts, supporting various feature extensions and business requirements.

WinJS has many very interesting features, such as:

1. **Plugin-based architecture** - everything can be modified, WinJS itself is also composed of plugins<br />
2. **Multi-bundler support** - supports Vite, Webpack, and Rsbuild bundling solutions simultaneously<br />
3. Complete routing based on Vue Router<br />
4. Framework-level integration with Vue 3<br />
5. Monorepo best practices<br />
6. Import all from winjs<br />
7. Auto import development mode<br />
...

## When not to use WinJS?

If your project:

1. Needs to support IE 11 or lower browser versions<br />
2. Needs to run in environments below Node 14<br />
3. Has strong webpack customization requirements and subjective preferences<br />
4. Needs to choose different routing solutions<br />
...

WinJS might not be suitable for you.

## Why not?

### Vue CLI

Vue CLI is a complete system for rapid development based on Vue.js, providing interactive scaffolding, rich official plugins, and extensibility through plugins. It provides an excellent experience at the packaging layer, but doesn't include routing and isn't a framework. It's not the same type as meta-frameworks like WinJS, Umi, Nuxt.js, Modern.js, etc. Scaffolding can help us quickly start projects, which is sufficient for individual projects, but not enough for teams. Because using scaffolding is like spilled water - once started, it cannot be iterated. At the same time, the encapsulation and abstraction that scaffolding can provide are very limited.

### UmiJS

WinJS is essentially forked from it. UMI is an application-level framework based on React encapsulation, embodying functional programming thinking. Vue is different - although Vue 3.0 took a big step towards functional programming, people might still prefer writing .vue files rather than .j[t]sx files. These two different thinking approaches lead to some differences in API design. Although UMI has preset-vue, it's still not quite "Vue" enough.

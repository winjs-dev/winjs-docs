# WinJS 介绍 {#introduce}

<br />
<img src="/images/logo.png" width="120" />

##  WinJS 是什么？

WinJS 是可扩展的前端应用框架。Fork 了 UmiJS。继承了 UmiJS 的优秀品质。同时，也参考了诸多框架和构建工具的优秀实现方案，如 [Modern.js](https://modernjs.dev/), [rsbuild](https://rsbuild.dev/), [Fes.js](https://fesjs.mumblefe.cn/) 等。

WinJS 是以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

WinJS 有很多非常有意思的特性，比如。

1、**公司级**，在安全性、稳定性、最佳实践、约束能力方面会考虑更多<br />
2、**插件化**，啥都能改，WinJS 本身也是由插件构成<br />
3、**多 bundler**，同时支持 Vite、Webpack、Rsbuild 打包方案<br />
4、基于 Vue Router 的完备路由<br />
5、Vue3 的框架级接入<br />
6、Monorepo 最佳实践<br />
7、import all from winjs<br />
8、auto import 的研发模式<br />
...


## 什么时候不用 WinJS？

如果你的项目，

1、需要支持 IE 11 或更低版本的浏览器<br />
2、需要跑在 Node 14 以下的环境中<br />
3、有很强的 webpack 自定义需求和主观意愿<br />
4、需要选择不同的路由方案<br />
...

WinJS 可能不适合你。


## 为什么不是？

### Vue CLI

Vue CLI 是基于 Vue.js 进行快速开发的完整系统，提供交互式脚手架、丰富的官方插件，并且可通过插件进行扩展，他在打包层把体验做到了极致，但是不包含路由，不是框架。和 WinJS、Umi、Nuxt.js、Modern.js 等元框架不是同一类型。脚手架可以让我们快速启动项目，对于单一的项目够用，但对于团队而言却不够。因为使用脚手架像泼出去的水，一旦启动，无法迭代。同时脚手架所能做的封装和抽象都非常有限。

### UmiJS

WinJS 本质就是 Fork 它的。UMI 是基于 React 封装的应用级框架，贯彻着函数式编程的思维。而 Vue 有所不同，虽然 Vue 3.0 向函数式迈了一大步，但大家可能依然喜欢编写 .vue文件，而非 .j[t]sx 文件。两种思维方式会导致部分 API 设计上有所差异，虽然 UMI 有 preset-vue ，但依旧不太 "Vue"。

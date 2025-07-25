# 微生成器 {#generator}

WinJS 中内置了众多微生成器，协助你在开发中快速的完成一些繁琐的工作。

## 如何使用

下面的命令会列出目前所有可用的生成器，可以通过交互式方式来选择你使用的功能，都有详细的提示。

```bash
$ win generate
# 或者
$ win g
```

你也可以通过 `win g <generatorName>` 的形式来使用对应的生成器。

## 生成器列表

### Page 页面生成器

快速生成一个新页面，有以下使用方式。

#### 基本使用

交互式输入页面名称和文件生成方式：

```bash
win g page
? What is the name of page? › mypage
? How dou you want page files to be created? › - Use arrow-keys. Return to submit.
❯   mypage/index.{vue,less}
    mypage.{vue,less}
```

直接生成：

```bash
$ win g page foo
Write: src/pages/foo.vue
Write: src/pages/foo.less
```

以目录方式生成页面，目录下为页面的组件和样式文件：

```bash
$ win g page bar --dir
Write: src/pages/bar/index.less
Write: src/pages/bar/index.vue
```

嵌套生成页面：

```bash
$ win g page far/far/away/kingdom
Write: src/pages/far/far/away/kingdom.vue
Write: src/pages/far/far/away/kingdom.less
```

批量生成多个页面：

```bash
$ win g page  page1  page2   a/nested/page3
Write: src/pages/page1.vue
Write: src/pages/page1.less
Write: src/pages/page2.vue
Write: src/pages/page2.less
Write: src/pages/a/nested/page3.vue
Write: src/pages/a/nested/page3.less
```

#### 对页面模板内容进行自定义

如果页面生成器使用的默认模板不符合你的需求，你可以对模板内容进行自定义设置。

执行 `--eject` 命令：

```bash
$ win g page --eject
```

执行命令后，页面生成器会把它的原始模板写入到项目的 `/templates/page` 目录：

```
.
├── package.json
└── templates
    └── page
        ├── index.less.tpl
        └── index.vue.tpl
```

##### 使用模板变量

两个模板文件都支持模板语法，你可以像下面这样插入变量：

```vue
<script setup>
import { ref } from 'vue';

const message = '{{{msg}}}'
const count = {{{count}}}
</script>

<template>
  <div class="page page-{{{name}}}">
    <div class="page-content">
      {{{ name }}}
    </div>
  </div>
</template>

<style src="./index{{{ cssExt }}}"></style>
```

可以自定义参数值：

```bash
$ win g page foo --msg "Hello World" --count 10
```
运行命令后，生成的页面内容如下：

```vue
<script setup>
import { ref } from 'vue';

const message = 'Hello World'
const count = 10
</script>

<template>
  <div class="page page-foo">
    <div class="page-content">
      foo
    </div>
  </div>
</template>

<style src="./index.less"></style>
```

如果你不需要使用模板变量，可以省略 `.tpl` 后缀名，将 `index.vue.tpl` 简写为 `index.vue`，`index.less.tpl` 简写为 `index.less`。

##### 预设变量

在上一小节生成的内容中，我们并没有指定 `name`，但它被还是设置值了。这是因为它属于模板中预设的变量，下面是目前页面模板所有的预设变量：

|参数|默认值|说明|
|:-:|:-:|:-|
| `name` | - | 当前文件的名称。如果执行 `pnpm win g page foo`，会生成 `pages/foo.vue` 和 `pages/foo.less` 两个文件，其中 `name` 的值为 "foo"。 |
| `color` | - | 随机生成一个 RGB 颜色。 |
| `cssExt` | `less` | 样式文件的后缀名。 |

如果想了解更多模板语法的内容，请查看 [mustache](https://www.npmjs.com/package/mustache)。

##### `dir` 模式

在不使用 `dir` 模式的情况下，如果你的页面模板文件夹只自定义了一个模板文件，缺失的文件会自动选取默认的模板文件。

如果使用 `dir` 模式，它的生成内容会和你的页面自定义模板文件夹保持一致，只有在页面自定义模板文件夹为空时才使用默认模板。如果你的页面自定义模板文件夹内容如下：

```
.
├── a.vue
└── index.vue.tpl
```

生成的目录将是：

```
.
├── a.vue
└── index.vue
```

##### 回退

如果还想继续使用默认的模板，可以指定 `--fallback`，此时不再使用用户自定义的模板：

```bash
$ win g page foo --fallback
```

### Component 组件生成器

在 `src/components/` 目录下生成项目需要的组件。和页面生成器一样，组件生成器也有多种生成方式。

#### 基本使用

交互式生成：
```bash
$ win g component
✔ Please input you component Name … foo
Write: src/components/Foo/index.js
Write: src/components/Foo/Foo.vue
```

直接生成：
```bash
$ win g component bar
Write: src/components/Bar/index.js
Write: src/components/Bar/Bar.vue
```

嵌套生成：
```bash
$ win g component group/subgroup/baz
Write: src/components/group/subgroup/Baz/index.js
Write: src/components/group/subgroup/Baz/Baz.vue
```

批量生成：
```bash
$ win g component apple banana orange
Write: src/components/Apple/index.js
Write: src/components/Apple/Apple.vue
Write: src/components/Banana/index.js
Write: src/components/Banana/Banana.vue
Write: src/components/Orange/index.js
Write: src/components/Orange/Orange.vue
```

#### 对组件模板内容进行自定义

与[页面生成器](#对页面模板内容进行自定义)相同，组件生成器也支持对模板内容自定义。首先，先将原始模板写入到项目的 `/templates/component` 目录：

```bash
$ win g component --eject
```

##### 使用模板变量

```bash
$ win g component foo --msg "Hello World"
```

自定义组件模板可以省略 `.tpl` 后缀名。你可以将 `index.js.tpl` 简写为 `index.js`，`component.vue.tpl` 简写为 `component.vue`。

组件生成器将生成与你的自定义模板文件夹相一致的内容，你可以根据需要添加更多的自定义模板文件。

##### 预设变量

|参数|默认值|说明|
|:-:|:-:|:-|
| `compName` | - | 当前组件的名称。如果执行 `pnpm win g component foo`， `compName` 的值为 `Foo`。 |

##### 回退

```bash
$ win g component foo --fallback
```

### RouteAPI 生成器

生成 routeAPI 功能的模板文件。

交互式生成：
```bash
$ win g api
✔ please input your api name: … starwar/people
Write: api/starwar/people.ts
```

直接生成:
```bash
$ win g api films
Write: api/films.ts
```

嵌套生成器：
```bash
$ win g api planets/[id]
Write: api/planets/[id].ts
```

批量生成：
```bash
$ win g api spaceships vehicles species
Write: api/spaceships.ts
Write: api/vehicles.ts
Write: api/species.ts
```

### Mock 生成器

生成 [Mock](./mock) 功能的模板文件，mock 的具体实现参考[文档](./mock)。

交互式生成：
```bash
$ win g mock
✔ please input your mock file name … auth
Write: mock/auth.ts
```

直接生成:
```bash
$ win g mock acl
Write: mock/acl.ts
```

嵌套生成:
```bash
$ win g mock users/profile
Write: mock/users/profile.ts
```

### Prettier 配置生成器

为项目生成 [prettier](https://prettier.io/) 配置，命令执行后，WinJS 会生成推荐的 prettier 配置和安装相应的依赖。

```bash
$ win g prettier
info  - Write package.json
info  - Update package.json for scripts
info  - Write .prettierrc.js
info  - Write .prettierignore
```

然后，可以直接执行命令 `npm run format` 格式化项目中的相关代码风格。

[//]: # (### Jest 配置生成器)

[//]: # ()
[//]: # (为项目生成 [jest]&#40;https://jestjs.io/&#41; 配置，命令执行后，`win` 会生成 Jest 配置和安装相应的依赖。根据需要选择是否要使用 [@testing-library/vue]&#40;https://www.npmjs.com/package/@testing-library/vue&#41; 做 UI 测试。)

[//]: # ()
[//]: # (```bash)

[//]: # ($ win g jest)

[//]: # (✔ Will you use @testing-library/vue for UI testing?! … yes)

[//]: # (info  - Write package.json)

[//]: # (info  - Write jest.config.ts)

[//]: # (```)

### Tailwind CSS 配置生成器 

为项目开启 [Tailwind CSS](https://tailwindcss.com/) 配置，命令执行后，`win` 会生成 Tailwind CSS 和安装相应的的依赖。

```bash
$ win g tailwindcss
info  - Write package.json
set config:tailwindcss on /Users/win/playground/.winrc.ts
set config:plugins on /Users/win/playground/.winrc.ts
info  - Update .winrc.ts
info  - Write tailwind.config.js
info  - Write tailwind.css
```

### Precommit 配置生成器

为项目生成 [precommit](https://typicode.github.io/husky) 配置，命令执行后，`win` 会为我们添加 husky 和 Git commit message 格式校验行为，在每次 Git commit 前会将 Git 暂存区的代码默认格式化。

> 注意：如果是初始化出来的 `app`, `pc` 项目，通常不需要该生成器，因为已经配置好 husky 了

```bash
$ win g precommit
info  - Update package.json for devDependencies
info  - Update package.json for scripts
info  - Write .lintstagedrc
info  - Create .husky
info  - Write commit-msg
info  - Write pre-commit
```

### Huipro1.0 配置生成器

hui pro 1.0 是**财富中台**或**操作员中心**作为统一外框架，项目根据其打包规范集成至统一外框架中运行，通常是通过 see 平台进行部署，故而框架中默认集成 see 发布物打包格式，并提供两种打包命令如下：

```bash
"child": "node --max_old_space_size=4096 build/bundle/build.child.js",
"build:see:child": "npm run child && win see --hui-pro"
```

- `npm run child` 命令可构建用于财富中台外框架执行的子系统包，需手动上传至服务器。
- `npm run build:see:child` 命令可构建用于 see 平台发布的子系统包。

同时，为防止样式冲突，项目会默认引入 `public/frame` 文件夹。该文件夹对应子系统运行所在主系统的样式文件，开发时，可根据主框架的不同，自行修改其文件内容。

::: warning 注意

- hui pro 1.0 打包入口为 `index.pro.js`，本地环境运行入口为 `app.t[j]s`，在修改 `app.t[j]s` 时，需检查是否在 `index.pro.js` 进行修改，防止本地和部署环境出现功能不一致的现象。
:::

```bash
$ win g huipro
info  - Update package.json for devDependencies
info  - Update package.json for scripts
info  - Update package.json for scripts
info  - Update package.json for scripts
info  - Update package.json for scripts
Write: build/bundle/build.child.js
Write: build/bundle/utils.js
Write: build/bundle/webpack.child.conf.js
Copy:  generatorHuiRouterFile.ts
Copy:  generatorSysconfig.ts
Copy:  utils.ts
Write: public/app.css
Write: public/vendors_frame/app.css
Write: src/index.pro.js
Copy:  appConfig.ts
Copy:  config.ts
Copy:  proxy.ts
Copy:  routes.ts
Write: src/components/FrameLayout/index.vue
Write: src/components/QuickNavigation/index.vue
Copy:  constant.js
Copy:  layouts/index.vue
Copy:  services/autoMatchBaseUrl.js
Copy:  services/request.js
Copy:  services/RESTFULURL.js
Copy:  utils/autoLogin.js
Copy:  utils/bizSecurity.js
Copy:  utils/checkIsHwsContainer.js
Copy:  utils/customRouter.js
Copy:  utils/menuAuth.js
warn  - 🚨 Note that some files may be overwritten.
```

::: warning 注意
- 请注意备份文件，以上方式会覆盖项目已存在的文件，如 `src/constant.js` 、 `src/services/**`。
:::

### Uno CSS 配置生成器 {#unocss}

为项目开启 [UnoCSS](https://github.com/unocss/unocss) 配置，命令执行后，winJS 会生成 Uno CSS 和安装相应的的依赖。

```bash
$ win g unocss
info  - Update package.json for devDependencies
set config:unocss on /.winrc.ts
set config:plugins on /.winrc.ts
info  - Update .winrc.ts
info  - Write uno.config.ts
```

# 版本升级 {#upgrade}

## 从 0.19.x 升级到 1.0.0

> 适用范围：业务项目从 WinJS 0.19.x 升级至 1.0.0。`1.0.0-rc.x` 预发布版本（`next` tag）已包含以下全部变更，可提前灰度验证。
>
> 一句话结论：**结构性影响为零**（运行时依赖、产物形态、Node 版本口径均不变），新增 Svelte 5 框架支持与 clientLoader 路由数据加载；有 **6 项行为变更**需要知悉，其中 2 项可能需要对照自查，其余为修复性质、无需动作。

### 兼容性总览

| 维度 | 变化 | 业务项目需要做什么 |
|------|------|------|
| 运行时依赖 | 存量 17 个包的 `dependencies` / `peerDependencies` **零变动**（仅新增 2 个 Svelte 包，不用即不装） | 无 |
| 产物形态 | CommonJS + es2019 目标、engines `>=20.19`、目录布局均不变 | 无 |
| Node.js | 业务项目运行 `>=20.19` 不变（`>=22.12` 只约束框架仓库贡献者） | 无 |
| TypeScript | 产物类型面实测支持 **>=4.9**（建议 5.x） | 基本无（TS <4.9 的项目建议升级） |
| MFSU | 已于 0.19.1 移除（本版本延续）；残留的 `mfsu` 配置键全链路静默忽略 | 从 0.19.1 之前版本升级的，删除残留配置即可 |
| 构建工具链 | 框架仓库 father → tsdown、jest → vitest 均为**仓库内部变更**，预打包依赖产物逐字节等价 + 运行时用例验证 | 无 |

### 行为变更清单（共 6 项）

#### 1. Vue 3 链路由匹配默认放宽（尾斜杠不再 404）⚠️ 可能需要自查

[`history.strict`](../config/config#history) 默认值由 `true` 改为 `false`（与 Vue 2 / Svelte 链对齐）。此前 `/about/` 会 404，现在与 `/about` 命中同一路由。

- **谁会感知**：Vue 3 项目中存在尾斜杠访问路径、或依赖「尾斜杠 404」行为的路由守卫/埋点逻辑
- **需要做什么**：绝大多数项目无需动作（这是修复）；确需旧行为的，在 `.winrc.ts` 配置 `history: { strict: true }` 恢复

#### 2. Vite 链构建失败不再静默通过 ⚠️ 可能需要自查

此前 Vite 链构建报错会被吞掉并以 exit 0 结束（CI 假绿）；现在如实以非零退出码失败。

- **谁会感知**：Vite 链项目若存在**潜伏的构建错误**（例如 `@vitejs/plugin-legacy` 场景，本版本同时修复了其必挂问题），升级后 CI 可能首次变红
- **需要做什么**：修复构建错误本身——这不是回归，是此前被掩盖的真实问题暴露

#### 3. rsbuild / rsbuild2 链 `extraBabel*` 配置真实生效

此前用户与插件经 `extraBabelPlugins` / `extraBabelPresets` 注入的 babel 插件在 rsbuild 系链路被静默丢弃；本版本补齐契约，真实应用（含运行时插件 `api.addExtraBabelPlugins()`）。

- **谁会感知**：rsbuild / rsbuild2 项目曾配置过 extraBabel 系选项
- **需要做什么**：验证这些插件生效后的产物行为是否符合预期（此前它们从未生效过）

#### 4. `patchClientRoutes` / `onRouteChange` 运行时钩子复活

此前这两个钩子在全链路无触发点（注册了也不生效）；本版本三个框架渲染器均补齐触发，用法见[路由文档](./routes#patchclientroutes-routes)。

- **谁会感知**：运行时插件（`app.ts` 导出具名钩子）中注册过这两个钩子的项目——处理器会开始真正执行
- **需要做什么**：确认处理器逻辑正确（它们大多为此目的而写，复活即生效）

#### 5. rsbuild 系残留 `mfsu` 配置从报错改为静默忽略

统一各 bundler 行为：业务侧残留 `mfsu` 配置一律静默忽略（原 rsbuild 系会 assert 报错）。

- **需要做什么**：无（更宽松）；顺手删除残留配置更干净

#### 6. 浏览器兼容数据（caniuse-lite）刷新 22 个月

消除每次 dev/build 的 Browserslist 陈旧数据告警；browserslist 目标微移，CSS 产物可能有边际性差异。

- **需要做什么**：无（低风险；对产物体积敏感的项目可对比一次构建产物）

### 新增能力

- **Svelte 5 框架支持**：`@winner-fed/preset-svelte` + `@winner-fed/renderer-svelte` 两个新包，四条构建链路（Vite / rsbuild / rsbuild2 / webpack）全通，详见[使用 Svelte](./svelte.md)。不用 Svelte 的项目完全无感。
- **clientLoader 路由数据加载**：页面导出 `clientLoader` 函数，路由组件就绪后自动执行，返回值经 `useLoaderData()` 消费，三框架链统一，详见[路由数据加载](./client-loader.md)。
- **路由能力补齐**：守卫 API 三链统一（`onRouterCreated`）、[`title`](../config/config#title) 支持 `%s` 模板按路由 `meta.title` 填充、[`history.strict` / `history.sensitive`](../config/config#history) 匹配语义配置化、[`typedRoutes`](../config/config#typedroutes) 生成式路由类型（opt-in）、配置式路由缺 catch-all 时构建告警。

### 升级步骤

```bash
# 1. 升级框架（@winner-fed 系版本联动，装主包即可）
pnpm up --latest @winner-fed/winjs
# 使用 npm：npm install @winner-fed/winjs@latest

# 2. 按行为变更清单自查（重点是 1、2 两项）

# 3. 回归验证
pnpm dev    # 本地开发冒烟：路由跳转 / 尾斜杠路径 / 数据请求
pnpm build  # 生产构建（确认 exit code 与产物 diff 符合预期）
```

::: tip 提示
基于 `@winner-fed/winjs` 开发第三方插件的，重点自查行为变更 3、4（extraBabel 注入与运行时钩子复活对插件的语义影响），API 面本身无破坏性变更。
:::

### 常见问题

**Q：Node 20 的构建环境还能用吗？**
能。发布产物为 es2019、engines 声明 `>=20.19`，本次未收紧业务项目侧口径。

**Q：旧项目必须改代码吗？**
大概率零改动。结构性 API 面无破坏性变更；按行为变更清单自查即可，6 项中 4 项为纯修复无需动作。

**Q：从 0.18.x 或更早版本升级？**
先按 0.19.x 系列公告处理 MFSU 移除（0.19.1 起）等变更，再套用本节内容。rsbuild2 外置构建器等 0.19 系列能力见对应版本 CHANGELOG。

## 官方包

WinJS 所有的官方包目前都使用统一版本号进行发布。

| 包名                        | 版本                                                                                                         |
|---------------------------|------------------------------------------------------------------------------------------------------------|
| @winjs-dev/create-win    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |
| @winner-fed/preset-vue    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fpreset-vue?style=flat-square&colorB=646cff)    |
| @winner-fed/preset-vue2   | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fpreset-vue2?style=flat-square&colorB=646cff)   |
| @winner-fed/renderer-vue  | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Frenderer-vue?style=flat-square&colorB=646cff)  |
| @winner-fed/renderer-vue2 | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Frenderer-vue2?style=flat-square&colorB=646cff) |
| @winner-fed/winjs         | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |

## 使用 Taze

我们推荐使用 [Taze](https://github.com/antfu-collective/taze) 来升级 WinJS 的版本，这是一个用于升级 npm 依赖版本的 CLI
工具。

### 用法

运行以下命令来升级所有名称中包含 `winner-fed` 的依赖：

```bash
npx taze --include /winner-fed/ -w
```

运行结果类似于：

```bash
winner-fed - 3 patch

  @winner-fed/core               dev  ~2mo  ^0.9.0  →  ^0.9.4
  @winner-fed/plugin-vue       dev  ~2mo  ^0.9.0  →  ^0.9.4
  @winner-fed/plugin-vue2  dev  ~2mo  ^0.9.0  →  ^0.9.4

ℹ changes written to package.json, run npm i to install updates.
```

你也可以调整 `include` 来匹配不同的包，比如仅升级 `@winner-fed` scope 下的包：

```bash
npx taze --include /@winner-fed/ -w
```

### 选项

下面是一些使用 taze 选项的示例。

- 在 monorepo 中，你可以添加 `-r` 选项来递归升级：

```bash
npx taze --include /winner-fed/ -w -r
```

- 添加 `-l` 来升级被锁定的版本：

```bash
npx taze --include /winner-fed/ -w -l
```

- 升级 major 版本：

```bash
npx taze major --include /winner-fed/ -w
```

> 更多选项请参考 [taze 文档](https://github.com/antfu-collective/taze)。
>

## 锁定子依赖

当项目某个子依赖出现问题，可能会导致 WinJS 或者项目工程无法更新，此时可以使用包管理器锁定子依赖版本。

### pnpm

对于使用 pnpm 的项目，请在**项目根目录**的 `package.json` 中添加以下配置，然后重新执行 `pnpm install`：

```json title="package.json"
{
  "pnpm": {
    "overrides": {
      "package-name": "^1.0.0"
    }
  }
}
```

### Yarn

对于使用 Yarn 的项目，请在**项目根目录**的 `package.json` 中添加以下配置，然后重新执行 `yarn install`：

```json title="package.json"
{
  "resolutions": {
    "package-name": "^1.0.0"
  }
}
```

### Npm

对于使用 Npm 的项目，请在**项目根目录**的 `package.json` 中添加以下配置，然后重新执行 `npm install`：

```json title="package.json"
{
  "overrides": {
    "package-name": "^1.0.0"
  }
}
```

::: tip 提示
对于 Monorepo 仓库，只能在项目根目录的 package.json 中锁定依赖版本，并且会影响 Monorepo 中的所有 package。
:::


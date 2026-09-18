# Rsbuild2 模式 <Badge type="tip" text=">=0.19.0" />

Rsbuild2 模式基于 [Rsbuild 2.x](https://rsbuild.rs/)（底层 [Rspack 2.x](https://rspack.rs/)）构建，与 [Rsbuild 模式](./rsbuild.md)（Rsbuild 1.x）相互独立、互不影响。

与内置的 Webpack / Vite / Rsbuild 构建器不同，Rsbuild2 是**外置构建器**：它不包含在 `@winner-fed/preset-win` 的依赖中，需要业务项目按需安装。带来的好处是：

- 未使用 rsbuild2 的项目完全不感知它的存在，`node_modules` 体积和安装时间零增加；
- 版本演进独立于 WinJS 主版本，可第一时间跟进 Rsbuild 2.x 生态；
- 卸载包并移除配置即可回退到其他构建器，实现热插拔。

## 环境要求

- **Node.js `^20.19.0 || >=22.12.0`**：Rsbuild 2.x 的硬性要求（`@rsbuild/core` 2.x 为纯 ESM 包）。启用 rsbuild2 时 WinJS 会在启动阶段自动校验，不满足则直接报错。
- 需要在项目中安装 `@winner-fed/bundler-rsbuild2`。

## 开启 Rsbuild2 模式

第一步，安装外置构建器：

```bash
pnpm add -D @winner-fed/bundler-rsbuild2
```

第二步，在配置文件 `.winrc` 中启用：

```ts
export default {
  rsbuild2: {
    removeConsole: true
  }
}
```

如果未安装 `@winner-fed/bundler-rsbuild2` 就配置了 `rsbuild2`，WinJS 会报错并提示安装命令。

**注意**：

- `rsbuild2` 与 `vite`、`rsbuild` 互斥，不可同时开启；
- 启用后 `mfsu`、`hmrGuardian` 会自动关闭（与 Rsbuild 模式行为一致）；
- 暂不支持 `mpa` 多页应用与 `mdx`。

## 配置选项

- **类型**：`{ removeConsole: boolean | ConsoleType[], lightningcssLoader: boolean | Rspack.LightningcssLoaderOptions | Function }`
- **默认值**：`false`

- `removeConsole`：生产环境构建时是否自动移除代码中的 `console.[methodName]`。默认为 `false`；设置为 `true` 移除所有类型，也可传数组（如 `['log', 'info']`）选择性移除。
- `lightningcssLoader`：参考 [lightningcssLoader](https://rsbuild.dev/zh/config/tools/lightningcss-loader)。默认为 `true`。

### 透传原生 Rsbuild 配置

需要使用 Rsbuild 原生配置时，可通过 `rsbuild2.config` 透传，与内置 Rsbuild 配置深度合并：

```ts
export default {
  rsbuild2: {
    removeConsole: true,
    config: {
      tools: {
        // 原生 Rsbuild 2.x 配置
      }
    }
  }
}
```

## 与 Rsbuild 模式的行为差异

Rsbuild 2.x 相对 1.x 有若干破坏性变更，WinJS 已在翻译层对齐默认行为，以下是用户可感知的差异：

| 差异点 | Rsbuild 模式（1.x） | Rsbuild2 模式（2.x） |
| --- | --- | --- |
| 构建分析 | `ANALYZE=1` 启动 bundle analyzer | 不再支持，输出警告并建议使用 [Rsdoctor](https://rsdoctor.dev/) |
| moment locale | `performance.removeMomentLocale` | 由 Rspack `IgnorePlugin` 实现，默认行为一致 |
| dev server host | 默认 `0.0.0.0` | 显式透传 host，保持一致行为 |
| proxy `changeOrigin` | 默认 `false` | 显式补 `false`，保持一致行为；事件处理器（`onProxyReq` 等）需写在 `on` 对象中 |
| 浏览器默认目标 | Chrome 87 / Safari 14 等 | 升级为 Chrome 107 / Safari 16 等（Baseline 2025），如需旧行为请显式配置 `targets` |
| `core-js` | 内置依赖 | 改为可选依赖，使用 `output.polyfill` 时需自行安装 |
| 自定义 loader 挂载点（`modifyBundlerChain`） | `CHAIN_ID.RULE.JS` / `RULE.CSS` | 需改用 `CHAIN_ID.ONE_OF.JS_MAIN` / `CSS_MAIN` |

## 从 Rsbuild 模式迁移

1. 确认 Node.js 版本满足 `^20.19.0 || >=22.12.0`；
2. 安装外置构建器：`pnpm add -D @winner-fed/bundler-rsbuild2`；
3. 配置项从 `rsbuild` 改为 `rsbuild2`（选项结构一致）；
4. 检查自定义插件中 `modifyBundlerChain` 的 loader 挂载点是否需要迁移至 `ONE_OF` 分支（见上表）；
5. 原依赖 `ANALYZE` 环境变量做产物分析的，改用 [Rsdoctor](https://rsdoctor.dev/)；
6. 显式配置 `targets` 固定浏览器目标，避免默认目标升级影响产物兼容性。

## 插件与生态兼容

Rsbuild2 复用全局的 `modifyRsbuildConfig`、`modifyRspackConfig`、`modifyBundlerChain` 钩子，既有的 Rspack 生态插件可直接使用。

框架侧的 Vue 支持要求（自 `0.19.0` 起）：

- Vue 2：`@winner-fed/preset-vue2`（内置 `@rsbuild/plugin-vue2@1.2.0`，双兼容 Rsbuild 1/2）；
- Vue 3：`@winner-fed/preset-vue`（内置 `@rsbuild/plugin-vue@1.2.9`，双兼容 Rsbuild 1/2）。

### 常用插件兼容性（实测）

| 插件 | rsbuild2 支持情况 | 说明 |
| --- | --- | --- |
| plugin-request / plugin-pinia / plugin-vuex / plugin-locale / plugin-access / plugin-antdv / plugin-element-* / plugin-vant / plugin-hui / plugin-keepalive / plugin-mobile-layout / plugin-viewport / plugin-watermark / plugin-wconsole / plugin-confetti / plugin-did-you-know / plugin-openapi / plugin-run / plugin-winui / plugin-tailwindcss / plugin-web-update-notification / plugin-assets-retry | ✅ 完全兼容 | 仅依赖 runtime 插件 / tmpFiles / HTML 钩子 / 外部 CLI 等与 bundler 无关的通道 |
| plugin-unocss | ✅ 兼容（自插件修复版起） | rsbuild2 模式走 `@unocss/postcss`（extraPostCSSPlugins）集成，已实测生成工具类 CSS |
| plugin-code-inspector | ✅ 实测兼容 | rspack 适配层在 Rspack 2.x 下正常注入（dev 产物已验证） |
| plugin-unicons | ✅ 集成链路验证通过 | unplugin 的 rspack loader 拦截 `~icons/*` 正常 |
| plugin-check-syntax | ⚠️ 暂无法验证 | 被上游 `@winner-fed/unplugin-check-syntax` 的依赖打包问题阻塞（与 bundler 无关，webpack 模式同样受影响） |
| plugin-remove-console | ➖ 不生效 | rsbuild 系请使用原生 `rsbuild2.removeConsole` 配置 |
| plugin-qiankun / plugin-hui-micro-app（子应用） | ➖ 不生效 | 依赖 webpack Module Federation 链路（rsbuild 1.x 现状相同） |
| plugin-css-assets-local | ➖ 不生效 | 依赖 extract-css-assets-webpack-plugin（rsbuild 1.x 现状相同） |
| plugin-icons-legacy | ❌ 不可用 | svg-sprite-loader 与 rspack 的 ModuleGraph 时序不兼容，rsbuild 1.x / 2.x 行为一致（存量限制） |

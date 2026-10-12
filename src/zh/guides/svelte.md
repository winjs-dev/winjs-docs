# 使用 Svelte

WinJS 从 1.0.0 起支持 [Svelte 5](https://svelte.dev) 框架（实验性），与 Vue 2 / Vue 3 并列为一等公民框架。

## 支持矩阵

| 能力 | Vite | Rsbuild | Rsbuild 2 | Webpack 5 |
| --- | --- | --- | --- | --- |
| 约定式 / 配置式路由 | ✅ | ✅ | ✅ | ✅ |
| 全局 layout / 动态路由 | ✅ | ✅ | ✅ | ✅ |
| autoImport / routeProps | ✅ | ✅ | ✅ | ✅ |
| clientLoader 数据加载 | ✅ | ✅ | ✅ | ✅ |
| HMR | ✅ | ✅ | ✅ | ❌（降级整页刷新） |

其他限制：`icons` 配置暂不支持（图标组件为 Vue 实现，启用时会显式报错）；`mpa` 的 `layout` 配置暂不支持（告警并忽略）。

## 快速开始

推荐使用脚手架创建 Svelte 项目：

```bash
pnpm create win my-svelte-app
# 选择 Svelte App 模板（Svelte 5）
```

手动接入现有项目时，安装 `svelte@^5` 与 `@winner-fed/preset-svelte` 后，WinJS 会在未检测到 Vue 依赖且存在 `svelte@^5` 时自动装配 preset；也可在 `.winrc.ts` 显式声明：

```ts
import { defineConfig } from 'win';

export default defineConfig({
  presets: [require.resolve('@winner-fed/preset-svelte')],
});
```

## 路由

路由体系与 Vue 链完全一致：约定式路由（`src/pages` 目录）与配置式路由（`routes` 配置）双模式，`$id` 为动态段、`src/layouts/index.svelte` 为全局布局。

```ts
// src/pages/users/$id.svelte —— 约定式动态路由 /users/:id
<script lang="ts">
  import { useRoute } from 'winjs';

  const routeStore = useRoute();
  const route = $derived($routeStore);
</script>

<h2>用户详情</h2>
<p>参数 id = {route?.params.id}</p>
<p>query tab = {route?.query.tab ?? '（无）'}</p>
```

布局内用 `RouteOutlet` 渲染子路由、`RouterLink` 声明导航：

```svelte
<script lang="ts">
  import { RouteOutlet, RouterLink } from 'winjs';
</script>

<nav>
  <RouterLink to="/" activeClass="active">首页</RouterLink>
  <RouterLink to="/users/42" activeClass="active">用户</RouterLink>
</nav>
<main>
  <RouteOutlet />
</main>
```

`RouterLink` 的 `activeClass` 为可选属性：当前路由与 `to` 的 pathname 精确匹配时追加该类名；不传则不注入任何 active 类。

### 导航守卫

三链（Vue 3 / Vue 2 / Svelte）统一约定：在运行时配置 `onRouterCreated` 中拿到 router 实例注册守卫，语义与 vue-router 对齐——返回 `false` 取消导航、返回路径或 Location 对象改道、返回空值放行：

```ts
// src/app.ts
export function onRouterCreated({ router }: any) {
  router.beforeEach((to: any, from: any) => {
    if (to.pathname === '/secret' && !isLoggedIn()) {
      return '/login';
    }
  });
}
```

路由变化监听用 `onRouteChange`（含 `isFirst` 标记首次导航）；客户端路由树可在渲染前经 `patchClientRoutes` 修补。

## 数据加载（clientLoader）

页面 module 级 `<script>` 导出 `clientLoader` 即为路由声明数据加载（需开启 `clientLoader: {}` 配置，跨框架语义与缓存行为详见[路由数据加载](./client-loader.md)）。加载期间渲染 `loadingComponent` 边界（或全局 loading），完成后组件经 `useLoaderData()` 消费返回值：

```svelte
<script module lang="ts">
  export async function clientLoader({ params, query }: any) {
    const res = await fetch(`/api/users/${params.id}`);
    return { user: await res.json() };
  }
</script>

<script lang="ts">
  import { useLoaderData } from 'winjs';

  const loaderData = useLoaderData();
  const data = $derived($loaderData);
</script>

{#if data}
  <h2>{data.user.name}</h2>
{/if}
```

执行结果按「叶子路由 + 完整 location」缓存，相同位置的重复导航直接命中缓存。

## 路由属性（routeProps）

约定式路由下，页面内声明 `definePageMeta` 即可注入路由属性（`meta`、`name` 等），构建期提取、无运行时开销：

```svelte
<script lang="ts">
  import { definePageMeta } from '@@/plugin-svelte-route-props';

  definePageMeta({
    meta: { title: '关于' },
  });
</script>
```

配合全局 `title` 模板（含 `%s` 占位）可实现路由级标题：`title: '%s - WinJS'` 时，命中 `meta.title` 的路由会把 `document.title` 更新为 `关于 - WinJS`。

## 自动导入（autoImport）

默认开启。`onMount`、`beforeUpdate`、`writable`、`derived` 等 Svelte API 与框架路由 API（`useRoute`、`useRouter`）无需手动 import：

```svelte
<script lang="ts">
  // 无需 import { onMount } from 'svelte'
  onMount(() => console.log('mounted'));
</script>
```

可通过 `autoImport: false` 关闭，或经 `autoImport.unImports` 自定义（见 [autoImport 配置](/zh/config/config#autoimport)）。

## 链路选择与匹配语义

四条构建链路的配置与 Vue 链一致（`vite: {}` / `rsbuild: {}` / `rsbuild2: {}` / 默认 webpack）。路由匹配语义经 `history` 配置：

```ts
export default defineConfig({
  history: {
    type: 'browser',
    strict: false, // 尾斜杠是否严格（默认 false：/users/ 与 /users 等价）
    sensitive: false, // 是否大小写敏感（默认 false）
  },
});
```

Webpack 链注意事项：Svelte 5 无 HMR 支持，开发时文件变更会整页刷新（svelte-loader 限制）；生产构建经 `emitCss` 抽取独立 CSS 资产。svelte-loader 的编译选项可经 `svelte.svelteLoaderOptions` 配置。

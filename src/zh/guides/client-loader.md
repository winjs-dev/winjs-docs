# 路由数据加载

WinJS 提供路由级的数据加载方案 `clientLoader`：在页面文件中额外导出一个 `clientLoader` 函数，路由组件就绪后自动执行，返回值经 `useLoaderData()` 在组件内消费。Vue 3 / Vue 2 / Svelte 三条框架链路语义一致。

它把「组件挂载后再在生命周期里取数」的串行流程，收敛为「组件模块加载 → loader 取数 → 渲染」的声明式流程，加载期间渲染 loading 边界，数据就绪后才渲染页面组件。

## 启用方式

配置开启：

```ts
// .winrc.ts
export default {
  clientLoader: {}
}
```

## 使用方式

### Vue 3

在 `.vue` 页面的普通 `<script>` 块中导出 `clientLoader`（可与 `<script setup>` 共存，`<script setup>` 内不允许 `export`）：

```vue
<script>
export async function clientLoader({ route, params, query }) {
  const res = await fetch(`/api/users/${params.id}`);
  return { user: await res.json() };
}
</script>

<script setup>
import { useLoaderData } from 'winjs';
const data = useLoaderData();
</script>

<template>
  <h2 v-if="data">{{ data.user.name }}</h2>
</template>
```

`useLoaderData()` 返回一个 computed，未就绪或失败时为 `undefined`。

### Vue 2

页面写法与 Vue 3 相同（普通 `<script>` 导出）。Vue 2 无组合式 API，`useLoaderData()` 需包一层 `computed` 获得响应性：

```vue
<script>
export async function clientLoader({ route, params, query }) {
  const res = await fetch(`/api/users/${params.id}`);
  return { user: await res.json() };
}
</script>

<script setup>
import { computed } from 'vue';
import { useLoaderData } from 'winjs';
const data = computed(() => useLoaderData());
</script>

<template>
  <h2 v-if="data">{{ data.user.name }}</h2>
</template>
```

### Svelte

在页面 module 级 `<script>` 中导出（实例 `<script>` 的导出是组件 props，不作数）：

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

### JS / TS 页面

非 SFC 页面（`.ts` / `.tsx` / `.js` / `.jsx`）直接具名导出：

```tsx
export async function clientLoader({ params, query }) {
  const res = await fetch(`/api/users/${params.id}`);
  return { user: await res.json() };
}
```

## loader 函数签名

三链统一：

```ts
export async function clientLoader(ctx: {
  route: RouteLocation;      // 当前路由（各框架原生路由对象）
  params: Record<string, string>;
  query: Record<string, string>;
}) {
  return data; // 任意可序列化值，经 useLoaderData() 消费
}
```

## loading 边界

loader 执行期间渲染全局 loading 组件。通过约定文件 `src/loading.(js|ts)` 提供（default 导出一个组件），未提供时边界渲染为空：

```ts
// src/loading.js
import { h } from 'vue';
export default {
  render() {
    return h('div', 'loading...');
  }
};
```

loader 抛错时边界渲染错误信息（`Failed to load data: <message>`），页面组件不渲染；路由组件模块加载失败时同理（`Failed to load route: <message>`）。

## 缓存语义

loader 结果按「叶子路由 path + 完整地址（含 query）」缓存：

- 同一地址重复导航（含浏览器前进/后退回到该地址）命中缓存，不重复执行
- query 变化（如 `/users?page=1` → `/users?page=2`）视为新地址，重新执行
- 失败结果同样缓存，重复导航命中时维持错误呈现

需要强制刷新数据时，可在 query 上携带时间戳等标记。

## 注意事项

- `.vue` 页面的 `clientLoader` 必须声明在普通 `<script>` 块（`<script setup>` 不允许 `export`）；纯 `<script setup>` 页面需额外补一个普通 `<script>` 块
- 纯普通 `<script>`（无 `<script setup>`）的 `.vue` 页面仍需 `export default` 页面组件本身
- loader 在**路由组件模块就绪后**执行（与渲染串行）；跨嵌套路由层级的并行预取当前不支持

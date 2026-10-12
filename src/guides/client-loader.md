# Route Data Loading

WinJS provides a route-level data loading mechanism `clientLoader`: export an extra `clientLoader` function from a page file, it runs automatically after the route component module is ready, and its return value is consumed in the component via `useLoaderData()`. Vue 3 / Vue 2 / Svelte framework chains share the same semantics.

It turns the sequential flow of "mount the component, then fetch data in a lifecycle hook" into a declarative "load component module → run loader → render" flow: a loading boundary renders while loading, and the page component renders only after the data is ready.

## Enabling

Enable via config:

```ts
// .winrc.ts
export default {
  clientLoader: {}
}
```

## Usage

### Vue 3

Export `clientLoader` from the plain `<script>` block of a `.vue` page (it can coexist with `<script setup>`, which does not allow `export`):

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

`useLoaderData()` returns a computed ref, which is `undefined` while pending or on failure.

### Vue 2

The page syntax is the same as Vue 3 (export from the plain `<script>`). Since Vue 2 has no Composition API, wrap `useLoaderData()` in a `computed` for reactivity:

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

Export from the module-level `<script>` of the page (exports in the instance `<script>` are component props):

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

### JS / TS pages

For non-SFC pages (`.ts` / `.tsx` / `.js` / `.jsx`), use a named export:

```tsx
export async function clientLoader({ params, query }) {
  const res = await fetch(`/api/users/${params.id}`);
  return { user: await res.json() };
}
```

## Loader signature

Unified across the three framework chains:

```ts
export async function clientLoader(ctx: {
  route: RouteLocation;      // current route (native route object of each framework)
  params: Record<string, string>;
  query: Record<string, string>;
}) {
  return data; // any serializable value, consumed via useLoaderData()
}
```

## Loading boundary

While the loader is running, a global loading component renders. Provide it via the convention file `src/loading.(js|ts)` (default-export a component); when absent, the boundary renders nothing:

```ts
// src/loading.js
import { h } from 'vue';
export default {
  render() {
    return h('div', 'loading...');
  }
};
```

When the loader throws, the boundary renders an error message (`Failed to load data: <message>`) and the page component does not render; the same applies to route component module load failures (`Failed to load route: <message>`).

## Caching semantics

Loader results are cached by "leaf route path + full location (query included)":

- Repeated navigation to the same location (including going back/forward to it) hits the cache without re-execution
- A query change (e.g. `/users?page=1` → `/users?page=2`) counts as a new location and re-executes
- Failed results are cached too; repeated navigation to them keeps showing the error

To force-refresh data, carry a timestamp or similar marker in the query.

## Notes

- In `.vue` pages, `clientLoader` must be declared in a plain `<script>` block (`<script setup>` does not allow `export`); a `<script setup>`-only page needs an additional plain `<script>` block
- A `.vue` page with only a plain `<script>` (no `<script setup>`) still needs `export default` for the page component itself
- The loader runs **after the route component module is ready** (sequential with rendering); parallel prefetching across nested route levels is not supported yet

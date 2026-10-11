# Using Svelte

WinJS supports the [Svelte 5](https://svelte.dev) framework (experimental) as a first-class framework alongside Vue 2 / Vue 3, starting from 0.19.4.

## Support Matrix

| Capability | Vite | Rsbuild | Rsbuild 2 | Webpack 5 |
| --- | --- | --- | --- | --- |
| Conventional / config routes | ✅ | ✅ | ✅ | ✅ |
| Global layout / dynamic routes | ✅ | ✅ | ✅ | ✅ |
| autoImport / routeProps | ✅ | ✅ | ✅ | ✅ |
| clientLoader data loading | ✅ | ✅ | ✅ | ✅ |
| HMR | ✅ | ✅ | ✅ | ❌ (full page reload) |
| MFSU | — | — | — | ❌ |

Other limitations: the `icons` config is not supported yet (the icon component is Vue-based; enabling it fails fast with an explicit error); the `layout` option of `mpa` is not supported yet (warned and ignored).

## Getting Started

The recommended way is scaffolding via the CLI:

```bash
pnpm create win my-svelte-app
# Pick the Svelte App template (Svelte 5)
```

To add Svelte to an existing project manually, install `svelte@^5` and `@winner-fed/preset-svelte`. WinJS auto-detects the framework when no Vue dependency is present and `svelte@^5` exists; you can also declare the preset explicitly in `.winrc.ts`:

```ts
import { defineConfig } from 'win';

export default defineConfig({
  presets: [require.resolve('@winner-fed/preset-svelte')],
});
```

## Routing

The routing system is identical to the Vue chains: conventional routing (the `src/pages` directory) and config-based routing (the `routes` config) are both supported, `$id` is the dynamic segment, and `src/layouts/index.svelte` is the global layout.

```ts
// src/pages/users/$id.svelte —— conventional dynamic route /users/:id
<script lang="ts">
  import { useRoute } from 'winjs';

  const routeStore = useRoute();
  const route = $derived($routeStore);
</script>

<h2>User Detail</h2>
<p>id = {route?.params.id}</p>
<p>query tab = {route?.query.tab ?? '(none)'}</p>
```

Use `RouteOutlet` to render child routes and `RouterLink` for navigation inside the layout:

```svelte
<script lang="ts">
  import { RouteOutlet, RouterLink } from 'winjs';
</script>

<nav>
  <RouterLink to="/" activeClass="active">Home</RouterLink>
  <RouterLink to="/users/42" activeClass="active">User</RouterLink>
</nav>
<main>
  <RouteOutlet />
</main>
```

`activeClass` of `RouterLink` is optional: the class is appended when the current route exactly matches the pathname of `to`; when omitted, no active class is injected.

### Navigation Guards

The unified convention across all three chains (Vue 3 / Vue 2 / Svelte): register guards on the router instance in the runtime config `onRouterCreated`, with vue-router-compatible semantics — return `false` to cancel, a path or Location object to redirect, or nothing to proceed:

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

Use `onRouteChange` to listen for route changes (with the `isFirst` flag for the initial navigation); the client route tree can be patched before rendering via `patchClientRoutes`.

## Data Loading (clientLoader)

Exporting `clientLoader` from a page-level module `<script>` declares route data loading (requires the `clientLoader: {}` config). While loading, the `loadingComponent` boundary (or the global loading) is rendered; once done, the component consumes the return value via `useLoaderData()`:

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

Results are cached by "leaf route + full location"; repeated navigation to the same location hits the cache directly.

## Route Props (routeProps)

Under conventional routing, declaring `definePageMeta` inside a page injects route props (`meta`, `name`, etc.) at build time with zero runtime cost:

```svelte
<script lang="ts">
  import { definePageMeta } from '@@/plugin-svelte-route-props';

  definePageMeta({
    meta: { title: 'About' },
  });
</script>
```

Combined with a global `title` template (containing the `%s` placeholder), this enables per-route titles: with `title: '%s - WinJS'`, a route with `meta.title` updates `document.title` to `About - WinJS`.

## Auto Import (autoImport)

Enabled by default. Svelte APIs such as `onMount`, `beforeUpdate`, `writable`, `derived`, plus framework routing APIs (`useRoute`, `useRouter`), require no manual import:

```svelte
<script lang="ts">
  // no need: import { onMount } from 'svelte'
  onMount(() => console.log('mounted'));
</script>
```

Disable it with `autoImport: false`, or customize it via `autoImport.unImports` (see the [autoImport config](/config/config#autoimport)).

## Bundler Choice & Matching Semantics

The four bundler chains are configured the same way as the Vue chains (`vite: {}` / `rsbuild: {}` / `rsbuild2: {}` / webpack by default). Route matching semantics are configured via `history`:

```ts
export default defineConfig({
  history: {
    type: 'browser',
    strict: false, // trailing slash strictness (default false: /users/ equals /users)
    sensitive: false, // case sensitivity (default false)
  },
});
```

Webpack chain notes: Svelte 5 has no HMR support, so file changes trigger a full page reload during development (a svelte-loader limitation); production builds extract standalone CSS assets via `emitCss`. svelte-loader compiler options can be configured via `svelte.svelteLoaderOptions`.

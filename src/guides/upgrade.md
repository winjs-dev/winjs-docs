# Version Upgrade {#upgrade}

## Upgrading from 0.19.x to 1.0.0

> Scope: business projects upgrading from WinJS 0.19.x to 1.0.0 (the final `1.0.0` has been released; the `1.0.0-rc.x` pre-releases also include all of the changes below).
>
> One-sentence conclusion: **zero structural impact** (runtime dependencies, artifact shape and Node version requirements are all unchanged), with new Svelte 5 framework support and clientLoader route data loading. There are **6 behavior changes** to be aware of — 2 may require a self-check, the rest are fixes that need no action.

### Compatibility Overview

| Dimension | Change | What business projects need to do |
|------|------|------|
| Runtime dependencies | `dependencies` / `peerDependencies` of the existing 17 packages are **unchanged** (only 2 new Svelte packages added — not installed unless used) | Nothing |
| Artifact shape | CommonJS + es2019 target, engines `>=20.19`, directory layout all unchanged | Nothing |
| Node.js | `>=20.19` for business projects unchanged (`>=22.12` only constrains framework repo contributors) | Nothing |
| TypeScript | Artifact type surface tested to support **>=4.9** (5.x recommended) | Almost nothing (projects on TS <4.9 should upgrade) |
| MFSU | Removed in 0.19.1 (carried over in this version); residual `mfsu` config keys are silently ignored across all chains | If upgrading from before 0.19.1, delete the residual config |
| Build toolchain | The framework repo's father → tsdown and jest → vitest migrations are **internal repo changes**; pre-bundled dependency artifacts are byte-for-byte equivalent and verified by runtime tests | Nothing |

### Behavior Changes (6 items)

#### 1. Vue 3 chain route matching relaxed by default (trailing slashes no longer 404) ⚠️ May require a self-check

The default of [`history.strict`](../config/config#history) changed from `true` to `false` (aligned with the Vue 2 / Svelte chains). Previously `/about/` would 404; now it hits the same route as `/about`.

- **Who is affected**: Vue 3 projects with trailing-slash access paths, or guard/analytics logic that relied on the "trailing slash 404" behavior
- **What to do**: Most projects need no action (this is a fix). To restore the old behavior, configure `history: { strict: true }` in `.winrc.ts`

#### 2. Vite chain build failures are no longer silently swallowed ⚠️ May require a self-check

Previously, Vite chain build errors were swallowed and the process exited with code 0 (false-green CI); now it fails with a non-zero exit code as it should.

- **Who is affected**: Vite chain projects with **latent build errors** (e.g. the `@vitejs/plugin-legacy` scenario, whose always-failing issue is also fixed in this version) — CI may turn red for the first time after upgrading
- **What to do**: Fix the build error itself — this is not a regression, it is a real previously-masked problem surfacing

#### 3. `extraBabel*` config now takes effect on the rsbuild / rsbuild2 chains

Previously, babel plugins injected by users and plugins via `extraBabelPlugins` / `extraBabelPresets` were silently dropped on the rsbuild chains; this version completes the contract and they are now actually applied (including the runtime plugin API `api.addExtraBabelPlugins()`).

- **Who is affected**: rsbuild / rsbuild2 projects that have configured extraBabel options
- **What to do**: Verify that the artifacts behave as expected once these plugins take effect (they never took effect before)

#### 4. `patchClientRoutes` / `onRouteChange` runtime hooks revived

Previously these two hooks had no trigger point anywhere in the chain (registering them did nothing); this version adds the trigger to all three framework renderers. See the [routing docs](./routes#patchclientroutes-routes) for usage.

- **Who is affected**: Projects that registered these hooks in runtime plugins (named hooks exported from `app.ts`) — the handlers will start actually running
- **What to do**: Confirm the handler logic is correct (they were mostly written for this purpose; revival means they work)

#### 5. Residual `mfsu` config on the rsbuild chains changed from an error to silent ignore

Bundler behavior is now unified: residual `mfsu` config on the business side is silently ignored (the rsbuild chains previously asserted an error).

- **What to do**: Nothing (more lenient); deleting the residual config is cleaner

#### 6. Browser compatibility data (caniuse-lite) refreshed after 22 months

Eliminates the stale Browserslist data warning on every dev/build; browserslist targets shifted slightly, CSS artifacts may have marginal differences.

- **What to do**: Nothing (low risk; projects sensitive to artifact size can diff one build)

### New Capabilities

- **Svelte 5 framework support**: two new packages `@winner-fed/preset-svelte` + `@winner-fed/renderer-svelte`, with all four bundler chains (Vite / rsbuild / rsbuild2 / webpack) working. See [Using Svelte](./svelte.md). Projects not using Svelte are completely unaffected.
- **clientLoader route data loading**: export a `clientLoader` function from a page, it runs automatically after the route component is ready, and its return value is consumed via `useLoaderData()` — unified across all three framework chains. See [Route Data Loading](./client-loader.md).
- **Routing improvements**: unified guard API across the three chains (`onRouterCreated`), [`title`](../config/config#title) supporting the `%s` template filled from the route's `meta.title`, configurable [`history.strict` / `history.sensitive`](../config/config#history) matching semantics, [`typedRoutes`](../config/config#typedroutes) generated route types (opt-in), and a build warning when config-based routes lack a catch-all.

### Upgrade Steps

```bash
# 1. Upgrade the framework (@winner-fed packages share a unified version; installing the main package is enough)
pnpm up --latest @winner-fed/winjs
# With npm: npm install @winner-fed/winjs@latest

# 2. Self-check against the behavior change list (focus on items 1 and 2)

# 3. Regression verification
pnpm dev    # local dev smoke test: route navigation / trailing-slash paths / data requests
pnpm build  # production build (confirm exit code and artifact diff look right)
```

::: tip Tip
If you develop third-party plugins based on `@winner-fed/winjs`, focus on behavior changes 3 and 4 (the semantic impact of extraBabel injection and runtime hook revival on plugins); the API surface itself has no breaking changes.
:::

### FAQ

**Q: Can I still use a Node 20 build environment?**
Yes. The published artifacts target es2019 with engines declared as `>=20.19`; the requirement for business projects was not tightened this time.

**Q: Do existing projects have to change code?**
Most likely zero changes. There are no breaking changes to the structural API surface; self-check against the behavior change list — 4 of the 6 items are pure fixes requiring no action.

**Q: Upgrading from 0.18.x or earlier?**
First handle the MFSU removal (since 0.19.1) and other changes per the 0.19.x announcements, then apply this section. For 0.19 series capabilities such as the rsbuild2 external bundler, see the corresponding version's CHANGELOG.

## Official Packages

All official WinJS packages currently use unified version numbers for release.

| Package Name              | Version                                                                                                      |
|---------------------------|--------------------------------------------------------------------------------------------------------------|
| @winjs-dev/create-win    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |
| @winner-fed/preset-vue    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fpreset-vue?style=flat-square&colorB=646cff)    |
| @winner-fed/preset-vue2   | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fpreset-vue2?style=flat-square&colorB=646cff)   |
| @winner-fed/renderer-vue  | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Frenderer-vue?style=flat-square&colorB=646cff)  |
| @winner-fed/renderer-vue2 | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Frenderer-vue2?style=flat-square&colorB=646cff) |
| @winner-fed/winjs         | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |

## Using Taze

We recommend using [Taze](https://github.com/antfu-collective/taze) to upgrade WinJS versions. This is a CLI tool for upgrading npm dependency versions.

### Usage

Run the following command to upgrade all dependencies containing `winner-fed` in their names:

```bash
npx taze --include /winner-fed/ -w
```

The output will be similar to:

```bash
winner-fed - 3 patch

  @winner-fed/core               dev  ~2mo  ^0.9.0  →  ^0.9.4
  @winner-fed/plugin-vue       dev  ~2mo  ^0.9.0  →  ^0.9.4
  @winner-fed/plugin-vue2  dev  ~2mo  ^0.9.0  →  ^0.9.4

ℹ changes written to package.json, run npm i to install updates.
```

You can also adjust `include` to match different packages, for example, to upgrade only packages under the `@winner-fed` scope:

```bash
npx taze --include /@winner-fed/ -w
```

### Options

Here are some examples of using taze options.

- In a monorepo, you can add the `-r` option to upgrade recursively:

```bash
npx taze --include /winner-fed/ -w -r
```

- Add `-l` to upgrade locked versions:

```bash
npx taze --include /winner-fed/ -w -l
```

- Upgrade major versions:

```bash
npx taze major --include /winner-fed/ -w
```

> For more options, please refer to the [taze documentation](https://github.com/antfu-collective/taze).
>

## Lock Sub-dependencies

When a sub-dependency in a project has issues that may prevent WinJS or the project from updating, you can use package managers to lock sub-dependency versions.

### pnpm

For projects using pnpm, add the following configuration to the `package.json` in the **project root directory**, then re-run `pnpm install`:

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

For projects using Yarn, add the following configuration to the `package.json` in the **project root directory**, then re-run `yarn install`:

```json title="package.json"
{
  "resolutions": {
    "package-name": "^1.0.0"
  }
}
```

### Npm

For projects using Npm, add the following configuration to the `package.json` in the **project root directory**, then re-run `npm install`:

```json title="package.json"
{
  "overrides": {
    "package-name": "^1.0.0"
  }
}
```

::: tip Tip
For Monorepo repositories, dependency versions can only be locked in the package.json in the project root directory, and this will affect all packages in the Monorepo.
:::


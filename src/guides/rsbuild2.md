# Rsbuild2 Mode <Badge type="tip" text=">=0.19.0" />

Rsbuild2 mode is built on [Rsbuild 2.x](https://rsbuild.rs/) (powered by [Rspack 2.x](https://rspack.rs/)) and is completely independent of the [Rsbuild mode](./rsbuild.md) (Rsbuild 1.x), with no mutual impact.

Unlike the built-in Webpack / Vite / Rsbuild bundlers, Rsbuild2 is an **external bundler**: it is not included in the dependencies of `@winner-fed/preset-win` and needs to be installed on demand by the business project. The benefits are:

- Projects not using rsbuild2 are completely unaware of its existence, with zero increase in `node_modules` size and installation time;
- Version evolution is independent of the WinJS major version, allowing timely adoption of the Rsbuild 2.x ecosystem;
- Uninstall the package and remove the configuration to fall back to other bundlers, achieving hot-pluggability.

## Requirements

- **Node.js `^20.19.0 || >=22.12.0`**: a hard requirement of Rsbuild 2.x (`@rsbuild/core` 2.x is a pure ESM package). WinJS validates this automatically at startup when rsbuild2 is enabled, and fails fast if the requirement is not met.
- `@winner-fed/bundler-rsbuild2` must be installed in the project.

## Enable Rsbuild2 Mode

Step 1: install the external bundler:

```bash
pnpm add -D @winner-fed/bundler-rsbuild2
```

Step 2: enable it in the configuration file `.winrc`:

```ts
export default {
  rsbuild2: {
    removeConsole: true
  }
}
```

If `rsbuild2` is configured without installing `@winner-fed/bundler-rsbuild2`, WinJS will throw an error with the installation command.

**Notes**:

- `rsbuild2` is mutually exclusive with `vite` and `rsbuild`; they cannot be enabled at the same time;
- After enabling, `hmrGuardian` is automatically disabled (consistent with Rsbuild mode);
- `mpa` (multi-page applications) and `mdx` are not supported yet.

## Configuration Options

- **Type**: `{ removeConsole: boolean | ConsoleType[], lightningcssLoader: boolean | Rspack.LightningcssLoaderOptions | Function }`
- **Default**: `false`

- `removeConsole`: whether to automatically remove `console.[methodName]` from code during production builds. Defaults to `false`; set to `true` to remove all types, or pass an array (e.g. `['log', 'info']`) to remove selectively.
- `lightningcssLoader`: refer to [lightningcssLoader](https://rsbuild.dev/config/tools/lightningcss-loader). Defaults to `true`.

### Passing Through Native Rsbuild Configuration

To use native Rsbuild configuration, pass it through `rsbuild2.config`, which is deeply merged with the built-in Rsbuild configuration:

```ts
export default {
  rsbuild2: {
    removeConsole: true,
    config: {
      tools: {
        // native Rsbuild 2.x configuration
      }
    }
  }
}
```

## Behavior Differences from Rsbuild Mode

Rsbuild 2.x introduces several breaking changes relative to 1.x. WinJS aligns the default behavior in the translation layer; below are the user-perceivable differences:

| Difference | Rsbuild Mode (1.x) | Rsbuild2 Mode (2.x) |
| --- | --- | --- |
| Bundle analysis | `ANALYZE=1` starts the bundle analyzer | No longer supported; a warning is printed and [Rsdoctor](https://rsdoctor.dev/) is recommended |
| moment locale | `performance.removeMomentLocale` | Implemented via Rspack `IgnorePlugin` with the same default behavior |
| dev server host | Defaults to `0.0.0.0` | host is explicitly passed through, keeping the same behavior |
| proxy `changeOrigin` | Defaults to `false` | Explicitly set to `false`, keeping the same behavior; event handlers (`onProxyReq`, etc.) must be placed inside the `on` object |
| Default browser targets | Chrome 87 / Safari 14, etc. | Upgraded to Chrome 107 / Safari 16, etc. (Baseline 2025); configure `targets` explicitly to keep the old behavior |
| `core-js` | Built-in dependency | Becomes an optional dependency; install it yourself when using `output.polyfill` |
| Custom loader mounting points (`modifyBundlerChain`) | `CHAIN_ID.RULE.JS` / `RULE.CSS` | Must move to `CHAIN_ID.ONE_OF.JS_MAIN` / `CSS_MAIN` |

## Migrating from Rsbuild Mode

1. Make sure the Node.js version satisfies `^20.19.0 || >=22.12.0`;
2. Install the external bundler: `pnpm add -D @winner-fed/bundler-rsbuild2`;
3. Change the configuration key from `rsbuild` to `rsbuild2` (the option structure is identical);
4. Check whether custom plugins using `modifyBundlerChain` need to migrate loader mounting points to the `ONE_OF` branches (see the table above);
5. Replace `ANALYZE`-based bundle analysis with [Rsdoctor](https://rsdoctor.dev/);
6. Configure `targets` explicitly to pin browser targets, avoiding default-target upgrades affecting bundle compatibility.

## Plugin & Ecosystem Compatibility

Rsbuild2 reuses the global `modifyRsbuildConfig`, `modifyRspackConfig`, and `modifyBundlerChain` hooks, so existing Rspack ecosystem plugins work directly.

Vue support requirements on the framework side (since `0.19.0`):

- Vue 2: `@winner-fed/preset-vue2` (bundles `@rsbuild/plugin-vue2@1.2.0`, compatible with both Rsbuild 1/2);
- Vue 3: `@winner-fed/preset-vue` (bundles `@rsbuild/plugin-vue@1.2.9`, compatible with both Rsbuild 1/2).

### Common Plugin Compatibility (Verified)

| Plugin | rsbuild2 Support | Notes |
| --- | --- | --- |
| plugin-request / plugin-pinia / plugin-vuex / plugin-locale / plugin-access / plugin-antdv / plugin-element-* / plugin-vant / plugin-hui / plugin-keepalive / plugin-mobile-layout / plugin-viewport / plugin-watermark / plugin-wconsole / plugin-confetti / plugin-did-you-know / plugin-openapi / plugin-run / plugin-winui / plugin-tailwindcss / plugin-web-update-notification / plugin-assets-retry | ✅ Fully compatible | Only relies on bundler-agnostic channels such as runtime plugins / tmpFiles / HTML hooks / external CLIs |
| plugin-unocss | ✅ Compatible (since the plugin fix) | Integrates via `@unocss/postcss` (extraPostCSSPlugins) in rsbuild2 mode; utility CSS generation verified |
| plugin-code-inspector | ✅ Verified compatible | The rspack adapter injects correctly under Rspack 2.x (verified in dev output) |
| plugin-unicons | ✅ Integration chain verified | The unplugin rspack loader intercepts `~icons/*` correctly |
| plugin-check-syntax | ⚠️ Not verifiable yet | Blocked by a dependency packaging issue in the upstream `@winner-fed/unplugin-check-syntax` (bundler-agnostic; webpack mode is equally affected) |
| plugin-remove-console | ➖ Not effective | Use the native `rsbuild2.removeConsole` configuration in rsbuild-family modes |
| plugin-qiankun / plugin-hui-micro-app (child apps) | ➖ Not effective | Relies on webpack Module Federation (same status as rsbuild 1.x) |
| plugin-css-assets-local | ➖ Not effective | Relies on extract-css-assets-webpack-plugin (same status as rsbuild 1.x) |
| plugin-icons-legacy | ❌ Unavailable | svg-sprite-loader is incompatible with rspack's ModuleGraph timing; rsbuild 1.x / 2.x behave identically (pre-existing limitation) |


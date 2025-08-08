# Code Splitting Guide

WinJS defaults to page-based splitting and on-demand loading.

### Using Splitting Strategies

WinJS has built-in different code splitting strategies ([codeSplitting](../config/config#codesplitting)), enabled through configuration:

```ts
// .winrc.ts
export default {
  codeSplitting: {
    jsStrategy: 'granularChunks'
  }
}
```

This will automatically split bundles according to certain optimization strategies. For more detailed manual splitting, please refer to the following sections.

### Manual Splitting

When your bundle size becomes large, you can perform further manual splitting.

Typically, we manually split components that reference large third-party libraries to achieve on-demand loading.

### Analyzing Bundle Composition

By specifying the [ANALYZE](./env-variables#analyze) environment variable, you can analyze bundle composition and modify code and make further decisions based on the analysis results.

## Using Dynamic Import for Splitting

Besides `chunkSplit` configuration, using dynamic import for splitting is also an important optimization technique that can effectively reduce the bundle size of the initial screen.

:::tip About dynamic import
Dynamic import is a new feature introduced in ECMAScript 2020 that allows you to dynamically load JavaScript modules.
:::

When bundling tools encounter `import()` syntax, they automatically split the related code into a new chunk and load it on-demand at runtime.

For example, if there's a large module `bigModule.ts` in your project (which can also be a third-party dependency), you can use dynamic import to load it on-demand:

```js
// Where you need to use bigModule
import('./bigModule.ts').then((bigModule) => {
  // Use bigModule
});
```

When you run the build command, `bigModule.ts` will be automatically split into a new chunk and loaded on-demand at runtime.

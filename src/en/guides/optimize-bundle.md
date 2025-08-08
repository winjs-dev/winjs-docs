# Bundle Size Optimization

Bundle size optimization is very important in production environments because it directly affects online user experience. In this document, we will introduce some common bundle size optimization methods in WinJS.

## Reducing Duplicate Dependencies

In Web projects, it's common for certain third-party dependencies to be packaged in multiple versions. Duplicate dependencies lead to larger bundle sizes and slower build speeds.

### Detecting Duplicate Dependencies

You can use [Rsdoctor](https://rsdoctor.dev) to detect whether duplicate dependencies exist in your project. Rsdoctor will analyze during the build process, find all duplicately packaged dependency packages, and visualize them:

![rsdoctor-duplicated-packages](/images/guide/rsdoctor-duplicated-packages.png)

See [Rsdoctor - Duplicate Dependency Issues](https://rsdoctor.dev/blog/topic/duplicate-pkg-problem) for details.

### Eliminating Duplicate Dependencies

We can use some tools from the community to detect or eliminate duplicate dependencies.

- If you're using `pnpm >= 7.26.0`, you can use pnpm's built-in [pnpm dedupe](https://pnpm.io/cli/dedupe) command to upgrade and eliminate duplicate dependencies.

```bash
pnpm dedupe
```

- If you're using `pnpm < 7.26.0`, you can use [pnpm-deduplicate](https://github.com/ocavue/pnpm-deduplicate) to analyze all duplicate dependencies and merge versions by upgrading dependencies or declaring [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides).

```bash
npx pnpm-deduplicate --list
```

- If you're using `yarn`, you can use [yarn-deduplicate](https://github.com/scinos/yarn-deduplicate) to automatically merge duplicate dependencies:

```bash
npx yarn-deduplicate && yarn
```

## Using Lighter Libraries

It's recommended to replace larger third-party libraries in your project with lighter alternatives, such as replacing [moment](https://momentjs.com/) with [day.js](https://day.js.org/).


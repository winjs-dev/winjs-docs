# Build Mode

## `bundle` / `bundleless`

First, let's understand bundle and bundleless.

Bundle refers to packaging build artifacts, which can be a single file or multiple files based on a certain [code splitting strategy](https://esbuild.github.io/api/#splitting). Currently, [Webpack](https://webpack.js.org) and [Rollup](https://rollupjs.org/guide/en/) in the community are build tools that perform Bundle builds on source code.

Bundleless refers to compiling and building each source file separately without packaging them together. It doesn't process dependencies at all, and each artifact file can be traced back to its corresponding source file. **The bundleless build process can also be understood as a process that only performs code transformation on source files**. Currently, [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) and [unbuild](https://github.com/unjs/unbuild) in the community are build tools that perform Bundleless builds on source code.

They each have their own benefits:

- Bundle can reduce the size of build artifacts and can also pre-package dependencies to reduce the size of dependency installation. Pre-packaging libraries can speed up application project builds.
- Bundleless can maintain the original file structure, which is more conducive to debugging and tree shaking.

:::warning
Bundleless is a single-file compilation mode, so for type references and exports you need to add the `type` field, for example `import type { A } from './types'`
:::

## Using Third-party npm Packages

When adding third-party npm packages to an initialized project, we can call this process "installing dependencies for the project" or "adding dependencies to the project". Before adding dependencies, we first need to understand something important — **npm dependency package types**:

- `"dependencies"`: Packages that your application needs in the production environment.
- `"devDependencies"`: Packages that are only needed during local development and testing.
- `"peerDependencies"`: In some cases, there's a compatibility relationship between your npm project and its host tool or library (such as a webpack plugin project and webpack), and your npm project doesn't want to include the host as a required dependency. This usually indicates that your project might be a plugin for this host tool or library. Your npm project will have certain requirements for the host package version, because only under specific versions will the APIs needed by the npm project be exposed.
  For more explanation about `peerDependencies`, you can learn about how npm, pnpm, and Yarn handle it differently through the following links:
  - [npm's explanation of peerDependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies)
  - [pnpm vs npm VS Yarn](https://pnpm.io/feature-comparison)
>   Packages can be understood as third-party npm packages.

You can install **packages needed in production environment** by executing `npm install npm-package-name` or `npm add npm-package-name`, or you can manually write the packages to be installed and their corresponding [semantic versions](https://docs.npmjs.com/about-semantic-versioning) in `"dependencies"` in the `package.json` file and execute the `npm install` command:

```json
{
  "name": "your-npm-project",
  "dependencies": {
    "npm-package-name": "0.1.0"
  }
}
```

Similarly, you can execute `npm install npm-package-name --save-dev` or `npm add npm-package-name --save-dev` to install **packages only needed during local development and testing**, or you can manually write the packages to be installed and their corresponding [semantic versions](https://docs.npmjs.com/about-semantic-versioning) in `"devDependencies"` in the `package.json` file and execute the `npm install` command:

```json
{
  "name": "your-npm-project",
  "devDependencies": {
    "npm-package-name": "0.1.0"
  }
}
```

**When installing or using third-party npm packages, be sure to determine their purpose and distinguish their types to decide whether they should be placed in `"dependencies"` or `"devDependencies"`.**

:::tip
Generally speaking, packages that need to be used in source code belong to `dependencies`. Unless you output dependency code locally through packaging, in which case they can be treated as `devDependencies`.
:::

## Handling Third-party Dependencies

Generally speaking, third-party dependencies required by a project can be installed through the package manager's `install` command. After successful installation of third-party dependencies, these dependencies usually appear under `dependencies` and `devDependencies` in the project's `package.json`.

```json 
{
  "dependencies": {},
  "devDependencies": {}
}
```

Dependencies under `"dependencies"` are usually dependencies required for the package to run, while `"devDependencies"` represents development dependencies.

Besides `"dependencies"`, `"peerDependencies"` can also declare dependencies needed to run in production environment, which will share a dependency with its host.

## Default Handling of Third-party Dependencies

In WinJS source code packaging, the underlying packaging tool relies on [father](https://github.com/umijs/father). **By default, third-party dependencies under `"dependencies"` and `"peerDependencies"` are not packaged**.

This is because when installing npm packages, their `"dependencies"` are also installed. Not packaging `"dependencies"` can reduce the size of package artifacts.

If you need to package certain dependencies, it's recommended to move them from `"dependencies"` to `"devDependencies"`, which is equivalent to **prebundling** dependencies and can reduce dependency installation size.

### Example

If the project depends on `vue`:

```json
{
  "dependencies": {
    "vue": "^3.3.0"
  },
  // or
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}
```

When `vue` dependency is used in source code:

```tsx 
import Vue from 'vue';
console.info(Vue);
```

The artifact will not contain `vue` code:

```js 
import Vue from 'Vue';
console.info(Vue);
```

# Version Upgrade {#upgrade}

## Official Packages

All official WinJS packages currently use unified version numbers for release.

| Package Name              | Version                                                                                                      |
|---------------------------|--------------------------------------------------------------------------------------------------------------|
| @winner-fed/create-win    | ![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fwinjs?style=flat-square&colorB=646cff)         |
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


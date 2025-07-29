# Using Vue2 {#withVue2}

This article introduces how to use Vue2 in WinJS. Most configurations for WinJS Vue2 are the same as Vue3.

::: warning Note
It's important to note that Vue2 versions are divided into **2.7.x** and **2.6.x and below**. The related configurations and APIs listed in the documentation are applicable to `2.7.x`, with partial compatibility for `2.6.x and below`.
:::

## Getting Started

### Installation

```bash
pnpm add @winner-fed/preset-vue2 -D
```

### Install Vue2 Version

```bash
pnpm add vue@">=2.7.14"
```

```json
{
  "dependencies": {
    "vue": "^2.7.14" // [!code ++]
  }
}
```

::: warning Note
Explicitly install the required Vue2 version in the project (the specific version to install can be determined based on project needs). However, WinJS will also automatically install `^2.7.14`.
:::

### Configure Preset

```ts
// In .winrc.ts or config/config.ts
export default {
  presets: [require.resolve('@winner-fed/preset-vue2')],
};
```

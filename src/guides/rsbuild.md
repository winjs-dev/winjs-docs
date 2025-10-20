# Rsbuild Mode <Badge type="tip" text=">=0.9.4" />

[Rsbuild](https://rsbuild.dev/) is a modern frontend build tool developed based on the Rust language, aiming to provide faster build speeds and better resource usage efficiency. Rsbuild's design goal is to become a solution that can replace existing JavaScript build tools (such as Webpack, Rollup, etc.). It's a high-performance build tool powered by [Rspack](https://rspack.dev/) at its core, which includes a carefully designed set of build configurations by default, providing an out-of-the-box development experience and fully leveraging Rspack's performance advantages.

## Enable Rsbuild Mode

Configure the following in the configuration file `.winrc` to enable Rsbuild mode:

- **Type**: `{ removeConsole: boolean | ConsoleType[], lightningcssLoader: boolean | Rspack.LightningcssLoaderOptions | Function }`
- **Default**: `false`

Related configuration options for rsbuild:

- removeConsole: Whether to automatically remove `console.[methodName]` from code during the production environment build phase. Default is `false`. When
  removeConsole is set to true, it will remove all types of `console.[methodName]`.
- lightningcssLoader: Refer to [lightningcssLoader](https://rsbuild.dev/zh/config/tools/lightningcss-loader). Default is `true`.

```ts
export default {
  rsbuild: {
    removeConsole: true
  }
}
```

# Build Tools

**WinJS's build capabilities are provided by WinJS Builder.**

WinJS Builder is one of the core components of the WinJS ecosystem. It is a Web build tool based on Webpack that can be used independently without WinJS. WinJS Builder supports Webpack, Vite, and Rsbuild bundling tools simultaneously, using the most mature Webpack for bundling by default.

## Build Architecture

From a build perspective, WinJS is divided into a three-layer architecture, from top to bottom:

- Upper development framework: WinJS.
- Universal build tool: WinJS Builder.
- Underlying bundling tools: Webpack, Vite, Rsbuild.

![builder](/images/guide/builder-layers.jpg)

## Build Configuration

WinJS configuration inherits from WinJS Builder, so you can use all build configurations provided by WinJS Builder in WinJS.

Taking WinJS Builder's `title` configuration option as an example, you can directly use this configuration option in the `config.ts` file, and it will be automatically passed to WinJS Builder.

```ts 
export default {
  title: 'example',
};
```

For detailed build configuration instructions, please refer to [「WinJS Builder - Builder Configuration」](../config/config.md).

## Build Capabilities

WinJS Builder provides rich build capabilities, including JavaScript compilation, CSS compilation, static asset processing, hot module replacement, code minification, TypeScript type checking, and dozens of other capabilities.
 
## Extensions

### Bundler
Refers to module bundling tools like Webpack, Vite, Rsbuild, etc.

The main goal of bundling tools is to bundle JavaScript, CSS, and other files together. The bundled files can be used in browsers, Node.js, and other environments. When a Bundler processes a Web application, it builds a dependency graph that includes all the modules the application needs, then bundles all modules into one or more bundles.

### Builder
WinJS Builder refers to WinJS's build tool, whose goal is to "reuse build tool best practices".

Because bundling tools like Webpack are relatively low-level, if we build a project based on Webpack, we need to fully understand Webpack's various configuration options and third-party plugins, and perform tedious configuration combinations and debugging work.

Builder has a higher level of encapsulation than Bundler and integrates capabilities like code transformation and code minification by default. By integrating Builder, you can quickly gain the ability to build Web applications.

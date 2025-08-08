# Static Assets {#assets}

This guide covers various ways to use static assets in WinJS projects.

WinJS supports referencing static assets such as images, fonts, audio, videos, and other types in your code.

:::tip What are Static Assets
Static assets are files in web applications that don't change. Common static assets include images, fonts, videos, stylesheets, and JavaScript files. These resources are typically stored on servers or CDNs and are delivered to users' browsers when they access the web application. Since they don't change, static assets can be cached by browsers, thereby improving web application performance.
:::

WinJS uses two directories to handle assets like stylesheets, fonts, or images:
- Content in the `public/` directory is served as-is as public resources under the server root directory.
- Content in the `src/assets/` directory is compiled into static assets by WinJS's bundler tools.

## Using Image Assets

In real development, we frequently use static files, especially images and icons. We recommend using CDNs for most images, but sometimes you may need to bundle them directly into JavaScript for loading speed.

You can directly reference asset files in TypeScript or JavaScript. Most asset files, when imported, are transformed into paths. You can set these as the src attribute for images or as URLs for window.open.

WinJS also supports directly importing asset paths.

```tsx
import logo from '@/assets/img/logo.png';

console.log(logo); //logo.84287d09.png

return <image src={logo} />;
```

To speed up loading and reduce network requests, files smaller than 1000k are converted to [base64](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), otherwise they will be built as separate image files output to the `static` directory in the build directory.

You may notice that the final generated `logo.png` becomes `logo.84287d09.png`. This ensures that images are updated with each version release. Without renaming, the `logo.png` cache would be hit. You can safely use import without worrying about caching.

WinJS maps `@` to the project's `src` directory by default, so you can use paths like `@/assets/` or `@/components` anywhere in your project to import static assets and components. You'll no longer need to use relative paths like `../../components`.

Aliases are also supported in CSS, just remember to add the `~` prefix when using aliases in CSS.

```css
.logo {
  background: url(~@/assets/img/logo.png);
}
```

If you want to use caching, you can place the file in `public/logo.png` and use it in your code like this:

```tsx
return <image src="/logo.png" />;
```

During compilation, everything in public will be moved to dist without any processing. When using them, make sure to use absolute paths. We generally recommend importing stylesheets, images, and fonts from JavaScript. The public folder can be used as a workaround for many uncommon situations.

## Using SVG Assets
WinJS supports [icons](../config/config#icons) for SVG resources, which can be directly imported and used as components:

```vue
<template>
  <div>
    <win-icon name="dog" class="icons"/>
  </div>
</template>
 ```

## Public Directory

The public directory in the project root can be used to store static resources that are publicly accessible at specified URLs in your application. You can access files in the `public/` directory through your application code or browser root URL `/`.

- When you start the development server, these resources are hosted under the `/` root path.
- When you execute a production build, these resources are copied to the dist directory.

For example, you can place files like `robots.txt`, `manifest.json`, or `favicon.ico` in the public directory.

## Assets Directory

By convention, WinJS uses the `src/assets/` directory to store assets such as stylesheets, images, fonts, or SVGs.

In your application code, you can reference files located in the `src/assets/` directory by using the `~/assets/` path.

## Image Formats

When using image assets, you can choose the appropriate image format based on the advantages, disadvantages, and applicable scenarios shown in the table below.

| Format | Advantages                                                                    | Disadvantages                                      | Use Cases                                                                                                          |
| ------ | ----------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| PNG    | Lossless compression, no loss of image detail, no distortion, supports alpha | Not suitable for images with complex color tables | Suitable for images with few colors and clear boundaries, ideal for logos, icons, and transparent images         |
| JPG    | Rich colors                                                                   | Lossy compression causes distortion, no alpha     | Suitable for images with many colors, gradients, and complex transitions, ideal for portraits and landscape photos |
| WebP   | Supports both lossy and lossless compression, alpha support, much smaller than PNG and JPG | Poor iOS compatibility                             | Almost any pixel image scenario, should be the first choice for WebP-supported host environments                  |
| SVG    | Lossless format, no distortion, supports transparency                        | Not suitable for complex graphics                  | Suitable for vector graphics, ideal for icons                                                                     |

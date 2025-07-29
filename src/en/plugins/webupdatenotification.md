# Web Update Detection and User Notification {#webupdatenotification}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-web-update-notification?style=flat-square&colorB=646cff)

"When a web application has new version updates or bug fixes, users continuing to use the old version affects user experience and backend data accuracy. It may also cause errors (404 files) or blank screen issues." This problem is very common after web application redeployment.

## Principle

Uses git commit hash (also supports svn revision number, package.json version, build timestamp, custom) as the version number. During build, the version number is written to a JSON file while injecting client-side runtime code. The client polls the version number on the server (assisted by browser window visibilitychange and focus events), compares it with the local version, and notifies users to refresh the page if they differ.

## Setup

1. Install the plugin

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-web-update-notification -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-web-update-notification -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-web-update-notification -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-web-update-notification -D
```
:::

2. Add dependency in `package.json`

```json
{
  "dependencies": {
    "@plugin-web-update-notification/core": "1.6.5",
  }
}
```

3. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';
import type { Options as WebUpdateNotificationOptions } from '@winner-fed/plugin-web-update-notification';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-web-update-notification')],
  /**
   * @name web-update-notification plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/webupdatenotification.html
   */
  webUpdateNotification: {
    logVersion: true,
    checkInterval: 0.5 * 60 * 1000,
    notificationProps: {
      title: 'New Version Available',
      description: 'System updated! Please refresh to use the latest version.',
      buttonText: 'Refresh',
      dismissButtonText: 'Dismiss'
    }
  } as WebUpdateNotificationOptions
});
```
     
## Preview
![web-update.png](/images/plugins/web-update.png)
  
## Plugin Configuration

1. [Configuration Documentation](https://github.com/GreatAuk/plugin-web-update-notification/blob/master/README.zh-CN.md#webupdatenotice-options)
2. https://juejin.cn/post/7209234917288886331

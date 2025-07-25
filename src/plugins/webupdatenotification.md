# 检测网页更新通知用户 {#webupdatenotification}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-web-update-notification?style=flat-square&colorB=646cff)

「在网页有新版本更新或问题修复时，用户继续使用旧的版本，影响用户体验和后端数据准确性。也有可能会出现报错（文件404）、白屏的情况」，此问题在网页重新部署后，很常见。

## 原理

以 git commit hash (也支持 svn revision number、package.json version、build timestamp、custom) 为版本号，打包时将版本号写入一个 json 文件，同时注入客户端运行的代码。客户端轮询服务器上的版本号（浏览器窗口的visibilitychange、focus 事件辅助），和本地作比较，如果不相同则通知用户刷新页面。

## 启用方式

1. 安装插件

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

2. 在 `package.json` 中引入依赖

```json
{
  "dependencies": {
    "@plugin-web-update-notification/core": "1.6.5",
  }
}
```

3. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';
import type { Options as WebUpdateNotificationOptions } from '@winner-fed/plugin-web-update-notification';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-web-update-notification')],
  /**
   * @name web-update-notification 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/webupdatenotification.html
   */
  webUpdateNotification: {
    logVersion: true,
    checkInterval: 0.5 * 60 * 1000,
    notificationProps: {
      title: '发现新版本',
      description: '系统更新啦！请刷新后使用。',
      buttonText: '刷新',
      dismissButtonText: '忽略'
    }
  } as WebUpdateNotificationOptions
});
```
     
## 效果
![web-update.png](/images/plugins/web-update.png)

## 示例

参考 [with-web-update-notification](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/tree/dev/examples/with-web-update-notification)
  
## 插件配置说明

1. [配置说明](https://github.com/GreatAuk/plugin-web-update-notification/blob/master/README.zh-CN.md#webupdatenotice-options)
2. https://juejin.cn/post/7209234917288886331

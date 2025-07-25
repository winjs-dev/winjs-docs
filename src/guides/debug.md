# 调试 {#debug}

除了使用浏览器的调试工具来完成开发中的调试外，WinJS 还推荐以下调试方式来协助项目的调试。

## 调试 dev 产物

如果你需要在 dev 阶段调试项目的构建产物，以 `win.js` 举例。先将原来的 `win.js` 下载到当前项目根目录下。根据调试需要进行编辑后，刷新浏览器，项目使用的 `win.js` 就替换成了根目录下的 `win.js` 文件。调试完毕需要恢复就直接删除根目录的 `win.js` 即可。

举例：
```bash
# 下载当前项目的 win.js
$ curl http://127.0.0.1:8000/win.js -O

# 增加想调试的内容，举例增加 "debug!!!" 弹窗
$ echo -e  '\n;alert("debug!!!");\n' >> win.js
# 打开浏览器就能看到 alert 弹窗

# 退出调试，恢复到正常状态
$ rm win.js
```

以此类推即可调试其他的 JavaScript 文件。

## XSwitch

如果需要在特定的域名环境调试或者验证当前的修改的代码，推荐使用 Chrome 插件 [XSwitch](https://chrome.google.com/webstore/detail/xswitch/idkjhjggpffolpidfkikidcokdkdaogg)。


![xswitch-logo](/images/guide/xswitch.png)


假设我们想在线上项目地址 `https://www.myproject.com` 上调试本地代码。项目使用 `https://www.myproject.com/win.hash.js`，为了验证本地的项目，需要将它替换成本地开发环境的 `http://127.0.0.1:000/win.js`

首先使用环境变量 `SOCKET_SERVER` 启动本地环境（防止因为连接不上 socket server 导致页面不断刷新）。
```bash
$SOCKET_SERVER=http://127.0.0.1:8000/ npx win dev
```

然后，在 XSwitch 中配置资源转发规则。
```json
{
  "proxy": [
    // 数组的第 0 项的资源会被第 1 项目替换
    [
      "https://www.myproject.com/win.2c8a01df.js",
      "http://127.0.0.1:8000/win.js"
    ],
    // 使用正则可以方便处理分包情况下 js 资源的加载
    [
      "https://www.myproject.com/(.*\.js)",
      "http://127.0.0.1:8000/$1",
    ],
    // 如果需要验证视觉表现，不要忘记替换 css 资源
    [
      "https://www.myproject.com/win.ae8b10e0.css",
      "http://127.0.0.1:8000/win.css"
    ]
  ]
}
```

刷新页面，正式域名下的内容就被替换了，这个时候就能方便的指定环境下调试了。

如果要退出调试，关闭 XSwitch 插件功能即可。

![turn-off-xswitch](/images/guide/turn-off-xswitch.png)

::: tip 提示
经常使用 XSwitch 的话，可新建一个规则保存。
:::

![xswitch1-new-rule](/images/guide/xswitch1.png)
  

## bug 调试方法

在我们的开发中，由于对底层的不理解或者兼容性的问题，很有可能会出现白屏或者 Out Of Memory 的问题，也有一些问题没有任何可以 debug 着手的方式。这时候就要用到一些 debug 的方案。

### 二分法定位

二分法是 debug 中最常用也是最好用的方式，非常适用于我的代码昨天还是好的和各类 Out Of Memory 报错。我们可以程序逻辑一点点注释掉，不断地进行排错，完全能把问题可能出现的范围缩小，然后找出罪魁祸首。再用常规手段调试。

node 中 Out Of Memory 最常用的方式就是删除一半依赖，然后进行重试来不断缩小范围，直到找个问题所在。二分调试大法每次遇到棘手的 bug，基本上都能解决，程序员必备技能，无关语言。

### 小黄鸭法

又称为[小黄鸭调试法](https://zh.wikipedia.org/zh-hans/%E5%B0%8F%E9%BB%84%E9%B8%AD%E8%B0%83%E8%AF%95%E6%B3%95) 。

处理 bug 的过程，最难的不是怎么解决问题，而是如何定位代码的 bug，如果实在是一筹莫展，尤其是算法类的问题。我们可以通过小黄鸭法来进行 debug。我们可以找任何物体也可以是同事讲一遍或者讨论一遍，当然上网发帖也是好方式。


### 重写一遍

这个方法成本最高，适用于可以乱七八糟的代码，尤其是陈年代码，如果实在搞不懂修不了 bug，可以加好测试用例重新写一遍。毕竟很多的 bug 其实都是错别字。

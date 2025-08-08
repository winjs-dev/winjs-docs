# 产物体积优化

产物体积的优化在生产环境中是非常重要的，因为它直接影响到了线上的用户体验。在这篇文档中，我们将介绍在 WinJS 中一些常见的产物体积优化方式。

## 减少重复依赖

在 Web 项目中，经常出现某些第三方依赖被打包了多个版本的现象。重复依赖会导致包体积变大、构建速度变慢。

### 检测重复依赖

你可以使用 [Rsdoctor](https://rsdoctor.dev) 来检测项目中是否存在重复依赖，Rsdoctor 会在构建过程中进行分析，找出所有重复打包的依赖包，并可视化展示出来：

![rsdoctor-duplicated-packages](/images/guide/rsdoctor-duplicated-packages.png)

详见 [Rsdoctor - 重复依赖问题](https://rsdoctor.dev/zh/blog/topic/duplicate-pkg-problem)。

### 消除重复依赖

我们可以通过社区中的一些工具来检测或消除重复依赖。

- 如果你在使用 `pnpm >= 7.26.0`，可以使用 pnpm 自带的 [pnpm dedupe](https://pnpm.io/cli/dedupe) 命令来升级和消除其中的重复依赖。

```bash
pnpm dedupe
```

- 如果你在使用 `pnpm < 7.26.0` 版本，可以使用 [pnpm-deduplicate](https://github.com/ocavue/pnpm-deduplicate) 来分析出所有的重复依赖，并通过升级依赖或声明 [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) 进行版本合并。

```bash
npx pnpm-deduplicate --list
```

- 如果你在使用 `yarn`，可以使用 [yarn-deduplicate](https://github.com/scinos/yarn-deduplicate) 来自动合并重复依赖：

```bash
npx yarn-deduplicate && yarn
```

## 使用更轻量的库

建议将项目中体积较大的三方库替换为更轻量的库，比如将 [moment](https://momentjs.com/) 替换为 [day.js](https://day.js.org/)。


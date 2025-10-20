# @winner-fed/plugin-viewport

Viewport plugin for WinJS.

<p>
  <a href="https://npmjs.com/package/@winner-fed/plugin-viewport">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-viewport?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-viewport?minimal=true"><img src="https://img.shields.io/npm/dm/@winner-fed/plugin-viewport.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

底层基于 [postcss-mobile-forever](https://github.com/wswmsword/postcss-mobile-forever) 封装。

## Usage

Install:

```bash
npm add @winner-fed/plugin-viewport -D
```

Add plugin to your `.winrc.ts`:

```ts
// .winrc.ts
export default {
  plugins: ['@winner-fed/plugin-viewport'],
  // 开启配置
  // 参考 https://github.com/wswmsword/postcss-mobile-forever?tab=readme-ov-file#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0 
  viewport: {}
};
```

## Options

| Name | Type | Default | Desc                                                                                                                                                                                                                                                                                        |
|:--|:--|:--|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| viewportWidth | number\|(file: string) => number | 750 | 应用基于该宽度进行开发，转换后的伸缩视图将会以该宽度的视图作为标准进行比例伸缩；可以传递函数动态生成宽度，例如 `file => file.includes("vant") ? 375 : 750` 表示在名称包含“vant”的文件内使用 375px 的宽度，而其他文件使用 750px 的宽度                                                                                                                                         |
| mobileUnit | string | "vw" | 移动端竖屏视口视图，转换成什么伸缩单位？设置为 `rem` 后激活 **rem-mode**                                                                                                                                                                                                                                                                         |
| maxDisplayWidth | number | / | 伸缩视图的最大宽度                                                                                                                                                                                                                                                                                |
| basicRemWidth | number | / | *rem-mode* 的基准宽度，若不设定，将通过 `viewportWidth` 获取 |
| enableMediaQuery | boolean | false | 打开媒体查询模式，打开后将自动关闭 `maxDisplayWidth`，激活 **mq-mode**                                                                                                                                                                                                                                                         |
| desktopWidth | number | 600 | 适配到桌面端宽度时，展示的视图宽度                                                                                                                                                                                                                                                                             |
| landscapeWidth | number | 425 | 适配到移动端横屏宽度时，展示的视图宽度                                                                                                                                                                                                                                                                           |
| appSelector | string | / | 页面最外层选择器，例如“`#app`”，用于设置在桌面端和移动端横屏时的居中样式，样式文件中至少要包含空的选择器 `#app {}`                                                                                                                                                                                                                                                    |
| appContainingBlock | "calc"\|"manual"\|"auto" | "calc" | 该属性和矫正 `fixed` 定位元素有关，`manual` 将不矫正；`calc` 将通过插件主动计算的方式矫正元素尺寸，是默认行为；`auto` 将通过 `transform: translateZ(0)` 强制设置根[包含块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block)为 `appSelector`，从而自动矫正元素，并且此时需要设置属性 `necessarySelectorWhenAuto`                                            |
| necessarySelectorWhenAuto | string | / | 当 `appContainingBlock` 设为 `auto` 时，需要指定该属性，该属性指定了 `appSelector` 往内一层的元素选择器，查看一个[关于指定元素作为包含块的实验](https://github.com/wswmsword/web-experiences/tree/main/css/fixed-on-containing-block)以了解如何使用该属性，您也可以查看[使用这个属性的示例项目](./example/cases/auto-app-containing-block/postcss.config.js)以了解如何使用这个属性 |
| border | boolean\|string | false | 在页面外层展示边框吗，用于分辨居中的小版心布局和背景，可以设置颜色字符串                                                                                                                                                                                                                                                        |
| disableDesktop | boolean | false | 打开则不做桌面端适配，使用该参数前需要打开 `enableMediaQuery`                                                                                                                                                                                                                                                    |
| disableLandscape | boolean | false | 打开则不做移动端横屏适配，使用该参数前需要打开 `enableMediaQuery`                                                                                                                                                                                                                                                  |
| disableMobile | boolean | false | 打开则不做移动端竖屏适配，把 px 转换为视口单位，如 vw                                                                                                                                                                                                                                                              |
| exclude | RegExp\|RegExp[] | / | 排除文件或文件夹                                                                                                                                                                                                                                                                                    |
| include | RegExp\|RegExp[] | / | 包括文件或文件夹                                                                                                                                                                                                                                                                                    |
| unitPrecision | number | 3 | 单位精确到小数点后几位？                                                                                                                                                                                                                                                                                |
| propList | string[] | ['*'] | 哪些属性要替换，哪些属性忽略？用法参考 [postcss-px-to-viewport 文档](https://github.com/evrone/postcss-px-to-viewport/blob/HEAD/README_CN.md)                                                                                                                                                                    |
| selectorBlackList | (string\|RegExp)[] | [] | 选择器黑名单，名单上的不转换                                                                                                                                                                                                                                                                              |
| propertyBlackList | propertyBlackList | [] | 属性黑名单，名单上的不转换，如果要指定选择器内的属性，用对象的键表示选择器名称，具体用法见 [vant 的范例代码](./example/others/vant-vue/postcss.config.cjs#L9C17-L9C17)                                                                                                                                                                        |
| valueBlackList | (string\|RegExp)[] | [] | 属性值黑名单，名单上的值不转换                                                                                                                                                                                                                                                                             |
| rootContainingBlockSelectorList | (string\|RegExp)[] | [] | 包含块是根元素的选择器列表，效果和标注注释 `/* root-containing-block */` 相同                                                                                                                                                                                                                                      |
| verticalWritingSelectorList | (string\|RegExp)[] | [] | 纵向书写模式的选择器列表，效果和在选择器顶部标注注释 `/* vertical-writing-mode */` 相同                                                                                                                                                                                                                                 |
| minDesktopDisplayWidth | number | / | 宽度断点，如果不提供这个值，默认使用 `desktopWidth` 的值，视图大于这个宽度，则页面宽度是桌面端宽度 `desktopWidth`，“原理和输入输出范例”一节具体介绍了该值的触发情况                                                                                                                                                                                          |
| maxLandscapeDisplayHeight | number | 640 | 高度断点，视图小于这个高度，并满足一定条件，则页面使用移动端横屏宽度，“原理和输入输出范例”一节具体介绍了该值的触发情况                                                                                                                                                                                                                                |
| side | any | / | 侧边配置，在桌面端媒体查询中生效，用于利用宽屏的空间，后文将介绍它的若干子属性                                                                                                                                                                                                                                                     |
| comment | any | / | 自定义注释，改变注释的名称，后文将介绍它的若干子属性                                                                                                                                                                                                                                                                  |
| customLengthProperty | any | / | 用于指定需要添加到桌面端或横屏的自定义变量（css 变量，`var(...)`），如果不指定，默认**所有**和长度有关的属性，如果使用了自定义变量，都会被添加入桌面端和横屏，后文将介绍它的若干子属性                                                                                                                                                                                        |
| experimental.extract | boolean | false | 提取桌面端与横屏样式代码，用于生产环境，用于代码分割优化产包，具体查看“注意事项”一节                                                                                                                                                                                                                                                 |
| experimental.minDisplayWidth | number | / | 限制最小宽度，和 `maxDisplayWidth` 搭配使用         

### 默认配置参数

```json
{
  "viewportWidth": 750,
  "maxDisplayWidth": null,
  "enableMediaQuery": false,
  "desktopWidth": 600,
  "landscapeWidth": 425,
  "minDesktopDisplayWidth": null,
  "maxLandscapeDisplayHeight": 640,
  "appSelector": "#app",
  "appContainingBlock": "calc",
  "necessarySelectorWhenAuto": null,
  "border": false,
  "disableDesktop": false,
  "disableLandscape": false,
  "disableMobile": false,
  "exclude": null,
  "include": null,
  "unitPrecision": 3,
  "selectorBlackList": [],
  "valueBlackList": [],
  "rootContainingBlockSelectorList": [],
  "verticalWritingSelectorList": [],
  "propList": ["*"],
  "mobileUnit": "vw",
  "side": {
    "width": null,
    "gap": 18,
    "selector1": null,
    "selector2": null,
    "selector3": null,
    "selector4": null,
    "width1": null,
    "width2": null,
    "width3": null,
    "width4": null
  },
  "comment": {
    "applyWithoutConvert": "apply-without-convert",
    "rootContainingBlock": "root-containing-block",
    "notRootContainingBlock": "not-root-containing-block",
    "ignoreNext": "mobile-ignore-next",
    "ignoreLine": "mobile-ignore",
    "verticalWritingMode": "vertical-writing-mode"
  },
  "customLengthProperty": {
    "rootContainingBlockList_LR": [],
    "rootContainingBlockList_NOT_LR": [],
    "ancestorContainingBlockList": [],
    "disableAutoApply": false
  },
  "experimental": {
    "extract": false,
    "minDisplayWidth": null
  }
}
```

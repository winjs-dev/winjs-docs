# @winner-fed/plugin-viewport

Viewport plugin for WinJS.

<p>
  <a href="https://npmjs.com/package/@winner-fed/plugin-viewport">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-viewport?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-viewport?minimal=true"><img src="https://img.shields.io/npm/dm/@winner-fed/plugin-viewport.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

Built on top of [postcss-mobile-forever](https://github.com/wswmsword/postcss-mobile-forever).

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
  // Enable configuration
  // Reference: https://github.com/wswmsword/postcss-mobile-forever?tab=readme-ov-file#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0 
  viewport: {}
};
```

## Options

| Name | Type | Default | Desc                                                                                                                                                                                                                                                                                        |
|:--|:--|:--|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| viewportWidth | number\|(file: string) => number | 750 | The application is developed based on this width, and the converted scalable view will be proportionally scaled based on this width view. You can pass a function to dynamically generate width, for example `file => file.includes("vant") ? 375 : 750` means using 375px width for files with "vant" in the name, while other files use 750px width                                                                                                                                         |
| mobileUnit | string | "vw" | Mobile portrait viewport view, what scalable unit to convert to? Setting to `rem` activates **rem-mode**                                                                                                                                                                                                                                                                         |
| maxDisplayWidth | number | / | Maximum width of the scalable view                                                                                                                                                                                                                                                                                |
| basicRemWidth | number | / | Base width for *rem-mode*, if not set, will be obtained from `viewportWidth` |
| enableMediaQuery | boolean | false | Enable media query mode, when enabled will automatically disable `maxDisplayWidth` and activate **mq-mode**                                                                                                                                                                                                                                                         |
| desktopWidth | number | 600 | View width displayed when adapting to desktop width                                                                                                                                                                                                                                                                             |
| landscapeWidth | number | 425 | View width displayed when adapting to mobile landscape width                                                                                                                                                                                                                                                                           |
| appSelector | string | / | Outermost page selector, for example "`#app`", used to set center styles for desktop and mobile landscape, style file must contain at least an empty selector `#app {}`                                                                                                                                                                                                                                                    |
| appContainingBlock | "calc"\|"manual"\|"auto" | "calc" | This property is related to correcting `fixed` positioned elements. `manual` will not correct; `calc` will correct element dimensions through plugin active calculation, which is the default behavior; `auto` will force set the root [containing block](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block) to `appSelector` via `transform: translateZ(0)`, thereby automatically correcting elements, and requires setting the `necessarySelectorWhenAuto` property                                            |
| necessarySelectorWhenAuto | string | / | When `appContainingBlock` is set to `auto`, this property needs to be specified. This property specifies the element selector one level inside `appSelector`. See [an experiment about specifying elements as containing blocks](https://github.com/wswmsword/web-experiences/tree/main/css/fixed-on-containing-block) to understand how to use this property. You can also check [a sample project using this property](./example/cases/auto-app-containing-block/postcss.config.js) to understand how to use this property |
| border | boolean\|string | false | Display border on the outer layer of the page? Used to distinguish centered small layout and background, can set color string                                                                                                                                                                                                                                                        |
| disableDesktop | boolean | false | When enabled, desktop adaptation is disabled. Requires `enableMediaQuery` to be enabled before using this parameter                                                                                                                                                                                                                                                    |
| disableLandscape | boolean | false | When enabled, mobile landscape adaptation is disabled. Requires `enableMediaQuery` to be enabled before using this parameter                                                                                                                                                                                                                                                  |
| disableMobile | boolean | false | When enabled, mobile portrait adaptation is disabled, converting px to viewport units like vw                                                                                                                                                                                                                                                              |
| exclude | RegExp\|RegExp[] | / | Exclude files or folders                                                                                                                                                                                                                                                                                    |
| include | RegExp\|RegExp[] | / | Include files or folders                                                                                                                                                                                                                                                                                    |
| unitPrecision | number | 3 | How many decimal places should the unit be accurate to?                                                                                                                                                                                                                                                                                |
| propList | string[] | ['*'] | Which properties to replace and which to ignore? Usage reference: [postcss-px-to-viewport documentation](https://github.com/evrone/postcss-px-to-viewport/blob/HEAD/README_CN.md)                                                                                                                                                                    |
| selectorBlackList | (string\|RegExp)[] | [] | Selector blacklist, those on the list will not be converted                                                                                                                                                                                                                                                                              |
| propertyBlackList | propertyBlackList | [] | Property blacklist, those on the list will not be converted. To specify properties within selectors, use object keys to represent selector names. See [vant example code](./example/others/vant-vue/postcss.config.cjs#L9C17-L9C17) for specific usage                                                                                                                                                                        |
| valueBlackList | (string\|RegExp)[] | [] | Property value blacklist, values on the list will not be converted                                                                                                                                                                                                                                                                             |
| rootContainingBlockSelectorList | (string\|RegExp)[] | [] | Selector list where containing block is root element, same effect as marking comment `/* root-containing-block */`                                                                                                                                                                                                                                      |
| verticalWritingSelectorList | (string\|RegExp)[] | [] | Selector list for vertical writing mode, same effect as marking comment `/* vertical-writing-mode */` at the top of selector                                                                                                                                                                                                                                 |
| minDesktopDisplayWidth | number | / | Width breakpoint, if not provided, defaults to `desktopWidth` value. When view is larger than this width, page width is desktop width `desktopWidth`. The "Principles and Input/Output Examples" section specifically introduces the trigger conditions for this value                                                                                                                                                                                          |
| maxLandscapeDisplayHeight | number | 640 | Height breakpoint, when view is smaller than this height and meets certain conditions, page uses mobile landscape width. The "Principles and Input/Output Examples" section specifically introduces the trigger conditions for this value                                                                                                                                                                                                                                |
| side | any | / | Sidebar configuration, effective in desktop media queries, used to utilize widescreen space, its sub-properties will be introduced later                                                                                                                                                                                                                                                     |
| comment | any | / | Custom comments, change comment names, its sub-properties will be introduced later                                                                                                                                                                                                                                                                  |
| customLengthProperty | any | / | Used to specify custom variables (CSS variables, `var(...)`) that need to be added to desktop or landscape. If not specified, by default **all** length-related properties using custom variables will be added to desktop and landscape, its sub-properties will be introduced later                                                                                                                                                                                        |
| experimental.extract | boolean | false | Extract desktop and landscape style code for production environment, used for code splitting optimization, see "Notes" section for details                                                                                                                                                                                                                                                 |
| experimental.minDisplayWidth | number | / | Limit minimum width, used together with `maxDisplayWidth`         

### Default Configuration Parameters

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

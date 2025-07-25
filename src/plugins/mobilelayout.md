# 移动端布局 {#mobilelayout}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-mobile-layout?style=flat-square&colorB=646cff)
   

为了进一步降低研发成本，我们将布局利用 WinJS 插件的方式内置，只需通过简单的配置即可拥有布局，包括移动端H5常见的顶部标题栏，中间内容区域以及底部的标签栏。从而做到使用者无需关心布局。
::: tip 说明

此方案只适用于 Vue3。由于底层依赖了 Vant 的部分组件，因此在使用此插件时，需要安装 Vant。

:::

## 启用方式

1. 安装插件

::: code-group

```bash [NPM]
$ npm add @winner-fed/plugin-mobile-layout -D
```

```bash [YARN]
$ yarn add @winner-fed/plugin-mobile-layout -D
```

```bash [PNPM]
$ pnpm add @winner-fed/plugin-mobile-layout -D
```

```bash [BUN]
$ bun add @winner-fed/plugin-mobile-layout -D
```
:::

2. 在 `package.json` 中引入依赖

```json
{
  "dependencies": {
    "vant": "^4.6.5"
  }
}
```

3. 在配置文件中 `.winrc` 中开启该功能

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-mobile-layout')],
  /**
   * @name mobileLayout 插件
   * @doc http://172.27.24.2:7788/winjs-document/plugins/mobilelayout.html
   */
  mobileLayout: {}
});
```

## 配置

### 运行时配置

可以在 `src/app.(j|t)[s]x` 中配置页面底部导航标签栏、所有页面的默认 title、页面的 title、页面头部导航栏。

通过 export `mobileLayout` 对象将作为配置传递给 WinJS 移动端布局组件。如下所示：

```ts
// app.ts
export const mobileLayout = {
  tabBar,
  navBar,
  documentTitle: 'demo',
  titleList
};
```

| 属性            | 类型              | 必填 | 描述          |
|---------------|-----------------|----|-------------|
| tabBar        | TabBarProps     | 否  | 定义页面底部导航标签栏 |
| navBar        | _NavBarProps    | 否  | 定义页面头部导航栏   |
| documentTitle | string          | 否  | 定义所有页面的默认标题 |
| titleList     | TitleListItem[] | 否  | 定义页面的标题     |

### 定义页面底部导航标签栏

`tabBar` 的类型 `TabBarProps` 定义如下：

| 属性              | 类型                                                                     | 必填 | 描述                                     |
|-----------------|------------------------------------------------------------------------|----|----------------------------------------|
| color           | string                                                                 | 是  | 导航标签的文字默认颜色                            |
| selectedColor   | string                                                                 | 是  | 导航标签的文字选中时的颜色                          |
| backgroundColor | string                                                                 | 是  | 导航标签的背景色                               |
| tabBarItem      | TabBarItem[]                                                           | 是  | 导航标签的列表                                |
| tabBeforeChange | (navigator: any, name: number \| string) => void \| Promise\<boolean\> | 否  | 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise |
| tabChange       | (navigator: any, name: number \| string) => void                       | 否  | 切换标签时触发                                |

`tabBar.tabBarItem` 的类型 `TabBarItem` 定义如下：

| 属性               | 类型                                                                | 必填 | 说明                    |
|------------------|-------------------------------------------------------------------|----|-----------------------|
| pagePath         | string                                                            | 是  | 页面路径，必须在 pages 中先定义   |
| text             | string                                                            | 否  | 导航标签的文字               |
| iconPath         | string                                                            | 否  | 导航标签图标路径              |
| selectedIconPath | string                                                            | 否  | 导航标签选中时的图标路径          |
| dot              | boolean                                                           | 否  | 是否显示图标右上角小红点，默认 false |
| badge            | string                                                            | 否  | 导航标签图标右上角显示数值 （微标数）   |
| onPress          | (navigator: any, data?: TabBarItem) => void \| Promise\<boolean\> | 否  | 导航标签点击回调              |
| title            | string                                                            | 否  | 页面标题                  |
| icon             | object \| string                                                  | 否  | 自定义导航标签               |
| selectedIcon     | object \| string                                                  | 否  | 自定义选中的导航标签            |

### 定义页面头部导航栏

`navBar` 的类型 `NavBarProps` 定义如下：

| 属性           | 说明                   | 类型                  | 默认值                         |
|--------------|----------------------|---------------------|-----------------------------|
| mode         | 风格模式                 | string              | 'dark' 'dark', 'light'      |
| icon         | 头部导航左侧，返回区域的图标       | object \| string    | 不在 tabsBar 中定义的页面，会有默认左返回图标 |
| leftContent  | 头部导航左侧的返回区域的右侧内容     | any                 | 无                           |
| rightContent | 头部导航右侧内容             | any                 | 无                           |
| leftText     | 头部导航左侧的返回文案          | string              | 无                           |
| onLeftClick  | 头部导航左侧的返回区域点击回调      | (navigator) => void | 有左侧回退图标的默认事件是返回上一页          |
| hideNavBar   | 隐藏 NavBar，默认有 NarBar | boolean             | false                       |
| pageTitle    | 页面标题                 | string              | 无，优先级最高                     |
| navList      | 单独设置某些页面的 navbar     | NarBarListItem      | 无                           |

`navList` 的类型 `NavBarListItem` 定义如下：

| 属性       | 类型          | 默认值 | 说明                  |
|----------|-------------|-----|---------------------|
| pagePath | string      | 无   | 页面路径，必须在 pages 中先定义 | 
| navBar   | NavBarProps | 无   | 当前路由的 navBar        |

### 定义页面的标题

`titleList` 的类型 `TitleListItem[]` 定义如下：

| 属性       | 类型     | 必填 | 说明                  |
|----------|--------|----|---------------------|
| pagePath | string | 是  | 页面路径，必须在 pages 中先定义 |
| title    | string | 否  | 页面标题                |

### 定义所有页面的默认标题

```ts
export const mobileLayout = {
  documentTitle: '默认标题',
};
```

#### 页面标题的设置优先级

`titleList` 的 `title`> `tabBar` 中 `list` 的 `title` > `documentTitle`。

## 完整示例

举个例子，如下所示：

```ts
// 自定义 TabarIcon
import TabbarIcon from '@/components/TabbarIcon';

import type {
  NavBarListItem,
  NavBarProps,
  TabBarItem,
  TabBarProps,
  TitleListItem,
  MobileLayoutProps
} from 'winjs';

const titleList: TitleListItem[] = [
  {
    pagePath: '/',
    title: '报名',
  },
  {
    pagePath: '/signIn',
    title: '签到',
  },
  {
    pagePath: '/query',
    title: '查询',
  },
  {
    pagePath: '/other',
    title: '其他',
  },
];

const navList: NavBarListItem = [
  {
    pagePath: '/',
    navBar: {},
  },
  {
    pagePath: '/signIn',
    navBar: {},
  },
  {
    pagePath: '/query',
    navBar: {},
  },
  {
    pagePath: '/other',
    navBar: {},
  },
]
const navBar: NavBarProps = {
  navList,
  fixed: true,
  mode: 'light',
  hideNavBar: true
};

const tabList: TabBarItem[] = [
  {
    pagePath: '/',
    text: '报名',
    icon: <TabbarIcon icon - name = "icon-sign-up" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-sign-up" / >,
    title: '报名',
  },
  {
    pagePath: '/signIn',
    text: '签到',
    icon: <TabbarIcon icon - name = "icon-sign-in" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-sign-in" / >,
    title: '签到'
  },
  {
    pagePath: '/query',
    text: '查询',
    icon: <TabbarIcon icon - name = "icon-query" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-query" / >,
    title: '查询'
  },
  {
    pagePath: '/other',
    text: '其他',
    icon: <TabbarIcon icon - name = "icon-other" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-other" / >,
    title: 'other'
  },
];
const tabBar: TabBarProps = {
  color: `#929292`,
  selectedColor: '#00b38a',
  tabBarItem: tabList,
};

export const mobileLayout: MobileLayoutProps = {
  theme: 'light',
  documentTitle: 'Demo',
  navBar,
  titleList,
  tabBar,
};
```

```vue
<!--TabbarIcon.vue-->
<script setup lang="ts">
defineProps({
  iconName: {
    type: String,
    required: true
  }
});

</script>

<template>
  <i class="icon" :class="iconName"></i>
</template>
```

具体属性配置说明：

```ts
export interface TitleListItem {
  // 页面路由
  pagePath: string;
  // 标题
  title: string;
}

export interface TabBarItem {
  pagePath: string;
  // 标签栏底部文字
  text?: string;
  iconPath?: string;
  selectedIconPath?: string;
  // 是否显示图标右上角小红点
  dot?: boolean;
  // 图标右上角徽标的内容
  badge?: number | string;
  title?: string;
  icon?: string;
  selectedIcon?: string;
  onPress?: (navigator: any, data?: TabBarItem) => void | Promise<boolean>;
}

export interface TabBarProps {
  // 是否固定在底部
  fixed?: boolean;
  // 未选中标签的颜色
  color?: string;
  // 选中标签的颜色
  selectedColor?: string;
  tabBarItem?: TabBarItem[];
  // 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
  tabBeforeChange?: (
    navigator: any,
    name: number | string,
  ) => void | Promise<boolean>;
  tabChange?: (navigator: any, name: number | string) => void;
}

export interface _NavBarProps {
  mode?: 'dark' | 'light';
  icon?: object | string;
  leftText?: string;
  leftContent?: any;
  rightContent?: any;
  onLeftClick?: (navigator: any) => void;
  hideNavBar?: boolean;
  pageTitle?: string;
}

export interface NavBarListItem {
  pagePath: string;
  navBar?: _NavBarProps;
}

export interface NavBarProps extends _NavBarProps {
  fixed?: boolean;
  navList?: NavBarListItem[];
}

export interface TitleItems {
  pagePath: string;
  title?: string;
}

export interface MobileLayoutProps {
  theme?: 'dark' | 'light';
  tabBar?: TabBarProps;
  navBar?: NavBarProps;
  documentTitle?: string;
  titleList?: TitleItems[];
}

```

此外，也可以参考 [with-mobile-layout](https://gitlab.hundsun.com/WhaleFE/winjs-plugins/-/tree/dev/examples/with-mobile-layout)

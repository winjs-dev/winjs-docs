# Mobile Layout {#mobilelayout}

![NPM Version](https://img.shields.io/npm/v/%40winner-fed%2Fplugin-mobile-layout?style=flat-square&colorB=646cff)
   

To further reduce development costs, we have built-in layout functionality through WinJS plugins. With simple configuration, you can have a complete layout including common mobile H5 elements: top title bar, middle content area, and bottom tab bar. This allows users to focus on business logic without worrying about layout implementation.
::: tip Note

This solution is only compatible with Vue 3. Since it depends on some Vant components at the underlying level, you need to install Vant when using this plugin.

:::

## Setup

1. Install the plugin

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

2. Add dependency in `package.json`

```json
{
  "dependencies": {
    "vant": "^4.6.5"
  }
}
```

3. Enable the plugin in the `.winrc` configuration file

```ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: [require.resolve('@winner-fed/plugin-mobile-layout')],
  /**
   * @name mobileLayout plugin
   * @doc https://winjs-dev.github.io/winjs-docs/plugins/mobilelayout.html
   */
  mobileLayout: {}
});
```

## Configuration

### Runtime Configuration

You can configure the bottom navigation tab bar, default title for all pages, page titles, and page header navigation bar in `src/app.(j|t)[s]x`.

By exporting the `mobileLayout` object, it will be passed as configuration to the WinJS mobile layout component. As shown below:

```ts
// app.ts
export const mobileLayout = {
  tabBar,
  navBar,
  documentTitle: 'demo',
  titleList
};
```

| Property      | Type            | Required | Description                    |
|---------------|-----------------|----------|--------------------------------|
| tabBar        | TabBarProps     | No       | Define bottom navigation tab bar |
| navBar        | _NavBarProps    | No       | Define page header navigation bar |
| documentTitle | string          | No       | Define default title for all pages |
| titleList     | TitleListItem[] | No       | Define page titles             |

### Define Bottom Navigation Tab Bar

The `TabBarProps` type for `tabBar` is defined as follows:

| Property        | Type                                                                   | Required | Description                                                    |
|-----------------|------------------------------------------------------------------------|----------|----------------------------------------------------------------|
| color           | string                                                                 | Yes      | Default text color of navigation tabs                          |
| selectedColor   | string                                                                 | Yes      | Text color of navigation tabs when selected                    |
| backgroundColor | string                                                                 | Yes      | Background color of navigation tabs                            |
| tabBarItem      | TabBarItem[]                                                           | Yes      | List of navigation tabs                                        |
| tabBeforeChange | (navigator: any, name: number \| string) => void \| Promise\<boolean\> | No       | Callback before tab switch, return false to prevent switch, supports Promise |
| tabChange       | (navigator: any, name: number \| string) => void                       | No       | Triggered when tab is switched                                 |

The `TabBarItem` type for `tabBar.tabBarItem` is defined as follows:

| Property         | Type                                                              | Required | Description                                      |
|------------------|-------------------------------------------------------------------|----------|--------------------------------------------------|
| pagePath         | string                                                            | Yes      | Page path, must be defined in pages first       |
| text             | string                                                            | No       | Text of navigation tab                           |
| iconPath         | string                                                            | No       | Icon path of navigation tab                      |
| selectedIconPath | string                                                            | No       | Icon path when navigation tab is selected        |
| dot              | boolean                                                           | No       | Whether to show red dot on top-right of icon, default false |
| badge            | string                                                            | No       | Number displayed on top-right of navigation tab icon (badge) |
| onPress          | (navigator: any, data?: TabBarItem) => void \| Promise\<boolean\> | No       | Navigation tab click callback                    |
| title            | string                                                            | No       | Page title                                       |
| icon             | object \| string                                                  | No       | Custom navigation tab                            |
| selectedIcon     | object \| string                                                  | No       | Custom selected navigation tab                   |

### Define Page Header Navigation Bar

The `NavBarProps` type for `navBar` is defined as follows:

| Property     | Description                              | Type                | Default                                    |
|--------------|------------------------------------------|---------------------|--------------------------------------------|
| mode         | Style mode                               | string              | 'dark' 'dark', 'light'                    |
| icon         | Icon in the left return area of header navigation | object \| string    | Pages not defined in tabsBar will have default left return icon |
| leftContent  | Content on the right side of left return area | any                 | None                                       |
| rightContent | Right content of header navigation       | any                 | None                                       |
| leftText     | Left return text of header navigation    | string              | None                                       |
| onLeftClick  | Click callback for left return area     | (navigator) => void | Default event with left return icon is to go back to previous page |
| hideNavBar   | Hide NavBar, NavBar is shown by default | boolean             | false                                      |
| pageTitle    | Page title                               | string              | None, highest priority                     |
| navList      | Set navbar for specific pages separately | NarBarListItem      | None                                       |

The `NavBarListItem` type for `navList` is defined as follows:

| Property | Type        | Default | Description                               |
|----------|-------------|---------|-------------------------------------------|
| pagePath | string      | None    | Page path, must be defined in pages first |
| navBar   | NavBarProps | None    | NavBar for current route                  |

### Define Page Titles

The `TitleListItem[]` type for `titleList` is defined as follows:

| Property | Type   | Required | Description                               |
|----------|--------|----------|-------------------------------------------|
| pagePath | string | Yes      | Page path, must be defined in pages first |
| title    | string | No       | Page title                                |

### Define Default Title for All Pages

```ts
export const mobileLayout = {
  documentTitle: 'Default Title',
};
```

#### Page Title Setting Priority

`titleList`'s `title` > `tabBar`'s `list`'s `title` > `documentTitle`.

## Complete Example

Here's an example:

```ts
// Custom TabarIcon
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
    title: 'Registration',
  },
  {
    pagePath: '/signIn',
    title: 'Sign In',
  },
  {
    pagePath: '/query',
    title: 'Query',
  },
  {
    pagePath: '/other',
    title: 'Other',
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
    text: 'Registration',
    icon: <TabbarIcon icon - name = "icon-sign-up" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-sign-up" / >,
    title: 'Registration',
  },
  {
    pagePath: '/signIn',
    text: 'Sign In',
    icon: <TabbarIcon icon - name = "icon-sign-in" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-sign-in" / >,
    title: 'Sign In'
  },
  {
    pagePath: '/query',
    text: 'Query',
    icon: <TabbarIcon icon - name = "icon-query" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-query" / >,
    title: 'Query'
  },
  {
    pagePath: '/other',
    text: 'Other',
    icon: <TabbarIcon icon - name = "icon-other" / >,
    selectedIcon: <TabbarIcon icon - name = "icon-other" / >,
    title: 'Other'
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

Detailed property configuration description:

```ts
export interface TitleListItem {
  // Page route
  pagePath: string;
  // Title
  title: string;
}

export interface TabBarItem {
  pagePath: string;
  // Tab bar bottom text
  text?: string;
  iconPath?: string;
  selectedIconPath?: string;
  // Whether to show red dot on top-right of icon
  dot?: boolean;
  // Content of badge on top-right of icon
  badge?: number | string;
  title?: string;
  icon?: string;
  selectedIcon?: string;
  onPress?: (navigator: any, data?: TabBarItem) => void | Promise<boolean>;
}

export interface TabBarProps {
  // Whether to fix at bottom
  fixed?: boolean;
  // Color of unselected tabs
  color?: string;
  // Color of selected tabs
  selectedColor?: string;
  tabBarItem?: TabBarItem[];
  // Callback before tab switch, return false to prevent switch, supports Promise
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

# Enable REM Adaptation

WinJS supports one-click enabling of REM adaptation capability through [convertToRem](../config/config#converttorem), which can dynamically adjust font sizes based on screen size, allowing web pages to adapt and display properly on screens of different sizes.

## Enable REM Adaptation Capability

After enabling `convertToRem`, the following two operations will be performed on the page:

1. Convert px in CSS properties to rem.
2. Dynamically set the font size of the root element.

```ts
export default {
  convertToRem: true,
};
```

## CSS Property Value Conversion

Since the default rootFontSize is 37.5, after enabling rem conversion, CSS styles will be converted according to the ratio of 1rem = 37.5px as follows:

```css
/* input */
h1 {
  margin: 0 0 16px;
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 1px;
}

/* output */
h1 {
  margin: 0 0 0.43rem;
  font-size: 0.85rem;
  line-height: 1.2;
  letter-spacing: 1px;
}
```

WinJS will convert some CSS properties by default. If you want to convert only the letter-spacing property, you can achieve this by setting pxtorem.propList.

```ts
export default {
  convertToRem: {
    pxtorem: {
      propList: ['letter-spacing']
    }
  }
};
```

## Root Element Font Size Calculation

The calculation formula for the font size of the page root element is:

```
Root element font size = Current client screen width * Root element font value / UI design width

(i.e.: pageRootFontSize = clientWidth * rootFontSize / screenWidth)
```

Taking a mobile browser with a screen width of 390 as an example, the default root element font value is 50, and the UI design width is 375.

The calculated page root element font size is 52 (`390 * 50 / 375`).
At this time, 1 rem is 52px, and 32px (0.64 rem) in CSS styles has an actual page effect of 33.28 px.

```ts
export default {
  convertToRem: {
    rootFontSize: 50,
    screenWidth: 375,
  },
};
```

## Custom Maximum Root Element Font Value

On desktop browsers, the page root element font value calculated according to the formula is often too large. When the calculated result exceeds the default maximum root element font value, the currently set maximum root element font value is used as the current root element font value.

Taking a desktop browser with a screen width of 1920 as an example, the calculated root element font size is 349, which exceeds the maximum root element font value of 64. Therefore, 64 is used as the current root element font value.

```ts
export default {
  convertToRem: {
    maxRootFontSize: 64,
  },
};
```

## How to Check if REM is Effective?

1. CSS: Check whether the corresponding property values in the generated `.css` file have been converted from px to rem.
2. HTML: Open the page console and check whether `document.documentElement.style.fontSize` has a valid value.

## How to Get the Actually Effective rootFontSize Value on the Page?

The actually effective rootFontSize on the page will be dynamically calculated based on the current page situation. You can check it by printing `document.documentElement.style.fontSize`, or get it through `window.ROOT_FONT_SIZE`.

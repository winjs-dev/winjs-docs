# Route Data Loading

WinJS provides an out-of-the-box data preloading solution that can solve waterfall requests for page components and data dependencies in multi-level nested routes. WinJS automatically initiates data requests in parallel based on the current route or the route being navigated to, so when route components finish loading, there's already data ready to use.

## How to Enable

Configure to enable:

```ts
// .winrc.ts

export default {
  clientLoader: {}
}
```

## How to Use

In route files, in addition to the default exported page component, export a `clientLoader` function and complete the route data loading logic within this function.

```tsx
// pages/.../some_page.tsx

import { useClientLoaderData } from 'winjs';

export default function SomePage() {
  const { data } = useClientLoaderData();
  return <div>{data}</div>;
}

export async function clientLoader() {
  const data = await fetch('/api/data');
  return data;
}
```

As shown in the code above, the data returned by the `clientLoader` function can be retrieved in the component by calling `useClientLoaderData`.

## Optimization Effects

Consider a three-level nested route scenario:

1. We need to wait for the first-level route component to load completely, then the first-level route component initiates a data request
2. After the first-level route data request completes, start requesting the second-level route component, and after the second-level route component loads, request the data needed by the second-level route
3. After the second-level route data request completes, start requesting the third-level route component, and after the third-level route component loads, request the data needed by the third-level route
4. After the third-level route data request completes, the entire page finishes rendering

Such waterfall requests severely impact user experience, as shown in the figure below:

![](https://img.alicdn.com/imgextra/i1/O1CN01OcsOL91CPw46Pm7vz_!!6000000000074-1-tps-600-556.gif)

If the component's data request logic is extracted into `clientLoader`, WinJS can request this data in parallel:

![](https://img.alicdn.com/imgextra/i3/O1CN01URnLH81un9EVYGeL9_!!6000000006081-1-tps-600-556.gif)

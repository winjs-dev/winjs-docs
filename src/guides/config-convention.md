# 配置文件格式约定

为了方便 WinJS 通过 CLI 来修改项目的配置，项目配置文件需要采用下面两种方式来书写。

## 导出默认配置对象

推荐这样的方式：

```ts
// ✅
export default {
  request: {},
}
```

而不是这样的方式：

```ts
// ❌
const config = { request: {} }
export default config
```

## 默认导出配置函数结果

推荐这样的方式：
```ts
// ✅
import { defineConfig } from 'win';

export default defineConfig({
  request: {}
})
```

而不是这样的方式：
```ts
// ❌
import { defineConfig } from 'win';

const config = { dva: {} }
export default defineConfig(config)
```

也不是这样的方式：

```ts
// ❌
import { defineConfig } from 'win';

const config = defineConfig({ request: {}})
export default config;
```

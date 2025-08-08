# Configuration File Format Convention

To facilitate WinJS modifying project configurations through CLI, project configuration files need to be written in the following two ways.

## Export Default Configuration Object

Recommended approach:

```ts
// ✅
export default {
  request: {},
}
```

Rather than this approach:

```ts
// ❌
const config = { request: {} }
export default config
```

## Export Default Configuration Function Result

Recommended approach:
```ts
// ✅
import { defineConfig } from 'win';

export default defineConfig({
  request: {}
})
```

Rather than this approach:
```ts
// ❌
import { defineConfig } from 'win';

const config = { dva: {} }
export default defineConfig(config)
```

Also not this approach:

```ts
// ❌
import { defineConfig } from 'win';

const config = defineConfig({ request: {}})
export default config;
```

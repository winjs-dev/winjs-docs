# TypeScript {#typescript}

WinJS enables TypeScript by default. If you create a project using the official scaffolding, the built-in files use TypeScript.

If you want to develop with JavaScript, you can directly change the `.(ts|tsx)` files used in your project to `.(js|jsx)` files and develop using JavaScript syntax.

## TypeScript Hints in Configuration

If you want TypeScript syntax hints when configuring, you can wrap the configuration with `defineConfig`, which will provide syntax hints during configuration:

```ts
// .winrc.ts
import { defineConfig } from 'win';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
```

## TypeScript Vue

When using `win lint` as a code detection tool, you need to add the following configuration to the `.eslintrc.js` file in your current project:

```js
module.exports = {
  extends: [
    '@winner-fed/eslint-config-win',
    '@winner-fed/eslint-config-win/vue3',
    '@winner-fed/eslint-config-win/typescript',
    './.eslintrc-auto-import.json'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser'
    }
  }
};
```

Note: `@winner-fed/f2elint` version needs to be `>=2.1.0`.

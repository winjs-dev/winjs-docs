# Security Enhancement Plugin

A plugin that provides security enhancement features for WinJS projects, primarily used for generating SRI (Subresource Integrity) attributes.

## Features

- Automatically generates SRI attributes for `<script>` and `<link>` tags in HTML files
- Supports SHA-256, SHA-384, SHA-512 hash algorithms (configurable)
- Automatically adds `crossorigin="anonymous"` attribute to ensure SRI works properly
- Only effective in production environment, automatically skipped in development

## Installation

```bash
pnpm add @winner-fed/plugin-security
```

## Usage

Add plugin configuration in your `.winrc.ts` configuration file:

```typescript
import { defineConfig } from '@winner-fed/winjs';

export default defineConfig({
  plugins: ['@winner-fed/plugin-security'],
  security: {
    sri: true // Enable SRI functionality
  },
});
```

## Configuration Options

### `sri`

- **Type**: `boolean | { algorithm: 'sha256' | 'sha384' | 'sha512' }`
- **Default**: Requires manual configuration
- **Description**: Whether to enable SRI (Subresource Integrity) functionality and optional hash algorithm configuration

When set to `true` or `{}`, the plugin will:

1. Scan HTML files after build
2. Add `integrity` attribute to all `<script>` tags with `src` attribute
3. Add `integrity` attribute to all `<link>` tags with `href` attribute
4. Automatically add `crossorigin="anonymous"` attribute (if not present)

You can also specify the hash algorithm using object syntax:

```typescript
security: {
  sri: {
    algorithm: 'sha512' // Options: 'sha256' | 'sha384' | 'sha512', default 'sha512'
  }
}
```

## Example

### Input HTML

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/assets/app.css">
</head>
<body>
  <script src="/assets/app.js"></script>
</body>
</html>
```

### Output HTML (After SRI enabled)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/assets/app.css" integrity="sha512-ABC123..." crossorigin="anonymous">
</head>
<body>
  <script src="/assets/app.js" integrity="sha512-XYZ789..." crossorigin="anonymous"></script>
</body>
</html>
```

## Security Notes

SRI (Subresource Integrity) is a security feature that allows browsers to verify that fetched resources (such as resources from CDNs) have not been maliciously modified. When the browser loads a resource, it calculates the resource's hash value and compares it with the hash value specified in the `integrity` attribute. If the hash values don't match, the browser will refuse to load the resource.

For `<script>` tags, the result is refusing to execute the code within; for CSS links, the result is not loading the styles within.

For more information about SRI, see [Subresource Integrity - MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).

## Important Notes

1. This plugin only takes effect during production builds, development environment is automatically skipped
2. Ensure resource files are accessible in the build output directory
3. The `integrity` attribute must be used together with the `crossorigin` attribute to work properly



# Micro-generators {#generator}

WinJS has many built-in micro-generators to help you quickly complete tedious tasks during development.

## How to Use

The following command will list all currently available generators. You can select the functionality you want to use through an interactive interface, with detailed prompts provided.

```bash
$ win generate
# or
$ win g
```

You can also use the corresponding generator with `win g <generatorName>`.

## Generator List

### Page Generator

Quickly generate a new page with the following usage methods.

#### Basic Usage

Interactive input of page name and file generation method:

```bash
win g page
? What is the name of page? › mypage
? How dou you want page files to be created? › - Use arrow-keys. Return to submit.
❯   mypage/index.{vue,less}
    mypage.{vue,less}
```

Direct generation:

```bash
$ win g page foo
Write: src/pages/foo.vue
Write: src/pages/foo.less
```

Generate page as directory, with component and style files under the directory:

```bash
$ win g page bar --dir
Write: src/pages/bar/index.less
Write: src/pages/bar/index.vue
```

Nested page generation:

```bash
$ win g page far/far/away/kingdom
Write: src/pages/far/far/away/kingdom.vue
Write: src/pages/far/far/away/kingdom.less
```

Batch generation of multiple pages:

```bash
$ win g page  page1  page2   a/nested/page3
Write: src/pages/page1.vue
Write: src/pages/page1.less
Write: src/pages/page2.vue
Write: src/pages/page2.less
Write: src/pages/a/nested/page3.vue
Write: src/pages/a/nested/page3.less
```

#### Customizing Page Template Content

If the default template used by the page generator doesn't meet your needs, you can customize the template content.

Execute the `--eject` command:

```bash
$ win g page --eject
```

After executing the command, the page generator will write its original template to the project's `/templates/page` directory:

```
.
├── package.json
└── templates
    └── page
        ├── index.less.tpl
        └── index.vue.tpl
```

##### Using Template Variables

Both template files support template syntax. You can insert variables like this:

```vue
<script setup>
import { ref } from 'vue';

const message = '{{{msg}}}'
const count = {{{count}}}
</script>

<template>
  <div class="page page-{{{name}}}">
    <div class="page-content">
      {{{ name }}}
    </div>
  </div>
</template>

<style src="./index{{{ cssExt }}}"></style>
```

You can customize parameter values:

```bash
$ win g page foo --msg "Hello World" --count 10
```

After running the command, the generated page content is as follows:

```vue
<script setup>
import { ref } from 'vue';

const message = 'Hello World'
const count = 10
</script>

<template>
  <div class="page page-foo">
    <div class="page-content">
      foo
    </div>
  </div>
</template>

<style src="./index.less"></style>
```

If you don't need to use template variables, you can omit the `.tpl` suffix, shortening `index.vue.tpl` to `index.vue` and `index.less.tpl` to `index.less`.

##### Preset Variables

In the content generated in the previous section, we didn't specify `name`, but it was still set with a value. This is because it belongs to preset variables in the template. Below are all the preset variables currently available in page templates:

| Parameter | Default Value | Description |
|:-:|:-:|:-|
| `name` | - | The name of the current file. If you execute `pnpm win g page foo`, it will generate `pages/foo.vue` and `pages/foo.less` files, where the `name` value is "foo". |
| `color` | - | A randomly generated RGB color. |
| `cssExt` | `less` | The suffix of the style file. |

For more template syntax content, please check [mustache](https://www.npmjs.com/package/mustache).

##### `dir` Mode

When not using `dir` mode, if your page template folder only customizes one template file, missing files will automatically use the default template files.

If using `dir` mode, the generated content will be consistent with your page custom template folder. Default templates are only used when the page custom template folder is empty. If your page custom template folder content is as follows:

```
.
├── a.vue
└── index.vue.tpl
```

The generated directory will be:

```
.
├── a.vue
└── index.vue
```

##### Fallback

If you want to continue using the default template, you can specify `--fallback`, which will no longer use user-customized templates:

```bash
$ win g page foo --fallback
```

### Component Generator

Generate components needed for the project in the `src/components/` directory. Like the page generator, the component generator also has multiple generation methods.

#### Basic Usage

Interactive generation:
```bash
$ win g component
✔ Please input you component Name … foo
Write: src/components/Foo/index.js
Write: src/components/Foo/Foo.vue
```

Direct generation:
```bash
$ win g component bar
Write: src/components/Bar/index.js
Write: src/components/Bar/Bar.vue
```

Nested generation:
```bash
$ win g component group/subgroup/baz
Write: src/components/group/subgroup/Baz/index.js
Write: src/components/group/subgroup/Baz/Baz.vue
```

Batch generation:
```bash
$ win g component apple banana orange
Write: src/components/Apple/index.js
Write: src/components/Apple/Apple.vue
Write: src/components/Banana/index.js
Write: src/components/Banana/Banana.vue
Write: src/components/Orange/index.js
Write: src/components/Orange/Orange.vue
```

#### Customizing Component Template Content

Like the [page generator](#customizing-page-template-content), the component generator also supports customizing template content. First, write the original template to the project's `/templates/component` directory:

```bash
$ win g component --eject
```

##### Using Template Variables

```bash
$ win g component foo --msg "Hello World"
```

Custom component templates can omit the `.tpl` suffix. You can shorten `index.js.tpl` to `index.js` and `component.vue.tpl` to `component.vue`.

The component generator will generate content consistent with your custom template folder. You can add more custom template files as needed.

##### Preset Variables

| Parameter | Default Value | Description |
|:-:|:-:|:-|
| `compName` | - | The name of the current component. If you execute `pnpm win g component foo`, the `compName` value is `Foo`. |

##### Fallback

```bash
$ win g component foo --fallback
```

### RouteAPI Generator

Generate template files for routeAPI functionality.

Interactive generation:
```bash
$ win g api
✔ please input your api name: … starwar/people
Write: api/starwar/people.ts
```

Direct generation:
```bash
$ win g api films
Write: api/films.ts
```

Nested generator:
```bash
$ win g api planets/[id]
Write: api/planets/[id].ts
```

Batch generation:
```bash
$ win g api spaceships vehicles species
Write: api/spaceships.ts
Write: api/vehicles.ts
Write: api/species.ts
```

### Mock Generator

Generate template files for [Mock](./mock) functionality. For specific Mock implementation, refer to the [documentation](./mock).

Interactive generation:
```bash
$ win g mock
✔ please input your mock file name … auth
Write: mock/auth.ts
```

Direct generation:
```bash
$ win g mock acl
Write: mock/acl.ts
```

Nested generation:
```bash
$ win g mock users/profile
Write: mock/users/profile.ts
```

### Prettier Configuration Generator

Generate [prettier](https://prettier.io/) configuration for the project. After command execution, WinJS will generate recommended prettier configuration and install corresponding dependencies.

```bash
$ win g prettier
info  - Write package.json
info  - Update package.json for scripts
info  - Write .prettierrc.js
info  - Write .prettierignore
```

Then, you can directly execute the command `npm run format` to format the relevant code style in the project.

### Tailwind CSS Configuration Generator

Enable [Tailwind CSS](https://tailwindcss.com/) configuration for the project. After command execution, `win` will generate Tailwind CSS configuration and install corresponding dependencies.

```bash
$ win g tailwindcss
info  - Write package.json
set config:tailwindcss on /Users/win/playground/.winrc.ts
set config:plugins on /Users/win/playground/.winrc.ts
info  - Update .winrc.ts
info  - Write tailwind.config.js
info  - Write tailwind.css
```

### Precommit Configuration Generator

Generate [precommit](https://typicode.github.io/husky) configuration for the project. After command execution, `win` will add husky and Git commit message format validation behavior, formatting Git staged code by default before each Git commit.

> Note: If it's an initialized `app`, `pc` project, this generator is usually not needed because husky is already configured

```bash
$ win g precommit
info  - Update package.json for devDependencies
info  - Update package.json for scripts
info  - Write .lintstagedrc
info  - Create .husky
info  - Write commit-msg
info  - Write pre-commit
```

### Uno CSS Configuration Generator {#unocss}

Enable [UnoCSS](https://github.com/unocss/unocss) configuration for the project. After command execution, WinJS will generate Uno CSS configuration and install corresponding dependencies.

```bash
$ win g unocss
info  - Update package.json for devDependencies
set config:unocss on /.winrc.ts
set config:plugins on /.winrc.ts
info  - Update .winrc.ts
info  - Write uno.config.ts
```

import { defineAdditionalConfig } from 'vitepress'

const nav = [
  { text: 'Guide', link: '/guides/getting-started', activeMatch: `^/guides/` },
  { text: 'Config', link: '/config/config', activeMatch: `^/config/` },
  { text: 'Plugin', link: '/plugins/index', activeMatch: `^/plugins/` },
  { text: 'API', link: '/api/api', activeMatch: `^/api/` },
  { text: 'CLI', link: '/cli/commands', activeMatch: `^/cli/` },
  { text: 'Blog', link: '/blog/migrating-create-project-to-win', activeMatch: `^/blog/` },
  {
    text: 'Learn More',
    items: [
      {
        text: 'Front-end domain model',
        link:
          'https://github.com/cklwblove/domain-front'
      },
      {
        text: 'Create project',
        link:
          'https://cloud-templates.github.io/create-project/'
      }
    ]
  }
];
export const sidebar = {
  '/guides/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/guides/introduce' },
        {
          text: 'Quick start',
          link: '/guides/getting-started'
        },
        {
          text: 'Upgrading',
          link: '/guides/upgrade'
        },
        {
          text: 'Builder',
          link: '/guides/builder'
        }
      ]
    },
    {
      text: 'Basic',
      items: [
        {
          text: 'Development environment',
          link: '/guides/prepare'
        },
        {
          text: 'Directory structure',
          link: '/guides/directory-structure'
        },
        {
          text: 'Environment variables',
          link: '/guides/env-variables'
        },
        {
          text: 'Coding specifications',
          link: '/guides/lint'
        },
        {
          text: 'Routing',
          link: '/guides/routes'
        },
        {
          text: 'Plugins',
          link: '/guides/use-plugins'
        },
        {
          text: 'Data request',
          link: '/guides/data-request'
        },
        {
          text: 'Mock',
          link: '/guides/mock'
        },
        {
          text: 'Proxy',
          link: '/guides/proxy'
        },
        {
          text: 'TypeScript',
          link: '/guides/typescript'
        },
        {
          text: 'Using Vue2',
          link: '/guides/with-vue2'
        },
        {
          text: 'Vite mode',
          link: '/guides/vite'
        },
        {
          text: 'Rsbuild mode',
          link: '/guides/rsbuild'
        }
      ]
    },
    {
      text: 'Advanced',
      items: [
        {
          text: 'Scaffolds',
          link: '/guides/boilerplate'
        },
        {
          text: 'Micro generators',
          link: '/guides/generator'
        },
        {
          text: 'MPA mode',
          link: '/guides/mpa'
        },
        {
          text: 'AutoImport R&D mode',
          link: '/guides/autoImport'
        },
        {
          text: 'Debug',
          link: '/guides/debug'
        },
        {
          text: 'REM',
          link: '/guides/rem'
        },
        {
          text: 'Build production',
          link: '/guides/build'
        },
        {
          text: 'Deploy',
          link: '/guides/deploy'
        }
      ]
    },
    {
      text: 'Static Assets',
      items: [
        { text: 'Styling', link: '/guides/styling' },
        { text: 'Assets', link: '/guides/assets' }
      ]
    },
    {
      text: 'Other',
      items: [
        { text: 'Code Splitting', link: '/guides/code-splitting' },
        { text: 'Legacy Browser', link: '/guides/legacy-browser' },
        { text: 'Optimize Bundle', link: '/guides/optimize-bundle' },
        { text: 'Build Mode', link: '/guides/build-mode' },
        { text: 'FAQ', link: '/guides/faq' }
      ]
    }
  ],
  '/api/': [
    {
      text: 'API',
      items: [
        {
          text: 'API',
          link: '/api/api'
        },
        {
          text: 'Plugin API',
          link: '/api/plugin-api'
        }
      ]
    }
  ],
  '/plugins/': [
    {
      text: 'Plugin Introduction',
      items: [
        {
          text: 'Introduction',
          link: '/plugins/index'
        }
      ]
    },
    {
      text: 'Plugin List',
      items: [
        {
          text: 'HTTP Request',
          link: '/plugins/request'
        },
        {
          text: 'I18n',
          link: '/plugins/i18n'
        },
        {
          text: 'KeepAlive',
          link: '/plugins/keepalive'
        },
        {
          text: 'Access',
          link: '/plugins/access'
        },
        {
          text: 'UI framework',
          link: '/plugins/uiframework'
        },
        {
          text: 'State management',
          link: '/plugins/statemanagement'
        },
        {
          text: 'Mobile layout',
          link: '/plugins/mobilelayout'
        },
        {
          text: 'Web update notification',
          link: '/plugins/webupdatenotification'
        },
        {
          text: 'CSS assets local',
          link: '/plugins/cssassetslocal'
        },
        {
          text: 'Watermark',
          link: '/plugins/watermark'
        },
        {
          text: 'AssetsRetry',
          link: '/plugins/assetsretry'
        },
        {
          text: 'wConsole',
          link: '/plugins/wconsole'
        },
        {
          text: 'Qiankun',
          link: '/plugins/qiankun'
        },
        {
          text: 'RemoveConsole',
          link: '/plugins/removeconsole'
        },
        {
          text: 'CodeInspector',
          link: '/plugins/codeinspector'
        },
        {
          text: 'IconsLegacy',
          link: '/plugins/iconslegacy'
        },
        {
          text: 'OpeanAPI',
          link: '/plugins/openapi'
        },
        {
          text: 'UnIcons',
          link: '/plugins/unicons'
        },
        {
          text: 'Security',
          link: '/plugins/security'
        },
        {
          text: 'Viewport',
          link: '/plugins/viewport'
        },
        {
          text: 'CheckSyntax',
          link: '/plugins/checksyntax'
        }
      ]
    },
    {
      text: 'Plugin development',
      items: [
        {
          text: 'Develop plugins',
          link: '/plugins/plugins'
        }
      ]
    }
  ],
  '/config/': [
    {
      text: 'Configuration',
      items: [
        { text: 'Basic configuration', link: '/config/config' },
        {
          text: 'Runtime configuration',
          link: '/config/runtime-config'
        }
      ]
    }
  ],
  '/cli/': [
    {
      text: 'CLI',
      items: [
        {
          text: 'Command line',
          link: 'cli/commands'
        }
      ]
    }
  ],
  '/other/': [
    {
      text: 'Other',
      items: [
        {
          text: 'Design philosophy',
          link: 'cli/philosophy'
        },
        {
          text: 'FAQ',
          link: 'cli/faq'
        }
      ]
    }
  ],
  '/blog/': [
    {
      text: 'Blog',
      items: [
        {
          text: 'Migrating create-project to winjs',
          link: 'blog/migrating-create-project-to-winjs'
        }
      ]
    }
  ]
};

export default defineAdditionalConfig({
  lang: 'en-US',
  description: 'Front-end development framework.',

  themeConfig: {
    nav,

    sidebar,

    editLink: {
      pattern: 'https://github.com/winjs-dev/winjs-docs/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2019-${new Date().getFullYear()} winjs-dev`
    }
  }
})

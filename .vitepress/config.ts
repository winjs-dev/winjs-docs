import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { headerPlugin } from './headerMdPlugin';
import { baseURL } from './meta';

const nav = [
  { text: '指南', link: '/guides/getting-started', activeMatch: `^/guides/` },
  { text: '配置', link: '/config/config', activeMatch: `^/config/` },
  { text: '插件', link: '/plugins/index', activeMatch: `^/plugins/` },
  { text: 'API', link: '/api/api', activeMatch: `^/api/` },
  { text: 'CLI', link: '/cli/commands', activeMatch: `^/cli/` },
  { text: '博文', link: '/blog/migrating-create-project-to-win', activeMatch: `^/blog/` },
  {
    text: '了解更多',
    items: [
      {
        text: '前端领域模型',
        link:
          'https://github.com/cklwblove/domain-front'
      },
      {
        text: 'CreateProject',
        link:
          'https://cloud-templates.github.io/create-project/'
      }
    ]
  }
];
export const sidebar = {
  '/guides/': [
    {
      text: '开始',
      items: [
        { text: '介绍', link: '/guides/introduce' },
        {
          text: '快速上手',
          link: '/guides/getting-started'
        },
        {
          text: '版本升级',
          link: '/guides/upgrade'
        },
        {
          text: '构建工具',
          link: '/guides/builder'
        }
      ]
    },
    {
      text: '基础',
      items: [
        {
          text: '开发环境',
          link: '/guides/prepare'
        },
        {
          text: '目录结构',
          link: '/guides/directory-structure'
        },
        {
          text: '环境变量',
          link: '/guides/env-variables'
        },
        {
          text: '编码规范',
          link: '/guides/lint'
        },
        {
          text: '路由',
          link: '/guides/routes'
        },
        {
          text: '插件',
          link: '/guides/use-plugins'
        },
        {
          text: '数据请求',
          link: '/guides/data-request'
        },
        {
          text: 'mock',
          link: '/guides/mock'
        },
        {
          text: 'proxy',
          link: '/guides/proxy'
        },
        {
          text: 'TypeScript',
          link: '/guides/typescript'
        },
        {
          text: '使用 Vue2',
          link: '/guides/with-vue2'
        },
        {
          text: 'Vite 模式',
          link: '/guides/vite'
        },
        {
          text: 'Rsbuild 模式',
          link: '/guides/rsbuild'
        }
      ]
    },
    {
      text: '进阶',
      items: [
        {
          text: '脚手架',
          link: '/guides/boilerplate'
        },
        {
          text: '微生成器',
          link: '/guides/generator'
        },
        {
          text: 'MPA 模式',
          link: '/guides/mpa'
        },
        {
          text: 'autoImport 研发模式',
          link: '/guides/autoImport'
        },
        {
          text: '调试',
          link: '/guides/debug'
        },
        {
          text: '开启 REM 适配',
          link: '/guides/rem'
        },
        {
          text: '构建生产版本',
          link: '/guides/build'
        },
        {
          text: '部署',
          link: '/guides/deploy'
        }
      ]
    },
    {
      text: '样式和资源文件',
      items: [
        { text: '样式', link: '/guides/styling' },
        { text: '静态资源', link: '/guides/assets' }
      ]
    },
    {
      text: '其他',
      items: [
        { text: '代码拆分指南', link: '/guides/code-splitting' },
        { text: '非现代浏览器兼容', link: '/guides/legacy-browser' },
        { text: '产物体积优化', link: '/guides/optimize-bundle' },
        { text: '构建模式', link: '/guides/build-mode' },
        { text: '常见问题', link: '/guides/faq' }
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
          text: '插件 API',
          link: '/api/plugin-api'
        }
      ]
    }
  ],
  '/plugins/': [
    {
      text: '插件介绍',
      items: [
        {
          text: '简介',
          link: '/plugins/index'
        }
      ]
    },
    {
      text: '插件集',
      items: [
        {
          text: 'HTTP 请求',
          link: '/plugins/request'
        },
        // {
        //   text: 'MF',
        //   link: '/plugins/mf'
        // },
        {
          text: '国际化',
          link: '/plugins/i18n'
        },
        {
          text: 'KeepAlive',
          link: '/plugins/keepalive'
        },
        {
          text: '权限',
          link: '/plugins/access'
        },
        {
          text: 'UI 组件库',
          link: '/plugins/uiframework'
        },
        {
          text: '状态管理',
          link: '/plugins/statemanagement'
        },
        {
          text: '移动端布局',
          link: '/plugins/mobilelayout'
        },
        {
          text: '检测网页更新通知用户',
          link: '/plugins/webupdatenotification'
        },
        {
          text: 'CSS 资源本地化',
          link: '/plugins/cssassetslocal'
        },
        {
          text: '水印',
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
          text: 'Qiankun 乾坤',
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
          text: '安全增强',
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
      text: '插件开发',
      items: [
        {
          text: '开发插件',
          link: '/plugins/plugins'
        }
      ]
    }
  ],
  '/config/': [
    {
      text: '配置',
      items: [
        { text: '基础配置', link: '/config/config' },
        {
          text: '运行时配置',
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
          text: '命令行',
          link: 'cli/commands'
        }
      ]
    }
  ],
  '/other/': [
    {
      text: '其他',
      items: [
        {
          text: '设计思路',
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
      text: '博文',
      items: [
        {
          text: '迁移 create-project 到 win',
          link: 'blog/migrating-create-project-to-win'
        }
      ]
    }
  ]
};

export default defineConfig({
  base: baseURL,

  lang: 'zh-CN',
  title: 'WinJS',
  description: '前端开发框架',
  srcDir: 'src',
  scrollOffset: 'header',

  head: [
    ['link', { rel: 'icon', type: 'images/png', href: `${baseURL}favicon.png` }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${baseURL}/images/icons/favicon-16x16.png`
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${baseURL}/images/icons/favicon-32x32.png`
      }
    ],
    ['meta', { name: 'application-name', content: 'WinJS 前端开发框架' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'WinJS 前端开发框架' }],
    ['link', { rel: 'apple-touch-icon', href: `${baseURL}/images/icons/apple-touch-icon.png` }],
    [
      'link',
      {
        rel: 'mask-icon',
        href: `${baseURL}/images/icons/safari-pinned-tab.svg`,
        color: '#3eaf7c'
      }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['script', {}, fs.readFileSync(path.resolve(__dirname, './inlined-scripts/restorePreference.js'), 'utf-8')],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-0Z8G2EZKXV' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-0Z8G2EZKXV');`
    ]
  ],

  lastUpdated: true,

  ignoreDeadLinks: true,

  themeConfig: {
    siteTitle: 'WinJS',
    logo: '/images/logo.png',

    outlineTitle: '本页目录',

    nav,
    sidebar,

    lastUpdatedText: '上次更新',

    footer: {
      message: '基于 MIT 许可发布',
      copyright: `Copyright © 2016-${new Date().getFullYear()} winjs-dev`
    },

    docFooter: {
      prev: '前一篇',
      next: '下一篇'
    },

    outline: 'deep',

    search: {
      provider: 'algolia',
      options: {
        appId: 'JBSB9TIB0G',
        apiKey: '8ad55bcc96464cb6cef8d145cc0c1db8',
        indexName: 'winjs-docs',
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为这个查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/winjs-dev/winjs-docs/edit/main/src/:path',
      text: '在 GitHub 上编辑此页面'
    },

    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  },

  markdown: {
    config(md) {
      md.use(headerPlugin);
      md.use(groupIconMdPlugin);
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cloudflare: 'logos:cloudflare-workers-icon'
        }
      })
    ],
    experimental: {
      enableNativePlugin: true
    }
  }
});

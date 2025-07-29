import { defineAdditionalConfig } from 'vitepress';

const nav = [
  { text: '指南', link: '/zh/guides/getting-started', activeMatch: `^/guides/` },
  { text: '配置', link: '/zh/config/config', activeMatch: `^/config/` },
  { text: '插件', link: '/zh/plugins/introduction', activeMatch: `^/plugins/` },
  { text: 'API', link: '/zh/api/api', activeMatch: `^/api/` },
  { text: 'CLI', link: '/zh/cli/commands', activeMatch: `^/cli/` },
  { text: '博文', link: '/zh/blog/migrating-create-project-to-win', activeMatch: `^/blog/` },
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
  '/zh/guides/': {
    base: '/zh/guides/',
    items: [
      {
        text: '开始',
        items: [
          { text: '介绍', link: 'introduce' },
          {
            text: '快速上手',
            link: 'getting-started'
          },
          {
            text: '版本升级',
            link: 'upgrade'
          },
          {
            text: '构建工具',
            link: 'builder'
          }
        ]
      },
      {
        text: '基础',
        items: [
          {
            text: '开发环境',
            link: 'prepare'
          },
          {
            text: '目录结构',
            link: 'directory-structure'
          },
          {
            text: '环境变量',
            link: 'env-variables'
          },
          {
            text: '编码规范',
            link: 'lint'
          },
          {
            text: '路由',
            link: 'routes'
          },
          {
            text: '插件',
            link: 'use-plugins'
          },
          {
            text: '数据请求',
            link: 'data-request'
          },
          {
            text: 'mock',
            link: 'mock'
          },
          {
            text: 'proxy',
            link: 'proxy'
          },
          {
            text: 'TypeScript',
            link: 'typescript'
          },
          {
            text: '使用 Vue2',
            link: 'with-vue2'
          },
          {
            text: 'Vite 模式',
            link: 'vite'
          },
          {
            text: 'Rsbuild 模式',
            link: 'rsbuild'
          }
        ]
      },
      {
        text: '进阶',
        items: [
          {
            text: '脚手架',
            link: 'boilerplate'
          },
          {
            text: '微生成器',
            link: 'generator'
          },
          {
            text: 'MPA 模式',
            link: 'mpa'
          },
          {
            text: 'autoImport 研发模式',
            link: 'autoImport'
          },
          {
            text: '调试',
            link: 'debug'
          },
          {
            text: '开启 REM 适配',
            link: 'rem'
          },
          {
            text: '构建生产版本',
            link: 'build'
          },
          {
            text: '部署',
            link: 'deploy'
          }
        ]
      },
      {
        text: '样式和资源文件',
        items: [
          { text: '样式', link: 'styling' },
          { text: '静态资源', link: 'assets' }
        ]
      },
      {
        text: '其他',
        items: [
          { text: '代码拆分指南', link: 'code-splitting' },
          { text: '非现代浏览器兼容', link: 'legacy-browser' },
          { text: '产物体积优化', link: 'optimize-bundle' },
          { text: '构建模式', link: 'build-mode' },
          { text: '常见问题', link: 'faq' }
        ]
      }
    ]
  },
  '/zh/api/': {
    base: '/zh/api/',
    items: [
      {
        text: 'API',
        items: [
          {
            text: 'API',
            link: 'api'
          },
          {
            text: '插件 API',
            link: 'plugin-api'
          }
        ]
      }
    ]
  },
  '/zh/plugins/': {
    base: '/zh/plugins/',
    items: [
      {
        text: '插件介绍',
        items: [
          {
            text: '简介',
            link: 'introduction'
          }
        ]
      },
      {
        text: '插件集',
        items: [
          {
            text: 'HTTP 请求',
            link: 'request'
          },
          {
            text: '国际化',
            link: 'i18n'
          },
          {
            text: 'KeepAlive',
            link: 'keepalive'
          },
          {
            text: '权限',
            link: 'access'
          },
          {
            text: 'UI 组件库',
            link: 'uiframework'
          },
          {
            text: '状态管理',
            link: 'statemanagement'
          },
          {
            text: '移动端布局',
            link: 'mobilelayout'
          },
          {
            text: '检测网页更新通知用户',
            link: 'webupdatenotification'
          },
          {
            text: 'CSS 资源本地化',
            link: 'cssassetslocal'
          },
          {
            text: '水印',
            link: 'watermark'
          },
          {
            text: 'AssetsRetry',
            link: 'assetsretry'
          },
          {
            text: 'wConsole',
            link: 'wconsole'
          },
          {
            text: 'Qiankun 乾坤',
            link: 'qiankun'
          },
          {
            text: 'RemoveConsole',
            link: 'removeconsole'
          },
          {
            text: 'CodeInspector',
            link: 'codeinspector'
          },
          {
            text: 'IconsLegacy',
            link: 'iconslegacy'
          },
          {
            text: 'OpeanAPI',
            link: 'openapi'
          },
          {
            text: 'UnIcons',
            link: 'unicons'
          },
          {
            text: '安全增强',
            link: 'security'
          },
          {
            text: 'Viewport',
            link: 'viewport'
          },
          {
            text: 'CheckSyntax',
            link: 'checksyntax'
          }
        ]
      },
      {
        text: '插件开发',
        items: [
          {
            text: '开发插件',
            link: 'plugins'
          }
        ]
      }
    ]
  },
  '/zh/config/': {
    base: '/zh/config/',
    items: [
      {
        text: '配置',
        items: [
          { text: '基础配置', link: 'config' },
          {
            text: '运行时配置',
            link: 'runtime-config'
          }
        ]
      }
    ]
  },
  '/zh/cli/': {
    base: '/zh/cli/',
    items: [
      {
        text: 'CLI',
        items: [
          {
            text: '命令行',
            link: 'commands'
          }
        ]
      }
    ]
  },
  '/zh/blog/': {
    base: '/zh/blog/',
    items: [
      {
        text: '博文',
        items: [
          {
            text: '迁移 create-project 到 win',
            link: 'migrating-create-project-to-win'
          }
        ]
      }
    ]
  }
};

export default defineAdditionalConfig({
  lang: 'zh-Hans',
  description: '前端开发框架',

  themeConfig: {
    outlineTitle: '本页目录',

    nav,
    sidebar,

    lastUpdatedText: '上次更新',

    footer: {
      message: '基于 MIT 许可发布',
      copyright: `Copyright © 2016-${new Date().getFullYear()} winjs-dev`
    },

    editLink: {
      pattern: 'https://github.com/winjs-dev/winjs-docs/edit/main/src/:path',
      text: '在 GitHub 上编辑此页面'
    },

    docFooter: {
      prev: '前一篇',
      next: '下一篇'
    },


    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  }
});

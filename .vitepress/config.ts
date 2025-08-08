import fs from 'fs';
import path from 'path';
import { defineConfig, resolveSiteDataByRoute, type HeadConfig } from 'vitepress';
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { headerPlugin } from './headerMdPlugin';
import { baseURL } from './meta';

const prod = !!process.env.NETLIFY;

export default defineConfig({
  base: baseURL,

  title: 'WinJS',

  rewrites: {
    'en/:rest*': ':rest*'
  },

  srcDir: 'src',
  scrollOffset: 'header',

  sitemap: {
    hostname: 'https://winjs-dev.github.io/winjs-docs/',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'));
    }
  },

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
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-0Z8G2EZKXV' }],
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
  cleanUrls: true,
  metaChunk: true,
  ignoreDeadLinks: true,

  themeConfig: {
    siteTitle: 'WinJS',
    logo: '/images/logo.png',

    outline: {
      level: 'deep'
    }
  },

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文' }
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
      pagefindPlugin({
        locales: {
          root: {
            btnPlaceholder: 'Search',
            placeholder: 'Search Docs...',
            emptyText: 'No results',
            heading: 'Total: {{searchResult}} search results.'
          },
          zh: {
            btnPlaceholder: '搜索',
            placeholder: '搜索文档',
            emptyText: '空空如也',
            heading: '共: {{searchResult}} 条结果',
            customSearchQuery: chineseSearchOptimize
          }
        }
      }),
      groupIconVitePlugin({
        customIcon: {
          cloudflare: 'logos:cloudflare-workers-icon'
        }
      })
    ],
    experimental: {
      enableNativePlugin: true
    }
  },

  transformPageData: prod
    ? (pageData, ctx) => {
        const site = resolveSiteDataByRoute(ctx.siteConfig.site, pageData.relativePath);
        const title = `${pageData.title || site.title} | ${pageData.description || site.description}`;
        ((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
          ['meta', { property: 'og:locale', content: site.lang }],
          ['meta', { property: 'og:title', content: title }]
        );
      }
    : undefined
});

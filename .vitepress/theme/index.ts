import './styles/index.css';
import { h, App } from 'vue';
import Theme from 'vitepress/theme';
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences';
import NavbarTitle from './components/NavbarTitle.vue';
import VersionTag from './components/VersionTag.vue';
import SpecialRemark from './components/SpecialMark.vue';
import ImagePreview from './components/ImagePreview.vue';
import 'virtual:group-icons.css';
import CopyOrDownloadAsMarkdownButtons
  from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue';

import './styles/vars.css';
import type { EnhanceAppContext } from 'vitepress/dist/client';

export default Object.assign({}, Theme, {
  Layout: () => {
    // @ts-ignore
    return h(Theme.Layout, null, {
      'navbar-title': () => h(NavbarTitle)
    });
  },
  enhanceApp(ctx: EnhanceAppContext) {
    Theme.enhanceApp(ctx);
    ctx.app.provide('prefer-composition', preferComposition);
    ctx.app.provide('prefer-sfc', preferSFC);
    ctx.app.provide('filter-headers', filterHeadersByPreference);
    ctx.app.component('VersionTag', VersionTag);
    ctx.app.component('SpecialRemark', SpecialRemark);
    ctx.app.component('ImagePreview', ImagePreview);
    ctx.app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons);
  }
});

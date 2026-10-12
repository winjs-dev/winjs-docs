<!-- v1.0.0 release banner: pinned to the very top of the viewport via the
     layout-top slot, above the navbar. Dismissible; the dismissal is stored
     in localStorage (per version) so it stays hidden across pages/reloads.
     Bilingual: zh copy + /zh/ upgrade link when the zh locale tree is active.

     Layout contract: VitePress expects layout-top content to be OUT of flow —
     VPNav/VPSidebar offset by top: var(--vp-layout-top-height) and VPContent
     by the same margin-top, so this component must be position: fixed;
     otherwise the content area gets pushed down twice and text overlaps.
     Stacking ladder (official vars.css): footer 10 < local-nav 20 < nav 30
     < layout-top 40 < backdrop 50 < sidebar 60; the banner must sit above
     everything, so it uses 70 with an opaque background. -->
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';

const { localeIndex } = useData();
const isZh = computed(() => localeIndex.value === 'zh');
// withBase needs a leading slash: it returns relative paths unchanged.
// Never read `.base` from useData() — it is not part of its return value.
const href = computed(() =>
  withBase(isZh.value ? '/zh/guides/upgrade.html' : '/guides/upgrade.html')
);
const copy = computed(() =>
  isZh.value
    ? { text: 'WinJS 1.0.0 正式版已发布', cta: '查看升级指南', close: '关闭横幅' }
    : { text: 'WinJS 1.0.0 stable release is out', cta: 'View the upgrade guide', close: 'Dismiss banner' }
);

const DISMISS_KEY = 'win-release-banner-1.0.0';
const visible = ref(true);

const setLayoutTopHeight = (height) => {
  document.documentElement.style.setProperty('--vp-layout-top-height', height);
};

const close = () => {
  visible.value = false;
  setLayoutTopHeight('0px');
  try {
    localStorage.setItem(DISMISS_KEY, '1');
  } catch {
    /* private-mode fallback: hide for this session only */
  }
};

onMounted(() => {
  try {
    if (localStorage.getItem(DISMISS_KEY) === '1') {
      visible.value = false;
      setLayoutTopHeight('0px');
    }
  } catch {
    /* same as above */
  }
});
</script>

<template>
  <div v-if="visible" class="win-release-banner">
    <a class="win-release-banner__link" :href="href">
      <span class="win-release-banner__tag">NEW</span>
      <span class="win-release-banner__text">{{ copy.text }}</span>
      <span class="win-release-banner__cta">{{ copy.cta }}</span>
    </a>
    <button
      class="win-release-banner__close"
      type="button"
      :aria-label="copy.close"
      @click="close"
    >×</button>
  </div>
</template>

<!-- unscoped: takes effect in the SSR first paint to avoid the navbar
     briefly overlapping the banner -->
<style>
:root {
  --vp-layout-top-height: 38px;
}
</style>

<style scoped>
.win-release-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--vp-layout-top-height, 38px);
  /* opaque background: scrolling content passes under the banner unseen,
     preventing text bleeding through */
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-brand-1);
  font-size: 14px;
  line-height: 1.6;
}

.win-release-banner__link {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  white-space: nowrap;
}

.win-release-banner__link:hover .win-release-banner__cta {
  text-decoration: underline;
}

.win-release-banner__tag {
  padding: 1px 9px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-size: 12px;
  font-weight: 600;
}

.win-release-banner__cta {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.win-release-banner__close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.win-release-banner__close:hover {
  color: var(--vp-c-text-1);
}

/* drop the middle copy on narrow screens to keep the single-line height
   stable (layout-top-height is a fixed value) */
@media (max-width: 768px) {
  .win-release-banner__text {
    display: none;
  }
}
</style>

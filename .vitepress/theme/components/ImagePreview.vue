<script lang="ts" setup>
import {computed} from 'vue';
import { withBase } from 'vitepress';
import { ElImage } from 'element-plus';
import 'element-plus/theme-chalk/el-image.css';
import 'element-plus/theme-chalk/el-image-viewer.css';
import 'element-plus/theme-chalk/base.css';

const props = defineProps<{
  url: string,
  alt: string
}>();

const formatURL = computed(() => withBase(props.url));

</script>

<template>
  <div class="demo-image__preview">
    <el-image
      :src="formatURL"
      :zoom-rate="1.2"
      :preview-src-list="[formatURL]"
      :initial-index="4"
      :alt="alt"
      fit="cover"
    />
  </div>
</template>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>

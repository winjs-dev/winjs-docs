<script lang="ts" setup>
import { ElTag } from 'element-plus';
import 'element-plus/theme-chalk/el-tag.css';
import 'element-plus/theme-chalk/base.css';

defineProps<{
  version: string
}>()
</script>

<template>
  <el-tag size="small" effect="plain" hit round>
    v{{ version }}
  </el-tag>
</template>

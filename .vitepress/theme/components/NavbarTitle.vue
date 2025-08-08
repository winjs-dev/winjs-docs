<script lang="ts" setup>
import { withBase } from 'vitepress'
</script>

<template>
  <img class="logo" :src="withBase('images/logo.png')" alt="logo">WinJS
</template>

<style scoped>
.logo {
  max-width: 100%;
  height: 20px;
  margin-right: 8px;
  display: inline-block;
}
</style>



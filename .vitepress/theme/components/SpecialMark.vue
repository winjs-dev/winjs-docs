<script setup lang="ts">

const props = defineProps<{
  text: string
}>();

</script>

<template>
  <span class='special-remark'>{{ text }}</span>
</template>

<style scoped>
.special-remark {
  color:#0070ef;
}
</style>

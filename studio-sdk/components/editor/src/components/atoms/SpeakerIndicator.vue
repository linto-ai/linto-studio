<template>
  <span class="speaker-indicator" :style="{ backgroundColor: color }" aria-hidden="true" />
</template>

<script setup lang="ts">
defineProps<{
  color: string
}>()
</script>

<style scoped>
.speaker-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import { Copy, ClipboardList, Check } from "lucide-vue-next"
import EditorButton from "./EditorButton.vue"

const props = withDefaults(
  defineProps<{
    icon?: "copy" | "clipboard-list"
    copyFn: () => Promise<void>
  }>(),
  {
    icon: "copy",
  },
)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function onClick() {
  if (copied.value) return
  try {
    await props.copyFn()
    copied.value = true
    timer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
  }
}

defineExpose({ reset: () => { copied.value = false; clearTimeout(timer) } })
</script>

<template>
  <EditorButton size="sm" :class="{ 'copy-btn--copied': copied }" @click="onClick">
    <template #icon>
      <Transition name="copy-icon" mode="out-in">
        <Check v-if="copied" :size="14" />
        <Copy v-else-if="icon === 'copy'" :size="14" />
        <ClipboardList v-else :size="14" />
      </Transition>
    </template>
    <slot />
  </EditorButton>
</template>

<style scoped>
.copy-btn--copied {
  color: var(--color-success, #2e7d32);
}

.copy-icon-enter-active,
.copy-icon-leave-active {
  transition: opacity var(--transition-duration) ease,
    scale var(--transition-duration) ease;
}

.copy-icon-enter-from {
  opacity: 0;
  scale: 0.6;
}

.copy-icon-leave-to {
  opacity: 0;
  scale: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .copy-icon-enter-active,
  .copy-icon-leave-active {
    transition: none;
  }
}
</style>

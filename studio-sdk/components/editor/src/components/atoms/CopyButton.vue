<script setup lang="ts">
import { computed, ref } from "vue"
import EditorButton from "./EditorButton.vue"
import EditorIcon from "./EditorIcon.vue"
import { ICON_SIZES } from "./icons"

const props = withDefaults(
  defineProps<{
    icon?: "copy" | "clipboard-list" | "clipboard-type"
    copyFn: () => Promise<void>
    variant?: "primary" | "secondary" | "tertiary" | "transparent"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    block?: boolean
    ariaLabel?: string
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

defineExpose({
  reset: () => {
    copied.value = false
    clearTimeout(timer)
  },
})

const currentIconName = computed(() => (copied.value ? "check" : props.icon))
const iconSize = computed(() => ICON_SIZES[props.size ?? "sm"])
</script>

<template>
  <EditorButton
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :block="block"
    :aria-label="ariaLabel"
    :class="{ 'copy-btn--copied': copied }"
    @click="onClick">
    <template #icon>
      <Transition name="copy-icon" mode="out-in">
        <EditorIcon
          :key="currentIconName"
          :name="currentIconName"
          :size="iconSize" />
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
  transition:
    opacity var(--transition-duration) ease,
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

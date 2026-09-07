<script setup lang="ts">
import { computed } from "vue"
import { computeInitials } from "../utils/computeInitials"

// Initials avatar for a user (not a speaker — speakers have SpeakerIndicator).
// The full name shows on hover (native tooltip) and to assistive tech; pass
// `label` when the context needs a richer sentence than the bare name.
const props = defineProps<{
  name: string
  label?: string
}>()

const initials = computed(() => computeInitials(props.name))
const title = computed(() => props.label ?? props.name)
</script>

<template>
  <span class="user-avatar" role="img" :title="title" :aria-label="title">{{
    initials
  }}</span>
</template>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: 600;
  user-select: none;
  cursor: default;
}
</style>

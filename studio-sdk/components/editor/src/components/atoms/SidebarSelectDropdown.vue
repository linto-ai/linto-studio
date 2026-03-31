<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ChevronDown, Check } from "lucide-vue-next"
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from "reka-ui"

defineProps<{
  items: { value: string; label: string }[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()

const selectEl = ref<HTMLElement>()
const boundary = ref<Element[]>([])

onMounted(() => {
  const sidebar = selectEl.value?.closest('.speaker-sidebar')
  if (sidebar) boundary.value = [sidebar]
})
</script>

<template>
  <div class="sidebar-select" ref="selectEl">
    <SelectRoot
      :model-value="selectedValue"
      @update:model-value="emit('update:selectedValue', $event as string)">
      <SelectTrigger class="sidebar-select-trigger" :aria-label="ariaLabel">
        <SelectValue class="sidebar-select-trigger-label" />
        <SelectIcon>
          <ChevronDown :size="16" />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal disabled>
        <SelectContent
          class="sidebar-select-content"
          position="popper"
          :side-offset="4"
          position-strategy="absolute"
          :collision-boundary="boundary">
          <SelectViewport>
            <SelectItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              class="sidebar-select-item">
              <SelectItemIndicator class="sidebar-select-item-indicator">
                <Check :size="14" />
              </SelectItemIndicator>
              <SelectItemText>{{ item.label }}</SelectItemText>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

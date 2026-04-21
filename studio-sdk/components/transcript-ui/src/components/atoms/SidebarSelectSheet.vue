<script setup lang="ts" generic="T extends { value: string; label: string }">
import { ref, computed } from "vue"
import { Check } from "lucide-vue-next"
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  ListboxRoot,
  ListboxContent,
  ListboxItem,
  ListboxItemIndicator,
  //ListboxFilter,
} from "reka-ui"
//import { useI18n } from "../../i18n"

const props = defineProps<{
  items: T[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()

defineSlots<{
  item(props: { item: T }): unknown
  trigger(props: { item: T | undefined }): unknown
}>()

//const { t } = useI18n()
const isOpen = ref(false)
//const filterThreshold = 7

const selectedItem = computed(() =>
  props.items.find((i) => i.value === props.selectedValue),
)

function onSelect(value: string) {
  emit("update:selectedValue", value)
  isOpen.value = false
}
</script>

<template>
  <div class="sidebar-select">
    <button
      class="sidebar-select-trigger"
      :aria-label="ariaLabel"
      @click="isOpen = true">
      <span class="sidebar-select-trigger-label">
        <slot name="trigger" :item="selectedItem">{{ selectedItem?.label ?? "" }}</slot>
      </span>
    </button>

    <DialogRoot v-model:open="isOpen">
      <DialogPortal disabled>
        <DialogOverlay class="editor-overlay" />
        <DialogContent class="sheet-content" aria-describedby="">
          <DialogTitle class="sr-only">{{ ariaLabel }}</DialogTitle>
          <div class="sheet-handle" />
          <ListboxRoot
            :model-value="selectedValue"
            @update:model-value="onSelect($event as string)">
            <!-- <ListboxFilter
              v-if="items.length > filterThreshold"
              class="sheet-filter"
              :placeholder="t('select.filter')" /> -->
            <ListboxContent class="sheet-list">
              <ListboxItem
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                class="sheet-item">
                <ListboxItemIndicator class="sheet-item-indicator">
                  <Check :size="16" />
                </ListboxItemIndicator>
                <slot name="item" :item="item">{{ item.label }}</slot>
              </ListboxItem>
            </ListboxContent>
          </ListboxRoot>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

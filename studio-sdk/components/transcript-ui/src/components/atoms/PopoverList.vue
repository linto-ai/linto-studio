<script setup lang="ts" generic="T">
import { computed, ref } from "vue"
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "reka-ui"

const props = withDefaults(
  defineProps<{
    items: T[]
    itemKey?: (item: T) => string | number
    isCurrent?: (item: T) => boolean
    align?: "start" | "center" | "end"
    side?: "top" | "right" | "bottom" | "left"
    sideOffset?: number
    open?: boolean
  }>(),
  {
    align: "start",
    side: "bottom",
    sideOffset: 4,
  },
)

const emit = defineEmits<{
  select: [item: T]
  "update:open": [value: boolean]
}>()

const internalOpen = ref(false)
const resolvedOpen = computed({
  get: () => {
    if (props.open !== undefined) {
      return internalOpen.value
    }
    return props.open
  },
  set: (v) => {
    internalOpen.value = v
    emit("update:open", v)
  },
})

defineSlots<{
  trigger?: () => unknown
  item: (slotProps: { item: T }) => unknown
  footer?: () => unknown
}>()

function keyFor(item: T, index: number): string | number {
  return props.itemKey ? props.itemKey(item) : index
}
</script>

<template>
  <DropdownMenuRoot v-model:open="resolvedOpen">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal disabled>
      <DropdownMenuContent
        class="popover-list"
        position-strategy="absolute"
        :side="side"
        :align="align"
        :side-offset="sideOffset">
        <ul v-if="items.length > 0" class="popover-list__items">
          <DropdownMenuItem
            v-for="(item, index) in items"
            :key="keyFor(item, index)"
            as="li"
            class="popover-list__item"
            :class="{ 'popover-list__item--current': isCurrent?.(item) }"
            @select="emit('select', item)">
            <slot name="item" :item="item" />
          </DropdownMenuItem>
        </ul>
        <template v-if="$slots.footer">
          <div v-if="items.length > 0" class="popover-list__divider" />
          <div class="popover-list__footer">
            <slot name="footer" />
          </div>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

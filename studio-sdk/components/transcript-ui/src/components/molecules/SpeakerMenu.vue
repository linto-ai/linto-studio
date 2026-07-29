<script setup lang="ts">
import { computed } from "vue"
import PopoverList from "../atoms/PopoverList.vue"
import Button from "../atoms/Button.vue"
import { useI18n } from "../../i18n"

interface MenuAction {
  id: "merge"
  label: string
}

const emit = defineEmits<{
  merge: []
}>()

const { t } = useI18n()

const items = computed<MenuAction[]>(() => [
  { id: "merge", label: t("speakerMenu.merge") },
])

function onSelect(action: MenuAction): void {
  if (action.id === "merge") emit("merge")
}
</script>

<template>
  <PopoverList
    :items="items"
    :item-key="(a) => a.id"
    align="end"
    @select="onSelect">
    <template #trigger>
      <Button
        icon="more-vertical"
        variant="transparent"
        :aria-label="t('speakerMenu.openMenu')" />
    </template>
    <template #item="{ item }">
      <span>{{ item.label }}</span>
    </template>
  </PopoverList>
</template>

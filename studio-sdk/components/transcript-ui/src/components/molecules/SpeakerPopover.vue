<script setup lang="ts">
import { ref, computed, nextTick, useTemplateRef, watch } from "vue"
import PopoverList from "../atoms/PopoverList.vue"
import SpeakerIndicator from "../atoms/SpeakerIndicator.vue"
import Button from "../atoms/Button.vue"
import FormInput, { type FormField } from "./FormInput.vue"
import { useCore } from "../../core"
import { useI18n } from "../../i18n"
import {
  switchTurnSpeaker,
  createSpeakerAndAssign,
} from "../../plugins/transcriptionEditor/utils/speakerActions"
import type { Speaker } from "../../types/editor"

const props = defineProps<{
  turnId: string
  currentSpeakerId: string | null
}>()

const core = useCore()
const { t } = useI18n()

const isOpen = ref(false)
const isCreatingNew = ref(false)
const newName = ref("")
const newInputRef = useTemplateRef<{ focus: () => void }>("newInput")

const speakers = computed(() => Array.from(core.speakers.all.values()))

const newSpeakerField = computed<FormField>(() => ({
  placeholder: t("speakerPopover.newSpeakerPlaceholder"),
  customParams: { "aria-label": t("speakerPopover.newSpeaker") },
}))

watch(isOpen, (open) => {
  if (!open) {
    isCreatingNew.value = false
    newName.value = ""
  }
})

async function startCreatingNew(): Promise<void> {
  isCreatingNew.value = true
  newName.value = ""
  await nextTick()
  newInputRef.value?.focus()
}

function onPickExisting(speaker: Speaker): void {
  if (speaker.id !== props.currentSpeakerId) {
    switchTurnSpeaker(core, props.turnId, speaker.id)
  }
  isOpen.value = false
}

function submitNew(): void {
  const trimmed = newName.value.trim()
  if (!trimmed) {
    isCreatingNew.value = false
    return
  }
  createSpeakerAndAssign(core, props.turnId, trimmed)
  isOpen.value = false
}

function onNewKeydown(e: KeyboardEvent): void {
  // Prevent DropdownMenu typeahead / keyboard nav from hijacking the input.
  // Enter / Escape are handled by FormInput's withConfirmation.
  e.stopPropagation()
}

function onCancelNew(): void {
  isCreatingNew.value = false
}
</script>

<template>
  <PopoverList
    v-model:open="isOpen"
    :items="speakers"
    :item-key="(s) => s.id"
    :is-current="(s) => s.id === currentSpeakerId"
    @select="onPickExisting">
    <template #trigger>
      <button type="button" class="speaker-popover-trigger">
        <slot />
      </button>
    </template>
    <template #item="{ item }">
      <SpeakerIndicator :color="item.color" />
      <span class="speaker-popover-name">{{ item.name }}</span>
    </template>
    <template #footer>
      <Button
        v-if="!isCreatingNew"
        icon="user-plus"
        variant="transparent"
        block
        @click="startCreatingNew">
        {{ t('speakerPopover.newSpeaker') }}
      </Button>
      <FormInput
        v-else
        ref="newInput"
        v-model="newName"
        :field="newSpeakerField"
        size="sm"
        full-width
        with-confirmation
        @keydown="onNewKeydown"
        @on-confirm="submitNew"
        @on-cancel="onCancelNew" />
    </template>
  </PopoverList>
</template>

<style scoped>
.speaker-popover-trigger {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-sm);
}

.speaker-popover-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.speaker-popover-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

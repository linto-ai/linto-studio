<script setup lang="ts">
import { Button, EditorCheckbox, UserAvatar, TurnTextEditor } from "@linto/transcript-ui-ui"
import { computed, ref, useTemplateRef } from "vue"
import SpeakerLabel from "./SpeakerLabel.vue"
import MergeTurnsButton from "./molecules/MergeTurnsButton.vue"
import SpeakerPopover from "./molecules/SpeakerPopover.vue"
import { useCore } from "../core"
import { useTurnSelection } from "../composables/useTurnSelection"
import { useI18n } from "@linto/transcript-ui-i18n"
import * as utils from "../utils"
import { computeTurnPlainText } from "../utils/computeTurnPlainText"
import { computeCaretOffsetFromPoint } from "../utils/computeCaretOffsetFromPoint"
import { findWordAtOffset } from "../utils/findWordAtOffset"
import type { Turn, Speaker } from "../types/editor"

const props = defineProps<{
  turn: Turn
  speaker?: Speaker
  partial?: boolean
  live?: boolean
  /** Id of the preceding turn — hosts the merge control above this turn. */
  previousTurnId?: string
}>()

const core = useCore()
const selection = useTurnSelection()
const { t } = useI18n()

const hasWords = computed(() => props.turn.words.length > 0)

const activeWordId = computed(() => {
  if (!core.audio?.src.value || !hasWords.value) return null
  const time = core.audio.currentTime.value
  const { startTime, endTime, words } = props.turn
  if (startTime == null || endTime == null) return null
  if (time < startTime || time > endTime) return null
  return utils.findActiveWord(words, time)
})

const isTurnActive = computed(() => {
  if (!core.audio?.src.value) return false
  if (props.turn.startTime == null || props.turn.endTime == null) return false
  if (utils.hasWordTimestamps(props.turn.words)) return false
  const time = core.audio.currentTime.value
  return time >= props.turn.startTime && time <= props.turn.endTime
})

const speakerColor = computed(() => props.speaker?.color ?? "transparent")

const isSelected = computed(() => selection.isSelected(props.turn.id))

const checkboxLabel = computed(() => {
  const name = props.speaker?.name ?? ""
  const key = isSelected.value ? "selection.deselect" : "selection.select"
  return t(key).replace("{name}", name)
})

// ── Per-turn text editing (transcriptionEditor plugin) ────────────────

const canEditText = computed(
  () =>
    core.transcriptionEditor !== undefined &&
    core.capabilities.value.text === "edit" &&
    !props.partial &&
    !props.live,
)

const isEditing = computed(
  () => core.transcriptionEditor?.editingTurnId.value === props.turn.id,
)

// Lock held by someone else: the plugin stores own locks too, but the turn
// being edited HERE renders the editor instead — so any visible lock is
// "another session" by construction (including the same user's other tab).
const turnLock = computed(() =>
  isEditing.value
    ? undefined
    : core.transcriptionEditor?.getTurnLock(props.turn.id),
)

const lockedByLabel = computed(() =>
  turnLock.value
    ? t("transcription.lockedBy").replace("{name}", turnLock.value.userName)
    : "",
)

const isTextInteractive = computed(() => canEditText.value && !turnLock.value)

const plainText = computed(() => computeTurnPlainText(props.turn))

const editorRef = useTemplateRef<InstanceType<typeof TurnTextEditor>>("editor")

function onTextClick(event: MouseEvent) {
  const container = event.currentTarget as HTMLElement
  const offset = computeCaretOffsetFromPoint(
    container,
    event.clientX,
    event.clientY,
  )

  seekToClickedWord(offset)

  if (!isTextInteractive.value) return
  void core.transcriptionEditor!.beginEdit(
    props.turn.id,
    offset ?? plainText.value.length,
  )
}

// Clicking a word cues the audio there, paused — a reading feature, active
// in every mode (viewer included). Untimed word (freshly edited zone) or
// text-only turn: fall back to the turn start; no time at all: no seek.
function seekToClickedWord(offset: number | null) {
  if (!core.audio) return
  const word =
    offset !== null ? findWordAtOffset(props.turn.words, offset) : undefined
  const time = word?.startTime ?? props.turn.startTime
  if (time == null) return
  core.audio.seekTo(time)
  core.audio.pause()
}

function onTextKeydown(event: KeyboardEvent) {
  if (!isTextInteractive.value || event.key !== "Enter") return
  event.preventDefault()
  void core.transcriptionEditor!.beginEdit(props.turn.id, 0)
}

function onEditorSave(text: string) {
  core.transcriptionEditor!.saveTurn(text)
}

function onEditorCancel() {
  core.transcriptionEditor!.cancelEdit()
}

function onEditorSplit(text: string, offset: number) {
  core.transcriptionEditor!.splitTurn(text, offset)
}

// Header buttons: mousedown is prevented in the template so the editable
// keeps focus — no blur-save racing ahead of the explicit action.
function onValidateClick() {
  core.transcriptionEditor!.saveTurn(
    editorRef.value?.getText() ?? plainText.value,
  )
}

function onCancelClick() {
  core.transcriptionEditor!.cancelEdit()
}

// ── Speaker assignment (SpeakerPopover, mounted lazily on first click:
// hundreds of turns must not each carry a popover instance) ────────────

const canEditSpeakers = computed(
  () =>
    core.transcriptionEditor !== undefined &&
    core.capabilities.value.speakers === "edit" &&
    !props.partial &&
    !props.live,
)

const speakerPopoverMounted = ref(false)

function onSpeakerClick() {
  speakerPopoverMounted.value = true
}

function onHeaderClick(event: MouseEvent) {
  // Selecting the turn being edited makes no sense — the header hosts the
  // save/cancel actions while editing.
  if (isEditing.value) return
  if (event.shiftKey) {
    selection.selectRange(props.turn.id)
  } else {
    selection.toggle(props.turn.id)
  }
}

function onCheckboxChange(event: MouseEvent) {
  if (event.shiftKey) {
    selection.selectRange(props.turn.id)
  } else {
    selection.toggle(props.turn.id)
  }
}
</script>

<template>
  <section
    class="turn"
    :class="{
      'turn--active': isTurnActive,
      'turn--partial': partial,
      'turn--selected': isSelected,
    }"
    :data-turn-active="isTurnActive || partial || live || undefined"
    :style="{ '--speaker-color': speakerColor }"
    :aria-selected="selection.hasSelection.value ? isSelected : undefined">
    <MergeTurnsButton
      v-if="previousTurnId && !partial && !live"
      :first-turn-id="previousTurnId"
      :second-turn-id="turn.id" />
    <div v-if="!partial" class="turn-header" @click="onHeaderClick">
      <EditorCheckbox
        v-if="selection.hasSelection.value"
        :model-value="isSelected"
        :aria-label="checkboxLabel"
        @click.stop="onCheckboxChange" />
      <SpeakerPopover
        v-if="speakerPopoverMounted"
        :turn-id="turn.id"
        :current-speaker-id="turn.speakerId"
        initial-open>
        <SpeakerLabel
          :speaker="speaker"
          :start-time="turn.startTime"
          :start-date="turn.startDate"
          :language="turn.language"
          interactive />
      </SpeakerPopover>
      <button
        v-else-if="canEditSpeakers"
        type="button"
        class="speaker-trigger"
        @click.stop="onSpeakerClick">
        <SpeakerLabel
          :speaker="speaker"
          :start-time="turn.startTime"
          :start-date="turn.startDate"
          :language="turn.language"
          interactive />
      </button>
      <SpeakerLabel
        v-else
        :speaker="speaker"
        :start-time="turn.startTime"
        :start-date="turn.startDate"
        :language="turn.language" />
      <div v-if="isEditing || turnLock" class="turn-edit-actions">
        <template v-if="isEditing">
          <Button
            size="sm"
            variant="tertiary"
            icon="x"
            :aria-label="t('transcription.cancelEdit')"
            @mousedown.prevent
            @click.stop="onCancelClick" />
          <Button
            size="sm"
            variant="primary"
            icon="check"
            :aria-label="t('transcription.saveEdit')"
            @mousedown.prevent
            @click.stop="onValidateClick" />
        </template>
        <UserAvatar
          v-else
          :name="turnLock!.userName"
          :label="lockedByLabel"
          @click.stop />
      </div>
    </div>
    <TurnTextEditor
      v-if="isEditing"
      ref="editor"
      :text="plainText"
      :caret-offset="core.transcriptionEditor?.editingCaretOffset.value"
      class="turn-text"
      @save="onEditorSave"
      @cancel="onEditorCancel"
      @split="onEditorSplit" />
    <p
      v-else
      class="turn-text"
      :class="{ 'turn-text--editable': isTextInteractive }"
      :role="isTextInteractive ? 'button' : undefined"
      :tabindex="isTextInteractive ? 0 : undefined"
      :aria-label="isTextInteractive ? t('transcription.editTurn') : undefined"
      :aria-disabled="canEditText && turnLock ? true : undefined"
      @click="onTextClick"
      @keydown="onTextKeydown">
      <template v-if="hasWords">
        <template v-for="(word, i) in turn.words" :key="word.id">
          <span
            :class="{ 'word--active': word.id === activeWordId }"
            :data-word-active="word.id === activeWordId || undefined"
            >{{ word.text }}</span
          >{{ i < turn.words.length - 1 ? " " : "" }}
        </template>
      </template>
      <template v-else-if="turn.text">{{ turn.text }}</template>
    </p>
  </section>
</template>

<style scoped>
.turn {
  padding: var(--spacing-sm) var(--spacing-lg);
}

.turn-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xxs) 0;
  /* Reserve the edit-actions height (Button sm) so entering/leaving edit
     mode never shifts the layout. */
  min-height: 36px;
}

.turn-edit-actions {
  margin-left: auto;
  display: flex;
  gap: var(--spacing-xs);
}

/* Same reset as the popover's own trigger: the label IS the button. */
.speaker-trigger {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-sm);
}

.speaker-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.turn:has(.turn-header:hover) {
  background-color: var(--color-surface-hover);
}

.turn-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

.turn-text--editable {
  cursor: text;
}

.turn-text--editable:focus-visible {
  outline: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
}

.turn--selected {
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border-left: 3px solid var(--color-primary);
  padding-left: calc(var(--spacing-lg) - 3px);
}

.turn--active:not(.turn--selected) {
  border-left: 3px solid var(--speaker-color);
  background-color: color-mix(in srgb, var(--speaker-color) 8%, transparent);
  padding-left: calc(var(--spacing-lg) - 3px);
}

.word--active {
  text-decoration: underline;
  text-decoration-color: var(--color-primary);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  color: var(--color-primary);
}

.turn--partial .turn-text {
  font-style: italic;
  color: var(--color-text-muted);
  animation: partial-fade-in 200ms ease;
}

@keyframes partial-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .turn--partial .turn-text {
    animation: none;
  }
}

@media (max-width: 767px) {
  .turn {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .turn--selected,
  .turn--active:not(.turn--selected) {
    padding-left: calc(var(--spacing-md) - 3px);
  }
}
</style>

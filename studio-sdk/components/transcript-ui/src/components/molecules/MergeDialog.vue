<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from "vue"
import Button from "../atoms/Button.vue"
import { useCore } from "../../core"
import { useI18n } from "../../i18n"
import {
  countTurnsForSpeaker,
  mergeSpeakers,
} from "../../plugins/transcriptionEditor/utils/speakerActions"

const props = defineProps<{
  open: boolean
  fromSpeakerId: string | null
}>()

const emit = defineEmits<{
  "update:open": [value: boolean]
}>()

const core = useCore()
const { t } = useI18n()

const dialogRef = useTemplateRef<HTMLDialogElement>("dialog")
const targetId = ref<string>("")

const fromSpeaker = computed(() =>
  props.fromSpeakerId ? core.speakers.all.get(props.fromSpeakerId) : undefined,
)

const candidates = computed(() =>
  Array.from(core.speakers.all.values()).filter(
    (s) => s.id !== props.fromSpeakerId,
  ),
)

const affectedCount = computed(() => {
  const editor = core.transcriptionEditor?.tiptapEditor.value
  if (!editor || !props.fromSpeakerId) return 0
  return countTurnsForSpeaker(editor, props.fromSpeakerId)
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      targetId.value = candidates.value[0]?.id ?? ""
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

function onClose(): void {
  emit("update:open", false)
}

function onConfirm(): void {
  if (!props.fromSpeakerId || !targetId.value) return
  mergeSpeakers(core, props.fromSpeakerId, targetId.value)
  emit("update:open", false)
}
</script>

<template>
  <dialog
    ref="dialog"
    class="merge-dialog"
    @close="onClose"
    @cancel.prevent="onClose">
    <form v-if="fromSpeaker" class="merge-dialog-form" @submit.prevent="onConfirm">
      <h2 class="merge-dialog-title">
        {{ t('mergeDialog.title') }}
      </h2>
      <p class="merge-dialog-description">
        <strong>{{ fromSpeaker.name }}</strong> · {{ affectedCount }}
        {{ t('mergeDialog.turnsAffected') }}
      </p>
      <label class="merge-dialog-label">
        {{ t('mergeDialog.targetLabel') }}
        <select v-model="targetId" class="merge-dialog-select" required>
          <option
            v-for="candidate in candidates"
            :key="candidate.id"
            :value="candidate.id">
            {{ candidate.name }}
          </option>
        </select>
      </label>
      <div class="merge-dialog-actions">
        <Button variant="tertiary" type="button" @click="onClose">
          {{ t('mergeDialog.cancel') }}
        </Button>
        <Button variant="primary" type="submit" :disabled="!targetId">
          {{ t('mergeDialog.confirm') }}
        </Button>
      </div>
    </form>
  </dialog>

</template>

<style scoped>
.merge-dialog {
  margin: auto;
  max-width: 420px;
  width: 90vw;
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  box-shadow: 0 16px 48px color-mix(in srgb, var(--color-text-primary) 20%, transparent);
}

.merge-dialog::backdrop {
  background-color: color-mix(in srgb, var(--color-text-primary) 35%, transparent);
  backdrop-filter: blur(2px);
}

.merge-dialog-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.merge-dialog-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.merge-dialog-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.merge-dialog-label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.merge-dialog-select {
  font-family: inherit;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.merge-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
</style>

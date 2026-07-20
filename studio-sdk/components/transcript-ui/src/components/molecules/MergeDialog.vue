<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from "vue"
import Button from "../atoms/Button.vue"
import FormInput from "./FormInput.vue"
import { useCore } from "../../core"
import { useI18n } from "../../i18n"
import { countTurnsForSpeaker, mergeSpeakers } from "../../core/helpers"

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

const targetOptions = computed(() =>
  candidates.value.map((c) => ({ value: c.id, label: c.name })),
)

const targetField = computed(() => ({
  label: t("mergeDialog.targetLabel"),
  required: true,
}))

const affectedCount = computed(() => {
  if (!props.fromSpeakerId) return 0
  return countTurnsForSpeaker(core, props.fromSpeakerId)
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
      <FormInput
        select
        :field="targetField"
        :options="targetOptions"
        v-model="targetId" />
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
  /* No backdrop-filter: a full-viewport backdrop blur is a large WebRender
     render target; the dim background alone is enough. */
  background-color: color-mix(in srgb, var(--color-text-primary) 35%, transparent);
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

.merge-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
</style>

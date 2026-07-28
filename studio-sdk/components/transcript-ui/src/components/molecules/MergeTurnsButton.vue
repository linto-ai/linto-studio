<script setup lang="ts">
import { computed } from "vue"
import Button from "../atoms/Button.vue"
import { useCore } from "../../core"
import { useI18n } from "../../i18n"

// Always-visible merge control between two adjacent turns. A lock on either
// side DISABLES it (the layout must not jump, and the lock badge tells why);
// the server ack stays the authority on races.
const props = defineProps<{
  firstTurnId: string
  secondTurnId: string
}>()

const core = useCore()
const { t } = useI18n()

const canShow = computed(
  () =>
    core.transcriptionEditor !== undefined &&
    core.capabilities.value.text === "edit",
)

const isDisabled = computed(
  () =>
    !!core.transcriptionEditor?.getTurnLock(props.firstTurnId) ||
    !!core.transcriptionEditor?.getTurnLock(props.secondTurnId),
)

function onMergeClick() {
  core.transcriptionEditor!.mergeTurns(props.firstTurnId, props.secondTurnId)
}
</script>

<template>
  <div v-if="canShow" class="merge-turns">
    <Button
      size="sm"
      variant="inverse"
      icon="merge"
      :disabled="isDisabled"
      :aria-label="t('transcription.mergeTurns')"
      @click.stop="onMergeClick" />
  </div>
</template>

<style scoped>
.merge-turns {
  display: flex;
  justify-content: center;
}

/* Compact: the control sits in the gap between turns without inflating it. */
.merge-turns :deep(.editor-btn) {
  --btn-height: 22px;
}
</style>

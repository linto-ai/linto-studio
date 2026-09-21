<script setup lang="ts">
import { useI18n } from "@linto-ai/transcript-ui-i18n"

defineProps<{ active: boolean }>()

const { t } = useI18n()
</script>

<template>
  <!-- Always rendered, only hidden when nobody is talking: the panel's
       stick-to-bottom watches .turns-container's height, so an element that
       came and went in here would rescroll the whole transcript at every
       silence. `visibility` keeps the box and drops the text from the
       accessibility tree.

       Not a live region either: it comes back with every pause, and a screen
       reader announcing it each time would talk over the transcript it is
       supposed to accompany. -->
  <p class="speech-activity" :class="{ 'speech-activity--idle': !active }">
    {{ t("transcription.speaking") }}
  </p>
</template>

<style scoped>
/* Static on purpose — no pulse, no dots. The people who hide the partial
   text are the ones who wanted the panel to stop moving. */
.speech-activity {
  width: fit-content;
  margin: var(--spacing-sm) var(--spacing-lg);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-hover);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-style: italic;
}

.speech-activity--idle {
  visibility: hidden;
}

@media (max-width: 767px) {
  .speech-activity {
    margin-inline: var(--spacing-md);
  }
}
</style>

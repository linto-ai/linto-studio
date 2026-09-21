<script setup lang="ts">
import { useI18n } from "@linto-ai/transcript-ui-i18n"

defineProps<{ active: boolean }>()

const { t } = useI18n()
</script>

<template>
  <!-- Always rendered, only hidden when nobody is talking: the panel's
       stick-to-bottom watches .turns-container's height, so an element that
       came and went in here would rescroll the whole transcript at every
       silence. `visibility` keeps the box and drops it from the
       accessibility tree.

       Not a live region either: it comes back with every pause, and a screen
       reader announcing it each time would talk over the transcript it is
       supposed to accompany. -->
  <p
    class="speech-activity"
    :class="{ 'speech-activity--idle': !active }"
    role="img"
    :aria-label="t('transcription.speaking')">
    <span class="speech-activity-dot"></span>
    <span class="speech-activity-dot"></span>
    <span class="speech-activity-dot"></span>
  </p>
</template>

<style scoped>
/* Typing bubble, as in messaging apps. The box never changes size, only the
   dots move inside it, so the transcript above stays still. */
.speech-activity {
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  margin: var(--spacing-sm) var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg)
    var(--radius-sm);
  background-color: var(--color-surface-hover);
}

.speech-activity-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--color-text-muted);
  animation: speech-activity-hop 1.2s infinite ease-in-out;
}

.speech-activity-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.speech-activity-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes speech-activity-hop {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.55;
  }
  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.speech-activity--idle {
  visibility: hidden;
}

.speech-activity--idle .speech-activity-dot {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .speech-activity-dot {
    animation: none;
    opacity: 0.8;
  }
}

@media (max-width: 767px) {
  .speech-activity {
    margin-inline: var(--spacing-md);
  }
}
</style>

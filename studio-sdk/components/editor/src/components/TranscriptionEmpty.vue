<script setup lang="ts">
import { useI18n } from "../i18n"
import MicrophoneIllustration from "./MicrophoneIllustration.vue"

const { t } = useI18n()
</script>

<template>
  <div class="transcription-empty">
    <MicrophoneIllustration class="illustration" aria-hidden="true" />
    <p class="message">{{ t("transcription.empty") }}</p>
  </div>
</template>

<style scoped>
.transcription-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.illustration {
  width: 180px;
  height: auto;
  color: var(--color-text-muted);
  opacity: 0.5;
}

.message {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-align: center;
  margin: 0;
}
</style>

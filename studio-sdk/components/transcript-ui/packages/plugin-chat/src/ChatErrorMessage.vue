<script setup lang="ts">
import { Button, EditorIcon } from "@linto-ai/transcript-ui-ui"
import type { ChatMessageError } from "@linto-ai/transcript-ui-core"

defineProps<{
  error: ChatMessageError
}>()

const emit = defineEmits<{
  action: [actionId: string]
}>()
</script>

<template>
  <!-- Assistant-side failure: an error card in place of the reply -->
  <div class="chat-error-message" role="alert">
    <span class="chat-error-message__marker" aria-hidden="true">
      <EditorIcon name="warning" :size="16" />
    </span>
    <div class="chat-error-message__card">
      <p class="chat-error-message__title">{{ error.title }}</p>
      <p v-if="error.description" class="chat-error-message__description">
        {{ error.description }}
      </p>
      <div v-if="error.action" class="chat-error-message__actions">
        <Button
          variant="secondary"
          size="sm"
          :icon="error.action.icon"
          :label="error.action.label"
          @click="emit('action', error.action.id)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-error-message {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.chat-error-message__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  border-radius: var(--radius-md);
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
}

.chat-error-message__card {
  min-width: 0;
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-radius: var(--radius-lg);
  background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.chat-error-message__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.chat-error-message__description {
  margin: var(--spacing-xs) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height);
}

.chat-error-message__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-sm);
}
</style>

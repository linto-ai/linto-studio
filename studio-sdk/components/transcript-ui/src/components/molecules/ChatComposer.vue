<script setup lang="ts">
import { ref, useId } from "vue"
import Button from "../atoms/Button.vue"
import { useI18n } from "../../i18n"

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [content: string]
}>()

const { t } = useI18n()
const text = ref("")
const textareaId = useId()

function submit(): void {
  const content = text.value.trim()
  if (!content || props.disabled) return
  text.value = ""
  emit("send", content)
}

function onKeydown(event: KeyboardEvent): void {
  // Let Escape bubble up so the drawer can close; keep every other key from
  // reaching the global editor shortcuts.
  if (event.key === "Escape") return
  event.stopPropagation()
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    submit()
  }
}
</script>

<template>
  <div class="chat-composer">
    <label :for="textareaId" class="sr-only">{{ t("chat.placeholder") }}</label>
    <textarea
      :id="textareaId"
      v-model="text"
      class="chat-composer__textarea"
      :placeholder="t('chat.placeholder')"
      :disabled="disabled"
      rows="2"
      @keydown="onKeydown" />
    <Button
      icon="send"
      variant="primary"
      size="md"
      :disabled="!text.trim() || disabled"
      :aria-label="t('chat.send')"
      @click="submit" />
  </div>
</template>

<style scoped>
.chat-composer {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

.chat-composer__textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: inherit;
  font-size: var(--font-size-sm);
  line-height: var(--line-height);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  outline: none;
}

.chat-composer__textarea:focus {
  border-color: var(--color-primary);
}

.chat-composer__textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

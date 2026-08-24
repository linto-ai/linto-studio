<script setup lang="ts">
import MarkdownView from "../../components/atoms/MarkdownView.vue"
import EditorIcon from "../../components/atoms/EditorIcon.vue"
import CopyButton from "../../components/atoms/CopyButton.vue"
import { useI18n } from "../../i18n"
import type { ChatMessage } from "../../core/types"

const props = defineProps<{
  message: ChatMessage
}>()

const { t } = useI18n()

function copyContent() {
  return navigator.clipboard.writeText(props.message.content)
}
</script>

<template>
  <!-- User: compact bubble aligned right -->
  <div v-if="message.role === 'user'" class="chat-message chat-message--user">
    <div class="chat-message__bubble">{{ message.content }}</div>
  </div>

  <!-- Assistant: flat full-width markdown -->
  <div v-else class="chat-message chat-message--assistant">
    <span class="chat-message__marker" aria-hidden="true">
      <EditorIcon name="sparkles" :size="16" />
    </span>
    <div class="chat-message__body">
      <MarkdownView
        v-if="message.content"
        :source="message.content"
        :streaming="message.streaming" />
      <div
        v-if="message.streaming"
        class="chat-message__typing"
        aria-hidden="true">
        <span></span><span></span><span></span>
      </div>

      <!-- Action bar -->
      <div
        v-if="!message.streaming && message.content"
        class="chat-message__actions">
        <CopyButton
          variant="secondary"
          size="sm"
          :copy-fn="copyContent"
          :aria-label="t('chat.copy')">
          {{ t("chat.copy") }}
        </CopyButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  display: flex;
  padding: 0 var(--spacing-lg);
}

.chat-message:first-child {
  padding-top: var(--spacing-lg);
}

.chat-message:last-child {
  padding-bottom: var(--spacing-lg);
}

/* ── User ── */
.chat-message--user {
  justify-content: flex-end;
}

.chat-message__bubble {
  max-width: 80%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm)
    var(--radius-lg);
  font-size: var(--font-size-sm);
  line-height: var(--line-height);
  white-space: pre-wrap;
  word-break: break-word;
}

/* ── Assistant ── */
.chat-message--assistant {
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.chat-message__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  border-radius: var(--radius-md);
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.chat-message__body {
  min-width: 0;
  flex: 1;
}

.chat-message__body :deep(.markdown-view) {
  font-size: var(--font-size-sm);
}

/* ── Action bar ── */
.chat-message__actions {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  margin-left: calc(var(--spacing-sm) * -1);
  flex-direction: row-reverse;
}

/* ── Streaming typing indicator ── */
.chat-message__typing {
  display: inline-flex;
  gap: 3px;
  padding-top: var(--spacing-xs);
}

.chat-message__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-primary);
  animation: chat-typing 1.2s infinite;
}

.chat-message__typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-message__typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes chat-typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-message__typing span {
    animation: none;
  }
}
</style>

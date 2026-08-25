<script setup lang="ts">
import { EditorIcon } from "@linto/transcript-ui-ui"
import { StickToBottom } from "vue-stick-to-bottom"
import ChatMessage from "./ChatMessage.vue"
import { useI18n } from "@linto/transcript-ui-i18n"
import type { ChatMessage as ChatMessageType } from "@linto/transcript-ui-core"

defineProps<{
  messages: ChatMessageType[]
  hasActiveSession: boolean
  isLoading: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div class="chat-message-list">
    <!-- Loading the session history -->
    <div v-if="isLoading" class="chat-message-list__state" role="status">
      <EditorIcon name="spinner" :size="28" spin />
      <span class="sr-only">{{ t("editor.loading") }}</span>
    </div>

    <!-- No session selected yet -->
    <div v-else-if="!hasActiveSession" class="chat-message-list__state">
      <p>{{ t("chat.emptyState") }}</p>
    </div>

    <!-- Active session but empty -->
    <div v-else-if="messages.length === 0" class="chat-message-list__state">
      <p>{{ t("chat.emptyChat") }}</p>
    </div>

    <!-- Messages -->
    <StickToBottom
      v-else
      class="chat-message-list__scroll"
      resize="smooth"
      :initial="true">
      <div class="chat-message-list__items">
        <ChatMessage v-for="msg in messages" :key="msg.id" :message="msg" />
      </div>
    </StickToBottom>
  </div>
</template>

<style scoped>
.chat-message-list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chat-message-list__state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-align: center;
}

.chat-message-list__state :deep(.editor-icon) {
  color: var(--color-primary);
}

.chat-message-list__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.chat-message-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: var(--chat-content-max-width, 760px);
  margin-inline: auto;
}
</style>

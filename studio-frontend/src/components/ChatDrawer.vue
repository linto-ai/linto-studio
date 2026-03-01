<template>
  <transition name="chat-drawer-slide">
    <div v-if="drawerOpen" class="chat-drawer-overlay" @click.self="close">
      <div class="chat-drawer">
        <!-- Header -->
        <div class="chat-drawer__header">
          <h3 class="chat-drawer__title">{{ $t("chat.title") }}</h3>
          <div class="chat-drawer__header-actions">
            <Button
              icon="x"
              size="sm"
              variant="tertiary"
              @click="close" />
          </div>
        </div>

        <!-- Session sidebar + messages split -->
        <div class="chat-drawer__body">
          <!-- Session list sidebar -->
          <div class="chat-drawer__sidebar">
            <div class="chat-drawer__sidebar-header">
              <span class="chat-drawer__sidebar-label">{{ $t("chat.history") }}</span>
              <button
                class="chat-drawer__new-chat-btn"
                :title="$t('chat.new_chat')"
                @click="newChat">
                <ph-icon name="plus" :size="16" />
              </button>
            </div>
            <div class="chat-drawer__session-list">
              <div
                v-for="session in sessions"
                :key="session._id"
                class="chat-drawer__session-item"
                :class="{ 'chat-drawer__session-item--active': session._id === activeSessionId }"
                @click="onSessionClick(session._id)">
                <!-- Rename mode -->
                <div v-if="renamingSessionId === session._id" class="chat-drawer__session-rename">
                  <input
                    ref="renameInput"
                    v-model="renameValue"
                    class="chat-drawer__session-rename-input"
                    @keydown.enter="confirmRename"
                    @keydown.escape="cancelRename"
                    @blur="confirmRename"
                    @click.stop />
                </div>
                <!-- Normal display -->
                <template v-else>
                  <span class="chat-drawer__session-name" :title="session.title">
                    {{ session.title }}
                  </span>
                  <div class="chat-drawer__session-actions" @click.stop>
                    <button
                      class="chat-drawer__session-btn"
                      :title="$t('chat.rename')"
                      @click="startRename(session)">
                      <ph-icon name="pencil-simple" :size="14" />
                    </button>
                    <button
                      class="chat-drawer__session-btn chat-drawer__session-btn--delete"
                      :title="$t('chat.delete_session')"
                      @click="requestDelete(session)">
                      <ph-icon name="trash" :size="14" />
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Main chat area -->
          <div class="chat-drawer__main">
            <!-- Delete confirmation banner -->
            <transition name="chat-confirm-fade">
              <div v-if="deleteTarget" class="chat-drawer__delete-confirm">
                <span>{{ $t("chat.delete_confirm_inline", { name: deleteTarget.title }) }}</span>
                <div class="chat-drawer__delete-confirm-actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    :label="$t('common.cancel')"
                    @click="cancelDelete" />
                  <Button
                    size="sm"
                    variant="primary"
                    intent="destructive"
                    :label="$t('common.delete')"
                    @click="confirmDelete" />
                </div>
              </div>
            </transition>

            <!-- Messages -->
            <div class="chat-drawer__messages" ref="messageContainer">
              <div
                v-if="!activeSessionId"
                class="chat-drawer__empty">
                <p>{{ $t("chat.empty_state") }}</p>
              </div>

              <div
                v-else-if="activeSessionId && allMessages.length === 0"
                class="chat-drawer__empty">
                <p>{{ $t("chat.empty_chat") }}</p>
              </div>

              <div
                v-else-if="activeSessionId"
                class="chat-drawer__message-list">
                <div
                  v-for="(msg, index) in allMessages"
                  :key="index"
                  class="chat-drawer__message"
                  :class="{
                    'chat-drawer__message--user': msg.role === 'user',
                    'chat-drawer__message--assistant': msg.role === 'assistant',
                    'chat-drawer__message--streaming': msg._streaming,
                  }">
                  <div class="chat-drawer__message-bubble">
                    <div class="chat-drawer__message-content">{{ msg.content }}</div>
                    <div
                      v-if="msg._streaming"
                      class="chat-drawer__typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input (always visible) -->
            <div class="chat-drawer__input">
              <textarea
                ref="chatInput"
                class="chat-drawer__textarea"
                v-model="inputText"
                :placeholder="$t('chat.placeholder')"
                :disabled="isStreaming"
                @keydown.enter.exact.prevent="send"
                @keydown="($event) => $event.stopPropagation()"
                rows="2"></textarea>
              <Button
                icon="paper-plane-tilt"
                variant="primary"
                size="sm"
                :disabled="!inputText.trim() || isStreaming"
                :title="$t('chat.send')"
                @click="send" />
            </div>

            <!-- Streaming indicator -->
            <div v-if="isStreaming" class="chat-drawer__streaming-bar">
              {{ $t("chat.streaming") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "ChatDrawer",
  components: { Button, PhIcon },
  props: {
    conversationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      inputText: "",
      renamingSessionId: null,
      renameValue: "",
      deleteTarget: null,
    }
  },
  computed: {
    ...mapState("chat", [
      "sessions",
      "activeSessionId",
      "isStreaming",
      "drawerOpen",
    ]),
    ...mapGetters("chat", ["allMessages"]),
  },
  watch: {
    allMessages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("chat", [
      "loadSessions",
      "createSession",
      "loadSession",
      "deleteSession",
      "renameSession",
      "sendMessage",
      "closeDrawer",
      "newChat",
    ]),
    close() {
      this.closeDrawer()
    },
    async onSessionClick(sessionId) {
      if (sessionId !== this.activeSessionId) {
        await this.loadSession(sessionId)
      }
    },
    startRename(session) {
      this.renamingSessionId = session._id
      this.renameValue = session.title
      this.$nextTick(() => {
        const input = this.$refs.renameInput
        if (input) {
          const el = Array.isArray(input) ? input[0] : input
          el.focus()
          el.select()
        }
      })
    },
    async confirmRename() {
      if (!this.renamingSessionId) return
      const sessionId = this.renamingSessionId
      const title = this.renameValue.trim()
      this.renamingSessionId = null

      if (title && title !== this.sessions.find((s) => s._id === sessionId)?.title) {
        await this.renameSession({ sessionId, title })
      }
    },
    cancelRename() {
      this.renamingSessionId = null
    },
    requestDelete(session) {
      this.deleteTarget = session
    },
    cancelDelete() {
      this.deleteTarget = null
    },
    async confirmDelete() {
      if (!this.deleteTarget) return
      const sessionId = this.deleteTarget._id
      this.deleteTarget = null
      await this.deleteSession(sessionId)
    },
    async send() {
      const text = this.inputText.trim()
      if (!text || this.isStreaming) return
      this.inputText = ""

      // Create session on first send if none active
      if (!this.activeSessionId) {
        try {
          await this.createSession()
        } catch (err) {
          console.error("Failed to create chat session:", err)
          return
        }
      }

      await this.sendMessage(text)
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chat-drawer-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: flex-end;
}

.chat-drawer {
  width: 600px;
  max-width: 100vw;
  height: 100%;
  background: var(--background-primary, white);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-drawer__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--dark-40, #e1e1e1);
  flex-shrink: 0;
}

.chat-drawer__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.chat-drawer__header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

// Body: sidebar + main
.chat-drawer__body {
  display: flex;
  flex: 1;
  min-height: 0;
}

// Sidebar
.chat-drawer__sidebar {
  width: 180px;
  flex-shrink: 0;
  border-right: 1px solid var(--dark-40, #e1e1e1);
  display: flex;
  flex-direction: column;
  background: var(--background-secondary, #fafafa);
}

.chat-drawer__sidebar-header {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-drawer__sidebar-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--dark-70, #777);
  letter-spacing: 0.05em;
}

.chat-drawer__new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--dark-70, #777);
  padding: 0;

  &:hover {
    background: var(--neutral-20, #e0e0e0);
    color: var(--text-primary, #333);
  }
}

.chat-drawer__session-list {
  flex: 1;
  overflow-y: auto;
}

.chat-drawer__session-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  gap: 4px;
  border-left: 2px solid transparent;
  transition: background 0.1s;

  &:hover {
    background: var(--neutral-10, #f0f0f0);

    .chat-drawer__session-actions {
      opacity: 1;
    }
  }

  &--active {
    background: var(--primary-soft, #f2fbf8);
    border-left-color: var(--primary-color, #11977c);
  }
}

.chat-drawer__session-name {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.chat-drawer__session-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.chat-drawer__session-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--dark-70, #777);
  padding: 0;

  &:hover {
    background: var(--neutral-20, #e0e0e0);
    color: var(--text-primary, #333);
  }

  &--delete:hover {
    background: var(--red-soft, #fde8e8);
    color: var(--color-error, #d32f2f);
  }
}

.chat-drawer__session-rename {
  flex: 1;
  min-width: 0;
}

.chat-drawer__session-rename-input {
  width: 100%;
  font-size: 13px;
  padding: 2px 4px;
  border: 1px solid var(--primary-color, #11977c);
  border-radius: 3px;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

// Main chat area
.chat-drawer__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.chat-drawer__delete-confirm {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px;
  background: var(--red-soft, #fde8e8);
  border-bottom: 1px solid var(--color-error, #d32f2f);
  font-size: 13px;
  flex-shrink: 0;

  span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.chat-drawer__delete-confirm-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.chat-confirm-fade-enter-active,
.chat-confirm-fade-leave-active {
  transition: all 0.15s ease;
}

.chat-confirm-fade-enter,
.chat-confirm-fade-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

.chat-drawer__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--dark-70, #777);
  font-size: 14px;
}

.chat-drawer__message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-drawer__message {
  display: flex;

  &--user {
    justify-content: flex-end;

    .chat-drawer__message-bubble {
      background: var(--primary-color, #11977c);
      color: var(--primary-contrast, white);
      border-radius: 12px 12px 4px 12px;
    }
  }

  &--assistant {
    justify-content: flex-start;

    .chat-drawer__message-bubble {
      background: var(--dark-20, #f5f5f5);
      color: var(--dark-100, #333);
      border-radius: 12px 12px 12px 4px;
    }
  }

  &--streaming {
    .chat-drawer__message-bubble {
      border: 1px solid var(--primary-color, #11977c);
    }
  }
}

.chat-drawer__message-bubble {
  max-width: 85%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.45;
  word-break: break-word;
  white-space: pre-wrap;
}

.chat-drawer__message-content {
  margin: 0;
}

.chat-drawer__typing-indicator {
  display: inline-flex;
  gap: 3px;
  padding-top: 4px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary-color, #11977c);
    animation: chat-typing 1.2s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
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

.chat-drawer__input {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--dark-40, #e1e1e1);
  align-items: flex-end;
  flex-shrink: 0;
}

.chat-drawer__textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--dark-40, #e1e1e1);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.4;
  outline: none;

  &:focus {
    border-color: var(--primary-color, #11977c);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.chat-drawer__streaming-bar {
  padding: 6px 16px;
  font-size: 12px;
  color: var(--primary-color, #11977c);
  text-align: center;
  background: var(--primary-soft, rgb(242, 251, 248));
  flex-shrink: 0;
}

// Slide transition
.chat-drawer-slide-enter-active,
.chat-drawer-slide-leave-active {
  transition: opacity 0.2s ease;

  .chat-drawer {
    transition: transform 0.25s ease;
  }
}

.chat-drawer-slide-enter,
.chat-drawer-slide-leave-to {
  opacity: 0;

  .chat-drawer {
    transform: translateX(100%);
  }
}
</style>

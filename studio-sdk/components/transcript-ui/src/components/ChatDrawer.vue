<script setup lang="ts">
import { ref, watch, onUnmounted, useId } from "vue"
import { useCore } from "../core"
import { useI18n } from "../i18n"
import Button from "./atoms/Button.vue"
import EditorIcon from "./atoms/EditorIcon.vue"
import ChatSessionList from "./molecules/ChatSessionList.vue"
import ChatMessageList from "./molecules/ChatMessageList.vue"
import ChatComposer from "./molecules/ChatComposer.vue"

const core = useCore()
const { t } = useI18n()
// ChatDrawer is only rendered when the chat plugin is installed.
const chat = core.chat!
const titleId = useId()

// Local-only: widens the panel to a near-full-width modal (desktop). Resets
// every time the drawer is reopened.
const expanded = ref(false)

function close(): void {
  chat.setDrawerOpen(false)
}

function toggleExpanded(): void {
  expanded.value = !expanded.value
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && chat.drawerOpen.value) close()
}

watch(
  () => chat.drawerOpen.value,
  (open) => {
    if (open) {
      expanded.value = false
      core.emit("chat:loadSessions", undefined)
      window.addEventListener("keydown", onKeydown)
    } else {
      window.removeEventListener("keydown", onKeydown)
    }
  },
)

onUnmounted(() => window.removeEventListener("keydown", onKeydown))

function onSelect(sessionId: string): void {
  core.emit("chat:loadSession", { sessionId })
}
function onCreate(): void {
  core.emit("chat:createSession", undefined)
}
function onCatchup(): void {
  core.emit("chat:catchup", undefined)
}
function onRename(sessionId: string, title: string): void {
  core.emit("chat:renameSession", { sessionId, title })
}
function onDelete(sessionId: string): void {
  core.emit("chat:deleteSession", { sessionId })
}
function onSend(content: string): void {
  core.emit("chat:send", { content })
}
</script>

<template>
  <Transition name="chat-drawer">
    <div
      v-if="chat.drawerOpen.value"
      class="chat-overlay"
      @click.self="close">
      <aside
        class="chat-drawer"
        :class="{ 'chat-drawer--expanded': expanded }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId">
        <header class="chat-drawer__header">
          <h2 :id="titleId" class="chat-drawer__title">
            <EditorIcon name="sparkles" :size="18" />
            {{ t("chat.title") }}
          </h2>
          <div class="chat-drawer__actions">
            <Button
              class="chat-drawer__expand"
              :icon="expanded ? 'minimize' : 'maximize'"
              variant="tertiary"
              size="sm"
              :aria-label="expanded ? t('chat.collapse') : t('chat.expand')"
              @click="toggleExpanded" />
            <Button
              icon="x"
              variant="tertiary"
              size="sm"
              :aria-label="t('chat.close')"
              @click="close" />
          </div>
        </header>

        <div class="chat-drawer__body">
          <ChatSessionList
            :sessions="chat.sessions.value"
            :active-session-id="chat.activeSessionId.value"
            :can-catchup="chat.catchupEnabled"
            @select="onSelect"
            @create="onCreate"
            @catchup="onCatchup"
            @rename="onRename"
            @delete="onDelete" />

          <div class="chat-drawer__main">
            <ChatMessageList
              :messages="chat.allMessages.value"
              :has-active-session="chat.activeSessionId.value !== null"
              :is-loading="chat.isLoadingSession.value" />
            <ChatComposer
              :disabled="chat.isStreaming.value || chat.isLoadingSession.value"
              @send="onSend" />
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.chat-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
}

.chat-drawer {
  /* Centered reading column for messages + composer; cascades to the child
     components through the DOM regardless of scoped styles. */
  --chat-content-max-width: 760px;
  --chat-session-list-width: 200px;
  width: min(620px, 100vw);
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
  transition: width 0.2s ease;
}

/* Near-full-width: keeps a backdrop strip on the left so click-outside still
   closes the panel. */
.chat-drawer--expanded {
  width: min(1400px, 96vw);
  --chat-session-list-width: 300px;
}

.chat-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.chat-drawer__title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.chat-drawer__title :deep(.editor-icon) {
  color: var(--color-primary);
}

.chat-drawer__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* The expand toggle is desktop-only: on phones the panel is already full-width. */
@media (max-width: 640px) {
  .chat-drawer__expand {
    display: none;
  }
}

.chat-drawer__body {
  flex: 1;
  min-height: 0;
  display: flex;
}

.chat-drawer__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* ── Slide + fade transition ── */
.chat-drawer-enter-active,
.chat-drawer-leave-active {
  transition: opacity 0.2s ease;
}

.chat-drawer-enter-active .chat-drawer,
.chat-drawer-leave-active .chat-drawer {
  transition: transform 0.25s ease;
}

.chat-drawer-enter-from,
.chat-drawer-leave-to {
  opacity: 0;
}

.chat-drawer-enter-from .chat-drawer,
.chat-drawer-leave-to .chat-drawer {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .chat-drawer,
  .chat-drawer-enter-active,
  .chat-drawer-leave-active,
  .chat-drawer-enter-active .chat-drawer,
  .chat-drawer-leave-active .chat-drawer {
    transition: none;
  }
}
</style>

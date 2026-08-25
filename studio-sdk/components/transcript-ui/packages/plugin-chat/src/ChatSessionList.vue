<script setup lang="ts">
import { Button, SelectableListItem, FormInput, type FormField } from "@linto/transcript-ui-ui"
import { ref, computed } from "vue"
import { useI18n } from "@linto/transcript-ui-i18n"
import type { ChatSession } from "@linto/transcript-ui-core"

const props = defineProps<{
  sessions: ChatSession[]
  activeSessionId: string | null
}>()

const emit = defineEmits<{
  select: [sessionId: string]
  create: []
  rename: [sessionId: string, title: string]
  delete: [sessionId: string]
}>()

const { t } = useI18n()

const renamingId = ref<string | null>(null)
const renameValue = ref("")
const deleteTargetId = ref<string | null>(null)

const renameField = computed<FormField>(() => ({
  customParams: { "aria-label": t("chat.rename") },
}))

function startRename(session: ChatSession): void {
  deleteTargetId.value = null
  renameValue.value = session.title
  renamingId.value = session.id
}

function confirmRename(): void {
  const id = renamingId.value
  if (!id) return
  renamingId.value = null
  const title = renameValue.value.trim()
  const current = props.sessions.find((s) => s.id === id)
  if (title && title !== current?.title) emit("rename", id, title)
}

function cancelRename(): void {
  renamingId.value = null
}

function onRenameKeydown(event: KeyboardEvent): void {
  // Keep keystrokes inside the drawer: don't let them reach global editor
  // shortcuts, and don't let Escape bubble up to the drawer close handler.
  event.stopPropagation()
  if (event.key === "Enter") confirmRename()
  else if (event.key === "Escape") cancelRename()
}

function requestDelete(sessionId: string): void {
  deleteTargetId.value = sessionId
}

function cancelDelete(): void {
  deleteTargetId.value = null
}

function confirmDelete(): void {
  const id = deleteTargetId.value
  if (!id) return
  deleteTargetId.value = null
  emit("delete", id)
}
</script>

<template>
  <nav class="chat-session-list" :aria-label="t('chat.history')">
    <header class="chat-session-list__header">
      <h3 class="chat-session-list__title">{{ t("chat.history") }}</h3>
      <Button
        icon="plus"
        variant="transparent"
        size="sm"
        :aria-label="t('chat.newChat')"
        @click="emit('create')" />
    </header>

    <ul class="chat-session-list__items">
      <li
        v-for="session in sessions"
        :key="session.id"
        class="chat-session-item">
        <!-- Rename mode -->
        <FormInput
          v-if="renamingId === session.id"
          v-model="renameValue"
          :field="renameField"
          :focus="true"
          full-width
          size="sm"
          @keydown="onRenameKeydown"
          @blur="confirmRename" />

        <!-- Delete confirmation -->
        <div
          v-else-if="deleteTargetId === session.id"
          class="chat-session-confirm">
          <span class="chat-session-confirm__text">
            {{ t("chat.deleteConfirm") }}
          </span>
          <Button
            icon="x"
            variant="transparent"
            size="sm"
            :aria-label="t('chat.cancel')"
            @click="cancelDelete" />
          <Button
            icon="check"
            variant="transparent"
            intent="destructive"
            size="sm"
            :aria-label="t('chat.confirmDelete')"
            @click="confirmDelete" />
        </div>

        <!-- Normal display -->
        <SelectableListItem
          v-else
          :current="session.id === activeSessionId"
          :label="session.title"
          :title="session.title"
          @select="emit('select', session.id)">
          <template #actions>
            <Button
              icon="pencil"
              variant="transparent"
              size="sm"
              :aria-label="t('chat.rename')"
              @click="startRename(session)" />
            <Button
              icon="trash"
              variant="transparent"
              intent="destructive"
              size="sm"
              :aria-label="t('chat.deleteSession')"
              @click="requestDelete(session.id)" />
          </template>
        </SelectableListItem>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.chat-session-list {
  width: var(--chat-session-list-width, 200px);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
  transition: width 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .chat-session-list {
    transition: none;
  }
}

.chat-session-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}

.chat-session-list__title {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.chat-session-list__items {
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
}

/* Delete confirmation row */
.chat-session-confirm {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.chat-session-confirm__text {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

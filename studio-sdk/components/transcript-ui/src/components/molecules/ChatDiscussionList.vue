<script setup lang="ts">
import { ref, computed } from "vue"
import Button from "../atoms/Button.vue"
import SelectableListItem from "../atoms/SelectableListItem.vue"
import FormInput, { type FormField } from "./FormInput.vue"
import { useI18n } from "../../i18n"
import type { ChatDiscussion } from "../../core/types"

const props = defineProps<{
  discussions: ChatDiscussion[]
  activeDiscussionId: string | null
}>()

const emit = defineEmits<{
  select: [discussionId: string]
  create: []
  rename: [discussionId: string, title: string]
  delete: [discussionId: string]
}>()

const { t } = useI18n()

const renamingId = ref<string | null>(null)
const renameValue = ref("")
const deleteTargetId = ref<string | null>(null)

const renameField = computed<FormField>(() => ({
  customParams: { "aria-label": t("chat.rename") },
}))

function startRename(discussion: ChatDiscussion): void {
  deleteTargetId.value = null
  renameValue.value = discussion.title
  renamingId.value = discussion.id
}

function confirmRename(): void {
  const id = renamingId.value
  if (!id) return
  renamingId.value = null
  const title = renameValue.value.trim()
  const current = props.discussions.find((d) => d.id === id)
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

function requestDelete(discussionId: string): void {
  deleteTargetId.value = discussionId
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
  <nav class="chat-discussion-list" :aria-label="t('chat.history')">
    <header class="chat-discussion-list__header">
      <h3 class="chat-discussion-list__title">{{ t("chat.history") }}</h3>
      <div class="chat-discussion-list__actions">
        <Button
          icon="plus"
          variant="transparent"
          size="sm"
          :aria-label="t('chat.newChat')"
          @click="emit('create')" />
      </div>
    </header>

    <ul class="chat-discussion-list__items">
      <li
        v-for="discussion in discussions"
        :key="discussion.id"
        class="chat-discussion-item">
        <!-- Rename mode -->
        <FormInput
          v-if="renamingId === discussion.id"
          v-model="renameValue"
          :field="renameField"
          :focus="true"
          full-width
          size="sm"
          @keydown="onRenameKeydown"
          @blur="confirmRename" />

        <!-- Delete confirmation -->
        <div
          v-else-if="deleteTargetId === discussion.id"
          class="chat-discussion-confirm">
          <span class="chat-discussion-confirm__text">
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
          :current="discussion.id === activeDiscussionId"
          :label="discussion.title"
          :title="discussion.title"
          @select="emit('select', discussion.id)">
          <template #actions>
            <Button
              icon="pencil"
              variant="transparent"
              size="sm"
              :aria-label="t('chat.rename')"
              @click="startRename(discussion)" />
            <Button
              icon="trash"
              variant="transparent"
              intent="destructive"
              size="sm"
              :aria-label="t('chat.deleteDiscussion')"
              @click="requestDelete(discussion.id)" />
          </template>
        </SelectableListItem>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.chat-discussion-list {
  width: var(--chat-discussion-list-width, 200px);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
  transition: width 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .chat-discussion-list {
    transition: none;
  }
}

.chat-discussion-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}

.chat-discussion-list__actions {
  display: flex;
  gap: var(--spacing-xs);
}

.chat-discussion-list__title {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.chat-discussion-list__items {
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
}

/* Delete confirmation row */
.chat-discussion-confirm {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.chat-discussion-confirm__text {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>
  <li class="m-folder">
    <router-link
      :to="{ name: 'media', params: { folderId: folder._id } }"
      class="m-folder__link">
      <span class="m-folder__icon"><PhIcon name="folder" size="md" /></span>
      <span class="m-folder__name">{{ folder.name }}</span>
      <span v-if="count !== null" class="m-muted">{{ count }}</span>
      <PhIcon name="caret-right" size="sm" class="m-folder__chevron" />
    </router-link>
  </li>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "FolderRow",
  components: { PhIcon },
  props: {
    folder: { type: Object, required: true },
  },
  computed: {
    count() {
      const value = this.folder.conversationCount
      return typeof value === "number" ? value : null
    },
  },
}
</script>

<style scoped>
.m-folder {
  border-bottom: 1px solid var(--m-divider);
}

.m-folder:last-child {
  border-bottom: none;
}

.m-folder__link {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 56px;
  padding: var(--m-space-2) var(--m-space-4);
  color: var(--m-text);
  text-decoration: none;
}

.m-folder__link:active {
  background: var(--m-surface-muted);
}

.m-folder__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary-soft);
  color: var(--m-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-folder__name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-folder__chevron {
  color: var(--m-text-muted);
}
</style>

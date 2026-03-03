<template>
  <button
    class="folder-chip"
    :style="chipStyle"
    :class="{ 'folder-chip--drag-over': isDragOver }"
    @click="$emit('navigate', folder._id)"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop">
    <PhIcon
      name="folder"
      size="16"
      weight="fill"
      :color="folder.color || 'var(--primary-color)'" />
    <PhIcon
      v-if="folder.visibility === 'private'"
      name="lock-simple"
      size="12"
      class="folder-chip__lock" />
    <span class="folder-chip__name">{{ folder.name }}</span>
    <span v-if="folder.conversationCount > 0" class="folder-chip__count">
      {{ folder.conversationCount }}
    </span>
    <PhIcon name="caret-right" size="12" class="folder-chip__chevron" />
  </button>
</template>

<script>
export default {
  name: "MediaExplorerFolderChip",
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDragOver: false,
    }
  },
  computed: {
    chipStyle() {
      if (this.folder.color) {
        return { '--folder-accent': this.folder.color }
      }
      return {}
    },
  },
  methods: {
    onDrop(e) {
      this.isDragOver = false
      const raw = e.dataTransfer.getData("conversationIds")
      if (!raw) return
      this.$emit("drop-media", {
        folderId: this.folder._id,
        conversationIds: JSON.parse(raw),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.folder-chip {
  --folder-accent: var(--primary-color);

  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--neutral-30);
  border-radius: 0.375rem;
  background-color: var(--background-primary);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.8125rem;
  line-height: 1;
  white-space: nowrap;
  min-height: 32px;
  box-sizing: border-box;

  &:hover {
    background-color: var(--primary-soft, #f0f4ff);
    border-color: var(--neutral-40);
  }

  &:active {
    transform: scale(0.98);
  }

  &--drag-over {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color), 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.08);
    z-index: 10;

    .folder-chip__name,
    .folder-chip__chevron,
    .folder-chip__lock {
      color: var(--background-primary);
    }

    .folder-chip__count {
      background-color: rgba(255, 255, 255, 0.3);
      color: var(--background-primary);
    }
  }
}

.folder-chip__lock {
  color: var(--text-muted);
  flex-shrink: 0;
}

.folder-chip__name {
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.folder-chip__count {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--neutral-20);
  border-radius: 50px;
  padding: 0.1rem 0.35rem;
  min-width: 1rem;
  text-align: center;
}

.folder-chip__chevron {
  color: var(--text-muted);
  flex-shrink: 0;
}
</style>

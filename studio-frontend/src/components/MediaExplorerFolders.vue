<template>
  <div v-if="canGoBack || folders.length > 0" class="media-explorer-folders">
    <button
      v-if="canGoBack"
      class="media-explorer-folders__back"
      @click="$emit('go-back')">
      <PhIcon name="arrow-left" size="14" />
      <span>{{ $t('folders.back') }}</span>
    </button>
    <MediaExplorerFolderChip
      v-for="folder in folders"
      :key="folder._id"
      :folder="folder"
      @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script>
import MediaExplorerFolderChip from "@/components/MediaExplorerFolderChip.vue"

export default {
  name: "MediaExplorerFolders",
  components: {
    MediaExplorerFolderChip,
  },
  props: {
    folders: {
      type: Array,
      default: () => [],
    },
    canGoBack: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-folders {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--neutral-20);
  margin-bottom: 0.25rem;
  align-items: center;
}

.media-explorer-folders__back {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border: 1px dashed var(--neutral-40);
  border-radius: 0.375rem;
  background-color: var(--neutral-10);
  cursor: pointer;
  font-size: 0.8125rem;
  line-height: 1;
  white-space: nowrap;
  min-height: 32px;
  box-sizing: border-box;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--neutral-20);
    border-color: var(--neutral-50);
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>

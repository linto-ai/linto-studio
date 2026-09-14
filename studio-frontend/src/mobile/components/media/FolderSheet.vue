<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.media.folders')"
    @input="$emit('input', $event)">
    <div class="m-folder-sheet">
      <ListRow
        icon="tray"
        :label="$t('mobile.media.inbox')"
        :hint="$t('mobile.media.inbox_hint')"
        :chevron="false"
        @click="$emit('select', null)">
        <template #trailing>
          <PhIcon v-if="!currentId" name="check" size="md" weight="bold" />
        </template>
      </ListRow>
      <ListRow
        v-if="parent !== undefined"
        icon="arrow-elbow-left-up"
        :label="$t('mobile.media.up_to', { name: parentName })"
        :chevron="false"
        @click="$emit('select', parent ? parent._id : null)" />
      <ListRow
        v-for="folder in folders"
        :key="folder._id"
        icon="folder"
        :label="folder.name"
        :hint="folderHint(folder)"
        @click="$emit('select', folder._id)">
        <template #trailing>
          <span class="m-muted">{{ folder.conversationCount }}</span>
          <PhIcon
            v-if="folder._id === currentId"
            name="check"
            size="md"
            weight="bold" />
          <PhIcon v-else name="caret-right" size="sm" class="m-muted" />
        </template>
      </ListRow>
      <p v-if="folders.length === 0" class="m-muted m-folder-sheet__empty">
        {{ $t("mobile.media.no_subfolder") }}
      </p>
    </div>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"

// Folder picker of the media list: the inbox (every media, newest first),
// one level of folders at a time, and a way up. `parent` is undefined at
// the top level, null when the parent is the top level.
export default {
  name: "FolderSheet",
  components: { BottomSheet, ListRow, PhIcon },
  props: {
    value: { type: Boolean, default: false },
    folders: { type: Array, required: true },
    currentId: { type: String, default: null },
    parent: { type: Object, default: undefined },
  },
  computed: {
    parentName() {
      return this.parent
        ? this.parent.name
        : this.$t("mobile.media.root_folder")
    },
  },
  methods: {
    folderHint(folder) {
      return folder.childCount > 0
        ? this.$t("mobile.media.subfolders", { count: folder.childCount })
        : ""
    },
  },
}
</script>

<style scoped>
.m-folder-sheet {
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}

.m-folder-sheet__empty {
  padding: var(--m-space-3) var(--m-space-4);
}
</style>

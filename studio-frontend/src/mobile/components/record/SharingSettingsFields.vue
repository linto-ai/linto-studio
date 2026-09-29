<template>
  <details class="m-sharing">
    <summary class="m-sharing__summary">
      <span class="m-grow">{{ $t("mobile.settings.sharing_title") }}</span>
      <PhIcon name="caret-down" size="sm" class="m-sharing__caret" />
    </summary>
    <div class="m-sharing__body">
      <label class="m-sharing__field">
        <span>{{ $t("mobile.settings.members_right") }}</span>
        <select
          :value="membersRight"
          @change="
            $emit('change', { membersRight: Number($event.target.value) })
          ">
          <option
            v-for="right in rights"
            :key="right.value"
            :value="right.value">
            {{ right.txt }}
          </option>
        </select>
      </label>
      <p class="m-muted m-sharing__note">{{ rightDescription }}</p>
      <ListRow
        icon="folder"
        :label="$t('mobile.settings.folder')"
        :hint="folderName"
        @click="folderPickerOpen = true" />
      <p class="m-muted m-sharing__note">
        {{ $t("mobile.settings.sharing_help") }}
      </p>
    </div>
    <FolderSheet
      v-model="folderPickerOpen"
      :folders="position.subfolders"
      :current-id="folderId"
      :parent="position.parent"
      @select="$emit('change', { folderId: $event })" />
  </details>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import FolderSheet from "@/mobile/components/media/FolderSheet.vue"
import RIGHTS_LIST from "@/const/rigthsList.js"
import { MEMBERS_RIGHT_DESCRIPTION_KEYS } from "@/mobile/const/membersRightDescriptionKeys.js"
import { describeFolderPosition } from "@/mobile/tools/describeFolderPosition.js"

// Optional rules for the next recordings: the right given to the
// organization members and the folder the media lands in. The folder picker
// browses one level at a time; the chosen folder is the one it stands in.
export default {
  name: "SharingSettingsFields",
  components: { PhIcon, ListRow, FolderSheet },
  props: {
    membersRight: { type: Number, required: true },
    folderId: { type: String, default: null },
  },
  data() {
    return { folderPickerOpen: false }
  },
  computed: {
    rights() {
      return RIGHTS_LIST((key) => this.$t(key))
    },
    rightDescription() {
      const key = MEMBERS_RIGHT_DESCRIPTION_KEYS[this.membersRight]
      return key ? this.$t(`conversation.members_right_desc.${key}`) : ""
    },
    position() {
      return describeFolderPosition(
        this.$store.state.folders.folders ?? [],
        this.folderId,
      )
    },
    folderName() {
      return this.position.current
        ? this.position.current.name
        : this.$t("mobile.media.root_folder")
    },
  },
}
</script>

<style scoped>
.m-sharing__summary {
  min-height: var(--m-tap);
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

.m-sharing__summary::-webkit-details-marker {
  display: none;
}

.m-sharing__caret {
  transition: transform 0.15s;
}

.m-sharing[open] .m-sharing__caret {
  transform: rotate(180deg);
}

.m-sharing__body {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
  padding-top: var(--m-space-2);
}

.m-sharing__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-sharing__field select {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-sharing__note {
  margin: 0;
  font-size: var(--m-font-size-sm);
}
</style>

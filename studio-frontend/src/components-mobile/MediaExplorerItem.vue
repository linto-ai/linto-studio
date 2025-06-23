<template>
  <div
    class="media-explorer-item-mobile"
    :class="{ selected: isSelected }"
    @click="toggleSelect">
    <!-- Delete modal -->
    <!-- First line : main infos -->
    <div class="media-explorer-item-mobile__main">
      <!-- Selection icon -->
      <span
        class="media-explorer-item-mobile__select"
        @click.stop="toggleSelect">
        <ph-icon
          :name="isSelected ? 'check-circle' : 'circle'"
          weight="fill"
          size="20"
          color="var(--primary-color)" />
      </span>

      <!-- Media type icon -->
      <Avatar
        :icon="isFromSession ? 'microphone' : 'file-audio'"
        color="neutral-10"
        size="sm" />

      <!-- Owner avatar -->
      <Tooltip :text="convOwner.fullName" position="bottom">
        <Avatar
          color="#dadada"
          :text="convOwner.fullName.substring(0, 1)"
          :src="convOwnerAvatar"
          size="sm" />
      </Tooltip>

      <!-- Title & meta -->
      <div class="media-explorer-item-mobile__title">
        <span class="title">{{ title }}</span>
        <span class="meta">
          <TimeDuration v-if="duration" :duration="duration" />
          <span v-if="createdAt" class="date">{{ createdAt }}</span>
        </span>
      </div>

      <!-- Actions -->
      <PopoverList
        class="media-explorer-item-mobile__actions"
        :items="actionItems"
        @click="handleAction"
        trigger="click"
        position="bottom"
        overlay>
        <template #trigger="{ open }">
          <Button
            icon="dots-three-vertical"
            variant="flat"
            size="md"
            :color="open ? 'primary' : 'neutral'"
            class="icon-only" />
        </template>
      </PopoverList>

      <ModalDeleteConversations
        :visible="showDeleteModal"
        :medias="[media]"
        @close="showDeleteModal = false" />
    </div>

    <!-- Second line : tags -->
    <div class="media-explorer-item-mobile__tags">
      <MediaExplorerItemTags :media-id="media._id" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex"

import MediaExplorerItemTags from "@/components/MediaExplorerItemTags.vue"
import TimeDuration from "@/components/atoms/TimeDuration.vue"
import Tooltip from "@/components/atoms/Tooltip.vue"
import Button from "@/components/atoms/Button.vue"
import Avatar from "@/components/atoms/Avatar.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import { userName } from "@/tools/userName"
import userAvatar from "@/tools/userAvatar"

import ModalDeleteConversations from "@/components/ModalDeleteConversations.vue"

export default {
  name: "MediaExplorerItemMobile",
  components: {
    Avatar,
    Tooltip,
    Button,
    PopoverList,
    TimeDuration,
    MediaExplorerItemTags,
    ModalDeleteConversations,
  },
  props: {
    media: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isSelected: false,
      showDeleteModal: false,
    }
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationUsers: "getCurrentOrganizationUsers",
      currentOrganization: "getCurrentOrganization",
    }),
    title() {
      return this.media.title || this.media.name
    },
    duration() {
      if (this.media.metadata?.audio?.duration) {
        return this.media.metadata?.audio?.duration
      }
      return null
    },
    organizationId() {
      return this.currentOrganization._id
    },
    convOwner() {
      if (this.media.sharedBy) {
        return {
          ...this.media.sharedBy,
          img: this.media.sharedBy.img
            ? process.env.VUE_APP_PUBLIC_MEDIA + "/" + this.media.sharedBy.img
            : null,
          fullName: `${this.media.sharedBy.firstname} ${this.media.sharedBy.lastname}`,
        }
      }

      const userList = this.currentOrganizationUsers
      const owner = userList.find((u) => u._id == this.media.owner)
      if (owner) {
        return {
          fullName: userName(owner),
          img: owner.img
            ? process.env.VUE_APP_PUBLIC_MEDIA + "/" + owner.img
            : null,
        }
      }
      return {
        fullName: "Private user",
        img: process.env.VUE_APP_PUBLIC_MEDIA + "/pictures/default.jpg",
      }
    },
    convOwnerAvatar() {
      return userAvatar(this.convOwner)
    },
    createdAt() {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      const d = new Date(this.media?.created)
      return d.toLocaleDateString(undefined, options)
    },
    isSelectAll() {
      return this.$store.state.inbox.autoselectMedias
    },
    isFromSession() {
      return !!this.media?.type?.from_session_id
    },
    actionItems() {
      return [
        {
          id: "edit",
          name: this.$t("media_explorer.line.edit_transcription"),
          icon: "pencil",
        },
        {
          id: "subtitles",
          name: this.$t("media_explorer.line.edit_subtitles"),
          icon: "subtitles",
        },
        {
          id: "export",
          name: this.$t("media_explorer.line.export"),
          icon: "file",
        },
        {
          id: "delete",
          name: this.$t("media_explorer.line.delete"),
          icon: "trash",
          color: "secondary",
        },
      ]
    },
  },
  watch: {
    isSelectAll(value) {
      this.isSelected = value
      if (value) {
        this.addSelectedMedia(this.media)
      } else {
        this.removeSelectedMedia(this.media)
      }
    },
  },
  methods: {
    ...mapMutations("inbox", ["addSelectedMedia", "removeSelectedMedia"]),
    toggleSelect() {
      this.isSelected = !this.isSelected
      if (this.isSelected) {
        this.addSelectedMedia(this.media)
      } else {
        this.removeSelectedMedia(this.media)
      }
    },
    handleAction(item) {
      switch (item.id) {
        case "edit":
          this.handleEdit()
          break
        case "subtitles":
          this.handleSubtitles()
          break
        case "export":
          this.handleExport()
          break
        case "delete":
          this.handleDelete()
          break
      }
    },
    handleEdit() {
      this.$router.push({
        name: "conversations transcription",
        params: {
          conversationId: this.media._id,
          organizationId: this.organizationId,
        },
      })
    },
    handleSubtitles() {
      this.$router.push({
        name: "conversations subtitles",
        params: {
          conversationId: this.media._id,
          organizationId: this.organizationId,
        },
      })
    },
    handleExport() {
      this.$router.push({
        name: "conversations publish",
        params: {
          conversationId: this.media._id,
          organizationId: this.organizationId,
        },
      })
    },
    handleDelete() {
      this.showDeleteModal = true
    },
  },
}
</script>

<style lang="scss">
.media-explorer-item-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 4px;
  background: var(--background-primary);
  margin: 0.25rem 0;

  &.selected {
    border-color: var(--primary-color);
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    overflow: hidden;
  }

  &__select {
    flex-shrink: 0;
    display: flex;
    cursor: pointer;
    color: var(--neutral-60);

    &:hover {
      color: var(--primary-color);
    }
  }

  &__title {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;

    .title {
      font-weight: 600;
      font-size: 0.9rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--neutral-60);

      .date {
        white-space: nowrap;
      }
    }
  }

  &__actions {
    flex-shrink: 0;
    margin-left: auto;
  }

  &__tags {
    width: 100%;
    overflow-x: auto;
    padding-top: 0.25rem;
  }
}
</style>

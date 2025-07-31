<template>
  <div class="media-explorer-item" @click="select" :class="{
    'media-explorer-item--overview': isSelectedForOverview,
    'media-explorer-item--selected': isSelected,
    'media-explorer-item--favorite': isFavorite,
  }">
    <!-- Main content layout -->
    <div class="media-explorer-item__content">
      <!-- Left section: Controls + Info -->
      <div class="media-explorer-item__left">
        <!-- Favorite & Checkbox group -->
        <div class="media-explorer-item__controls">
          <Button class="media-explorer-item__favorite" :class="{ active: isFavorite }" @click.stop="toggleFavorite"
            icon="star" :title="$t('media_explorer.favorite')" :iconWeight="isFavorite ? 'fill' : 'regular'"
            variant="outline" size="sm" :color="isFavorite ? 'primary' : 'neutral-10'" />

          <div class="media-explorer-item__checkbox-container" :class="{ selected: isSelected }">
            <input type="checkbox" v-model="isSelected" class="media-explorer-item__checkbox"
              @change="handleSelectionChange" />
          </div>
        </div>

        <!-- Media type icon -->
        <Avatar :icon="isFromSession ? 'microphone' : 'file-audio'" color="neutral-10" size="md"
          class="media-explorer-item__type-icon" />

        <!-- Owner avatar -->
        <Tooltip :text="convOwner.fullName" position="bottom">
          <Avatar color="#dadada" :text="convOwner.fullName.substring(0, 1)" :src="convOwnerAvatar" size="sm"
            class="media-explorer-item__owner" />
        </Tooltip>

        <!-- Main content area with title and metadata -->
        <div class="media-explorer-item__main-content">
          <!-- Media title and metadata on same line -->
          <div class="media-explorer-item__title-row">
            <!-- Media title -->
            <div class="media-explorer-item__title">
              <span @click.stop.prevent="(e) => e.stopPropagation()">
                <router-link :title="title" :to="{
                  name: 'conversations transcription',
                  params: {
                    conversationId: media._id,
                    organizationId: currentOrganization._id,
                  },
                  query: searchValue ? { search: searchValue } : {},
                }">
                  {{ title }}
                </router-link>
              </span>
            </div>

            <!-- Media metadata -->
            <div class="media-explorer-item__metadata">
              <span v-if="duration" class="media-explorer-item__duration">
                <TimeDuration :duration="duration" />
              </span>
              <span v-if="createdAt" class="media-explorer-item__date">
                {{ createdAt }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right section: Tags (desktop only) -->
      <IsDesktop>
        <MediaExplorerItemTags class="media-explorer-item__tags" :mediatags="mediatags" :media-id="media._id"
          :max-visible="maxVisibleTags" :mobile-view="false" />
      </IsDesktop>

      <!-- Actions menu using PopoverList -->
      <PopoverList :items="actionsItems" :close-on-item-click="true" :overlay="false"
        class="media-explorer-item__actions" @click="handleActionClick">
        <template #trigger="{ open }">
          <Button class="media-explorer-item__actions-trigger" :title="$t('media_explorer.actions')" variant="outline"
            color="primary" size="sm" icon="dots-three-outline-vertical" />
        </template>
      </PopoverList>
    </div>

    <!-- Delete modal -->
    <ModalDeleteConversations :visible="showDeleteModal" :medias="[media]" @close="showDeleteModal = false" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex"

import MediaExplorerItemTags from "./MediaExplorerItemTags.vue"
import UserProfilePicture from "./atoms/UserProfilePicture.vue"
import TimeDuration from "./atoms/TimeDuration.vue"
import { userName } from "@/tools/userName"
import userAvatar from "@/tools/userAvatar"

import { PhStar } from "phosphor-vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"
import PopoverList from "./atoms/PopoverList.vue"

export default {
  name: "MediaExplorerItem",
  components: {
    PhStar,
    UserProfilePicture,
    TimeDuration,
    MediaExplorerItemTags,
    ModalDeleteConversations,
    PopoverList,
  },
  props: {
    media: {
      type: Object,
      required: true,
    },
    isSelectedForOverview: {
      type: Boolean,
      default: false,
    },
    searchValue: {
      type: String,
      default: "",
    },
    maxVisibleTags: {
      type: Number,
      default: 2,
    },
    mobileView: {
      type: Boolean,
      default: false,
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

    actionsItems() {
      return [
        {
          id: "edit",
          name: this.$t("media_explorer.line.edit_transcription"),
          icon: "pencil",
          color: "primary",
          to: {
            name: "conversations transcription",
            params: {
              conversationId: this.media._id,
              organizationId: this.organizationId,
            },
            query: this.searchValue ? { search: this.searchValue } : {},
          },
        },
        {
          id: "subtitles",
          name: this.$t("media_explorer.line.edit_subtitles"),
          icon: "closed-captioning",
          color: "primary",
          to: {
            name: "conversations subtitles",
            params: {
              conversationId: this.media._id,
              organizationId: this.organizationId,
            },
            query: this.searchValue ? { search: this.searchValue } : {},
          },
        },
        {
          id: "export",
          name: this.$t("media_explorer.line.export"),
          icon: "export",
          color: "primary",
          to: {
            name: "conversations publish",
            params: {
              conversationId: this.media._id,
              organizationId: this.organizationId,
            },
          },
        },
        {
          id: "delete",
          name: this.$t("media_explorer.line.delete"),
          icon: "trash",
          color: "tertiary",
        },
      ]
    },
    mediatags() {
      if (!this.media || !this.media.tags) {
        return []
      }
      return this.media.tags.map((t) =>
        this.$store.getters["tags/getTagById"](t),
      )
    },
    title() {
      return this.media.name
    },
    description() {
      return this.media.description
    },
    duration() {
      if (this.media.metadata?.audio?.duration) {
        return this.media.metadata?.audio?.duration
      } else {
        return null
      }
    },
    organizationId() {
      return this.currentOrganization._id
    },
    convOwner() {
      if (this.media.sharedBy) {
        return {
          ...this.media.sharedBy,
          img: this.media.sharedBy.img
            ? this.media.sharedBy.img
            : "/pictures/default.jpg",
          fullName: `${this.media.sharedBy.firstname} ${this.media.sharedBy.lastname}`,
        }
      }

      const userList = this.currentOrganizationUsers
      const owner = userList.find((u) => u._id == this.media.owner)
      if (owner) {
        return {
          fullName: userName(owner),
          img: owner.img ? owner.img : null,
        }
      } else {
        return {
          fullName: "Private user",
          img: "/pictures/default.jpg",
        }
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
    isFavorite() {
      return this.$store.getters["user/isFavoriteConversation"](this.media._id)
    },
    isSelectAll() {
      return this.$store.state.inbox.autoselectMedias
    },
    isFromSession() {
      return !!this.media?.type?.from_session_id
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
    // Sync local isSelected state with store
    '$store.state.inbox.selectedMedias': {
      handler(selectedMedias) {
        const isCurrentlySelected = selectedMedias.some(media => media._id === this.media._id)
        if (this.isSelected !== isCurrentlySelected) {
          this.isSelected = isCurrentlySelected
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapMutations("inbox", ["addSelectedMedia", "removeSelectedMedia"]),

    toggleFavorite() {
      this.$store.dispatch("user/toggleFavoriteConversation", this.media._id)
    },

    select() {
      this.isSelected = !this.isSelected
      this.handleSelectionChange()
      this.selectForOverview()
    },

    handleSelectionChange() {
      if (this.isSelected) {
        this.addSelectedMedia(this.media)
      } else {
        this.removeSelectedMedia(this.media)
      }
    },

    handleActionClick(action) {
      switch (action.id) {
        case "delete":
          this.handleDelete()
          break
      }
    },

    handleDelete() {
      this.showDeleteModal = true
    },

    selectForOverview() {
      this.$emit("select-for-overview", this.media)
    },
  },
}
</script>

<style lang="scss">
// ===== MAIN CONTAINER =====
.media-explorer-item {
  position: relative;
  display: flex;
  margin: 0.1rem;
  padding: 0.5rem;
  border: 1px solid var(--neutral-10);
  border-radius: 4px;
  transition: all 0.1s ease-in-out;
  background-color: var(--background-primary);

  &:hover {
    border-color: var(--neutral-40);
    background-color: var(--neutral-10);
  }

  &--selected {
    border-color: var(--primary-color);
  }

  &--favorite {
    //border-left: 3px solid var(--primary-color);
  }

  &--overview {
    border-color: var(--primary-color);
    background-color: var(--primary-soft);
  }
}

// ===== CONTENT LAYOUT =====
.media-explorer-item__content {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  min-width: 0; // Allow shrinking
  overflow: hidden; // Prevent horizontal overflow
}

.media-explorer-item__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0; // Allow shrinking
  overflow: hidden; // Prevent horizontal overflow
}

.media-explorer-item__right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0 0 auto;
  min-width: 0; // Allow shrinking
}

// ===== CONTROLS GROUP =====
.media-explorer-item__controls {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--neutral-40);
  border-radius: 4px;
  background-color: var(--primary-soft);
  flex-shrink: 0;
}

.media-explorer-item__favorite {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--neutral-60);
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }

  &.active {
    color: var(--primary-color);

    &:hover {
      color: var(--neutral-60);
    }
  }
}

.media-explorer-item__checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 2px;
  overflow: hidden;
  transition: background-color 0.2s ease;

  &.selected {
    background-color: var(--primary-color);
  }
}

.media-explorer-item__checkbox {
  width: 12px;
  height: 12px;
  margin: 0;
  cursor: pointer;
}

// ===== MEDIA INFO ELEMENTS =====
.media-explorer-item__type-icon {
  flex-shrink: 0;
}

.media-explorer-item__owner {
  flex-shrink: 0;
}

.media-explorer-item__main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; // Allow shrinking
  gap: 0.25rem;
}

.media-explorer-item__title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
  width: 100%;
  min-width: 300px; // Ensure minimum width for readability
}

.media-explorer-item__title {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
}

.media-explorer-item__overview-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  min-width: 24px;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .media-explorer-item:hover & {
    opacity: 1;
  }
}

.media-explorer-item__metadata {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.media-explorer-item__duration,
.media-explorer-item__date {
  font-size: 0.75rem;
  padding: 0.1rem 0.25rem;
  background-color: var(--neutral-10);
  border: 1px solid var(--neutral-20);
  border-radius: 4px;
  color: var(--text-secondary);
  white-space: nowrap;
}

// ===== ACTIONS =====
.media-explorer-item__actions {
  flex-shrink: 0;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
}

// ===== TAGS SECTION =====
.media-explorer-item__tags {
  flex-shrink: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  max-width: 200px;
  align-items: center;
  margin-left: 0.5rem;
  overflow: hidden; // Prevent horizontal overflow

  @media only screen and (max-width: 1400px) {
    max-width: 150px;
  }

  @media only screen and (max-width: 1200px) {
    max-width: 120px;
  }
}

// ===== RESPONSIVE DESIGN =====
@media only screen and (max-width: 1100px) {
  .media-explorer-item__title-row {
    min-width: 250px;
  }

  .media-explorer-item__title {
    max-width: 160px;
  }

  .media-explorer-item__tags {
    max-width: 100px;
  }
}

@media only screen and (max-width: 768px) {
  .media-explorer-item {
    padding: 0.25rem;
  }

  .media-explorer-item__left {
    gap: 0.25rem;
  }

  .media-explorer-item__title-row {
    gap: 0.25rem;
    flex-direction: row;
    min-width: 200px;
  }

  .media-explorer-item__metadata {
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
  }

  .media-explorer-item__tags {
    max-width: 80px;
  }
}

@media only screen and (max-width: 600px) {
  .media-explorer-item__title-row {
    min-width: 180px;
  }

  .media-explorer-item__title {
    max-width: 120px;
  }

  .media-explorer-item__tags {
    max-width: 60px;
  }

  .media-explorer-item__metadata {
    font-size: 0.625rem;
  }
}

@media only screen and (max-width: 480px) {
  .media-explorer-item__title-row {
    min-width: 150px;
  }

  .media-explorer-item__title {
    max-width: 80px;
  }

  .media-explorer-item__tags {
    max-width: 40px;
  }

  .media-explorer-item__controls {
    padding: 1px;
  }

  .media-explorer-item__favorite,
  .media-explorer-item__checkbox-container {
    width: 18px;
    height: 18px;
  }

  .media-explorer-item__metadata {
    gap: 0.125rem;
  }

  .media-explorer-item__duration,
  .media-explorer-item__date {
    font-size: 0.625rem;
    padding: 0.05rem 0.125rem;
  }
}

@media only screen and (min-width: 1101px) {
  .media-explorer-item {
    min-width: 0;
  }

  .media-explorer-item__title {
    min-width: 0;
    max-width: none;
  }

  .media-explorer-item__tags {
    max-width: 250px;
  }
}
</style>

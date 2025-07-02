<template>
  <div
    class="media-explorer-item"
    @mouseenter="hover"
    @mouseleave="leave"
    @click="select"
    :class="{
      'media-explorer-item--hover': isHover,
      'media-explorer-item--selected': isSelected,
      'media-explorer-item--favorite': isFavorite,
    }">
    
    <!-- Main content layout -->
    <div class="media-explorer-item__content">
      <!-- Left section: Controls + Info -->
      <div class="media-explorer-item__left">
        <!-- Favorite & Checkbox group -->
        <div class="media-explorer-item__controls">
          <Button
            class="media-explorer-item__favorite"
            :class="{ active: isFavorite }"
            @click.stop="toggleFavorite"
            icon="star"
            :title="$t('media_explorer.favorite')"
            variant="outline"
            size="sm"
            :color="isFavorite ? 'primary' : 'neutral-10'" />
          
          <div
            class="media-explorer-item__checkbox-container"
            :class="{ selected: isSelected }">
            <input 
              type="checkbox" 
              v-model="isSelected" 
              class="media-explorer-item__checkbox"
              @change="handleSelectionChange" />
          </div>
        </div>
        
        <!-- Media type icon -->
        <Avatar
          :icon="isFromSession ? 'microphone' : 'file-audio'"
          color="neutral-10"
          size="md"
          class="media-explorer-item__type-icon" />
        
        <!-- Owner avatar -->
        <Tooltip :text="convOwner.fullName" position="bottom">
          <Avatar
            color="#dadada"
            :text="convOwner.fullName.substring(0, 1)"
            :src="convOwnerAvatar"
            size="sm"
            class="media-explorer-item__owner" />
        </Tooltip>
        
        <!-- Media title -->
        <div class="media-explorer-item__title">
          <a :href="`/interface/${organizationId}/conversations/${media._id}/transcription`">
            {{ title }}
          </a>
        </div>
        
        <!-- Show overview button -->
        <Button
          @click.stop="selectForOverview"
          :title="$t('media_explorer.panel.overview')"
          icon="eye"
          size="sm"
          variant="outline"
          class="media-explorer-item__overview-btn"
          color="primary"
          :active="isSelectedForOverview" />
        
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
      
      <!-- Right section: Tags -->
      <div class="media-explorer-item__right">
        <MediaExplorerItemTags
          class="media-explorer-item__tags"
          :hovered="isHover"
          :mediatags="mediatags"
          :media-id="media._id"
          @click.stop="selectForOverview" />
      </div>
    </div>
    
    <!-- Actions menu using PopoverList -->
    <PopoverList
      :items="actionsItems"
      :close-on-item-click="true"
      :overlay="false"
      class="media-explorer-item__actions"
      @click="handleActionClick">
      <template #trigger="{ open }">
        <Button 
          class="media-explorer-item__actions-trigger"
          :title="$t('media_explorer.actions')"
          variant="outline"
          color="primary"
          size="xs"
          icon="dots-three-outline-vertical" />
      </template>
    </PopoverList>

    <!-- Delete modal -->
    <ModalDeleteConversations
      :visible="showDeleteModal"
      :medias="[media]"
      @close="showDeleteModal = false" />
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
  },
  data() {
    return {
      isHover: false,
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
          id: 'edit',
          name: this.$t("media_explorer.line.edit_transcription"),
          icon: 'pencil',
          color: 'primary'
        },
        {
          id: 'subtitles',
          name: this.$t("media_explorer.line.edit_subtitles"),
          icon: 'subtitles',
          color: 'primary'
        },
        {
          id: 'export',
          name: this.$t("media_explorer.line.export"),
          icon: 'file',
          color: 'primary'
        },
        {
          id: 'delete',
          name: this.$t("media_explorer.line.delete"),
          icon: 'trash',
          color: 'danger'
        }
      ]
    },
    mediatags() {
      return this.media.tags.map((t) =>
        this.$store.getters["tags/getTagById"](t),
      )
    },
    title() {
      return this.media.title || this.media.name
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
      } else {
        return {
          fullName: "Private user",
          img: process.env.VUE_APP_PUBLIC_MEDIA + "/pictures/default.jpg",
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
  },
  methods: {
    ...mapMutations("inbox", ["addSelectedMedia", "removeSelectedMedia"]),
    
    toggleFavorite() {
      this.$store.dispatch("user/toggleFavoriteConversation", this.media._id)
    },
    
    hover() {
      this.isHover = true
    },
    
    leave() {
      this.isHover = false
    },

    select() {
      this.isSelected = !this.isSelected
      this.handleSelectionChange()
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
        case 'edit':
          this.handleEdit()
          break
        case 'subtitles':
          this.handleSubtitles()
          break
        case 'export':
          this.handleExport()
          break
        case 'delete':
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
    
    selectForOverview() {
      this.$emit('select-for-overview', this.media)
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
    border-left: 3px solid var(--primary-color);
  }
}

// ===== CONTENT LAYOUT =====
.media-explorer-item__content {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
}

.media-explorer-item__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0; // Allow shrinking
}

.media-explorer-item__right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0 0 50%; // Max 50%
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

.media-explorer-item__title {
  flex: 1;
  min-width: 0;
  
  a {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    &:hover {
      color: var(--primary-color);
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

// ===== TAGS SECTION =====
.media-explorer-item__tags {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

// ===== ACTIONS =====
.media-explorer-item__actions {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  z-index: 10;
}

// ===== RESPONSIVE DESIGN =====
@media only screen and (max-width: 1100px) {
  .media-explorer-item__title {
    max-width: 160px;
  }
  
  .media-explorer-item__right {
    flex: 0 0 40%; // Reduce to 40% on smaller screens
  }
}

@media only screen and (max-width: 768px) {
  .media-explorer-item {
    padding: 0.25rem;
  }
  
  .media-explorer-item__left {
    gap: 0.25rem;
  }
  
  .media-explorer-item__metadata {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }
  
  .media-explorer-item__right {
    flex: 0 0 35%;
  }
}
</style>

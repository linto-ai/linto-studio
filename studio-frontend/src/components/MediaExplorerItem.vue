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
    <div class="media-explorer-item__inline">
      <div class="media-explorer-item__inline__meta button-group actions">
        <span
          class="media-explorer-item__inline__favorite"
          :class="{ active: isFavorite }"
          @click.stop="toggleFavorite">
          <ph-star animation="pulse" weight="fill" size="16" />
        </span>
        <!-- Media type icon: when not hovered-->
        <div
          class="media-explorer-item__inline__selection"
          :class="{ selected: isSelected }">
          <!-- Selection checkbox: when hovered -->
          <div
            class="media-explorer-item__inline__checkbox"
            :class="{ active: isSelected }">
            <input type="checkbox" v-model="isSelected" />
          </div>
        </div>
      </div>
      <div class="media-explorer-item__inline__meta gap-small">
        <Avatar
          :text="title.substring(0, 1)"
          class="media-explorer-item__inline__infos__avatar">
          <Tooltip :text="convOwner.fullName" position="bottom">
            <Avatar
              :text="convOwner.fullName.substring(0, 1)"
              :src="convOwnerAvatar"
              class="media-explorer-item__inline__more__owner__avatar"
              size="xs" />
          </Tooltip>
        </Avatar>
        <a
          :href="`/interface/${organizationId}/conversations/${media._id}/transcription`"
          >{{ title }}</a
        >
        <div class="media-explorer-item__inline__infos">
          <span
            v-if="duration"
            class="media-explorer-item__inline__infos__duration">
            <TimeDuration :duration="duration" />
          </span>
          <span
            v-if="createdAt"
            class="media-explorer-item__inline__infos__dates">
            {{ createdAt }}
          </span>
        </div>
      </div>
      <div class="media-explorer-item__inline__tags">
        <MediaExplorerItemTags
          class="media-explorer-item__inline__tags__tags"
          :mediatags="mediatags"
          :media-id="media._id" />
      </div>
    </div>
    <!-- Actions: visible only on hover, expand a menu with actions from the right -->
    <!-- Actions: archive, delete, edit, share -->
    <div class="media-explorer-item__header__actions">
      <nav>
        <ul>
          <li>
            <button class="btn xs" @click.stop="handleEdit">Edit</button>
          </li>
          <li>
            <button class="btn xs" @click.stop="handleExport">Export</button>
          </li>
          <li>
            <button class="btn xs" @click.stop="handleShare">Share</button>
          </li>
          <li>
            <button class="btn xs tertiary outline" @click.stop="handleArchive">
              Archive
            </button>
          </li>
        </ul>
      </nav>
    </div>
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

export default {
  name: "MediaExplorerItem",
  components: {
    PhStar,
    UserProfilePicture,
    TimeDuration,
    MediaExplorerItemTags,
  },
  props: {
    media: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isHover: false,
      isSelected: false,
    }
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationUsers: "getCurrentOrganizationUsers",
      currentOrganization: "getCurrentOrganization",
    }),
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
      if (this.isSelected) {
        this.addSelectedMedia(this.media)
      } else {
        this.removeSelectedMedia(this.media)
      }
    },

    handleEdit() {
      this.$router.push(
        `/interface/${this.organizationId}/conversations/${this.media._id}/transcription`,
      )
    },

    handleShare() {
      console.log("share")
    },

    handleArchive() {
      console.log("archive")
    },

    handleDelete() {
      console.log("delete")
    },
  },
}
</script>

<style lang="scss">
.media-explorer-item {
  margin: 0.1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--neutral-10);
  padding: 0.5rem;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.1s ease-in-out;

  &:hover {
    border-color: var(--neutral-40);
    background-color: var(--neutral-10);
  }
}

.media-explorer-item--selected {
  border-color: var(--primary-color);
}

.media-explorer-item__inline {
  flex: 1;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  flex-shrink: 0;
}

.media-explorer-item__inline__favorite {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--neutral-60);
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
}

.media-explorer-item__inline__favorite:hover {
  color: var(--primary-color);
}

.media-explorer-item__inline__favorite.active:hover {
  color: var(--neutral-60);
}

.media-explorer-item__inline__favorite.active {
  color: var(--primary-color);
}

.media-explorer-item__inline__selection {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;

  .media-explorer-item__inline__checkbox {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
}

.media-explorer-item__inline__tags {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 50%;
  flex-shrink: 0;
}

.media-explorer-item__inline__selection.selected {
  background-color: var(--primary-color);
}

.media-explorer-item__inline__meta {
  display: flex;
  align-items: center;
  font-size: 0.8rem !important;
}

.media-explorer-item__inline__meta.actions {
  gap: 0;
  border: 1px solid var(--neutral-40);
  border-radius: 2px;
  margin-right: 0.5rem;
  background-color: var(--primary-soft);
  height: 24px;
}

.user-profile-picture-container {
  border: 1px solid var(--neutral-10);
}

.media-explorer-item__inline__meta > a {
  margin: 0;
  padding: 0;
  padding: 0 0.5rem;
  font-weight: 600;
  width: 240px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}

.media-explorer-item__inline__infos {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  min-width: 200px;

  &__avatar {
    flex-shrink: 0;
    position: relative;
    overflow: visible;

    .media-explorer-item__inline__more__owner__avatar {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      border: 1px solid var(--background-primary);
      z-index: 1;
      box-shadow: 0 0 0 1px var(--neutral-40);
    }
  }
}

.media-explorer-item__inline__more {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  min-width: 200px;

  &__owner {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
}

.media-explorer-item__inline__infos__duration,
.media-explorer-item__inline__infos__dates {
  font-size: 0.75rem !important;
  display: inline-block;
  background-color: var(--neutral-10);
  border: 1px solid var(--neutral-20);
  padding: 0.1rem 0.25rem;
  border-radius: 4px;
}

.media-explorer-item__icon {
  position: relative;
  color: var(--primary-color);
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--neutral-10);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
}

.media-explorer-item__checkbox {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--neutral-10);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  transition: background-color 0.3s ease-in-out;
}

.media-explorer-item__checkbox.active {
  background-color: var(--primary-color);
}

.media-explorer-item__icon span {
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

.media-explorer-item__header__title__sub {
  display: flex;
  padding-top: 0.1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.media-explorer-item__header__title__wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.media-explorer-item__header__title h4 {
  margin: 0;
  padding: 0;
  font-weight: 600;
  width: 280px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.media-explorer-item__header__title__icon {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-explorer-item__header__title p {
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.media-explorer-item__header__metadata {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  margin-right: 1rem;
  padding-top: 0.1rem;
}

.media-explorer-item__header__metadata > * {
  font-weight: 600;
  display: inline-block;
  border: 1px solid var(--neutral-10);
  background-color: var(--neutral-30);
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
}

.media-explorer-item__header__tags {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
}

.media-explorer-item__header__actions {
  flex-direction: row;
  gap: 0.5rem;
  position: absolute;
  display: none;
  top: 0;
  height: 100%;
  transition: right 0.1s ease-in-out;
}

.media-explorer-item__header__actions nav {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 0.5rem;
  box-sizing: border-box;
}

.media-explorer-item__header__actions nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.media-explorer-item__header__actions nav ul li {
  padding: 0;
  margin: 0;
}

.media-explorer-item__header__actions nav ul li a {
  padding: 0;
  margin: 0;
}

.media-explorer-item--hover .media-explorer-item__header__actions {
  display: flex;
  position: absolute;
  align-items: center;
  right: 0;
  top: 0;
  background-color: var(--primary-soft);
  padding: 0.5rem;
  box-sizing: border-box;
  height: 100%;
  box-shadow: -4px 0 1px var(--primary-color);
}
</style>

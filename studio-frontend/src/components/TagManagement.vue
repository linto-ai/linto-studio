<template>
  <div class="tag-management">
    <div class="tag-management__header">
      <h2 class="flex1">{{ $t("manage_tags.title") }}</h2>
      <MediaExplorerFormTag @submit="onSubmit" :loading="loading">
        <template #trigger="{ open }">
          <Button
            variant="outline"
            color="primary"
            icon="plus"
            icon-position="left"
            size="sm"
            @click.stop="open">
            {{ $t("manage_tags.create_tag") }}
          </Button>
        </template>
      </MediaExplorerFormTag>
    </div>
    <div class="tags-list">
      <ul v-if="tags.length">
        <li v-for="tag in tags" :key="`tags-list-item--${tag._id}`">
          <!-- <Avatar :material-color="tag.color" :size="54" :emoji="tag.emoji" /> -->
          <span class="tags-list__data">
            <div>
              <ChipTag :name="tag.name" :emoji="tag.emoji" :color="tag.color" />
            </div>
            <span
              v-if="tag.description"
              class="tags-list__description"
              :aria-label="tag.description"
              >{{ tag.description }}</span
            >
            <span
              v-else
              class="tags-list__description tags-list__description--empty">
              {{ $t("manage_tags.no_description") }}
            </span>
          </span>
          <Button
            variant="outline"
            color="primary"
            icon="pencil"
            size="xs"
            @click="openModalTagEdit(tag)">
            {{ $t("manage_tags.edit_tag") }}
          </Button>
          <Alert
            variant="error"
            icon="trash"
            size="xs"
            :title="`Supprimer le tag ${tag.name} ?`"
            :message="`Vous ne pourrez plus utiliser ce tag dans les médias.`"
            @confirm="onTagDelete(tag)">
            <Button variant="outline" color="tertiary" icon="trash" size="xs">
              {{ $t("manage_tags.delete_tag") }}
            </Button>
          </Alert>
        </li>
      </ul>
      <h3 v-if="tags.length === 0">{{ $t("manage_tags.no_tags") }}</h3>
    </div>
    <MediaExplorerFormTag
      v-model="modalTagEditOpen"
      :tag="modalTagEdit"
      size="sm"
      @submit="onTagEdit"
      @cancel="modalTagEditOpen = false"
      @close="modalTagEditOpen = false" />
  </div>
</template>

<script>
import { mapState } from "vuex"
import MediaExplorerFormTag from "@/components/MediaExplorerFormTag.vue"
import Alert from "./atoms/Alert.vue"
import ChipTag from "./atoms/ChipTag.vue"

export default {
  name: "TagManagement",
  components: {
    MediaExplorerFormTag,
  },
  computed: {
    ...mapState("tags", {
      tags: (state) => [...state.tags],
    }),
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    computedSize() {
      if (window.innerWidth < 1100) {
        return "screen"
      }
      return "lg"
    },
  },
  data() {
    return {
      loading: false,
      modalTagEditOpen: false,
      modalTagEdit: null,
    }
  },
  methods: {
    openModalTagEdit(tag) {
      this.modalTagEdit = tag
      this.modalTagEditOpen = true
    },
    async onSubmit(tag) {
      try {
        this.loading = true
        await this.$store.dispatch("tags/createTag", tag)
        this.$emit("submit", tag)
      } catch (error) {
        console.error("Error creating tag", error)
      } finally {
        this.loading = false
      }
    },
    async onTagEdit(tag) {
      try {
        this.loading = true
        await this.$store.dispatch("tags/updateTag", {
          ...tag,
          _id: this.modalTagEdit._id,
        })
        this.$emit("submit", tag)
      } catch (error) {
        console.error("Error updating tag", error)
      } finally {
        this.loading = false
      }
    },
    async onTagDelete(tag) {
      try {
        this.loading = true
        console.log("Deleting tag", tag)
        await this.$store.dispatch("tags/deleteTag", tag)
        console.log("Tag deleted successfully:", tag.name)
      } catch (error) {
        console.error("Error deleting tag", error)
        // Re-throw the error to prevent the UI from thinking the deletion was successful
        throw error
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tag-management {
  &__header {
    display: flex;
    justify-content: flex-end;
  }
}

.tags-list {
  margin-top: 1em;
  flex-direction: row;
  display: flex;
  gap: 0.25em;
  padding: 0.25em;
  //border: 1px solid var(--primary-soft);
  //background-color: var(--primary-soft);
  border-radius: 4px;

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    width: 100%;
    box-sizing: border-box;
    padding: 0.25em;

    li {
      display: flex;
      align-items: center;
      gap: 0.25em;
      background-color: var(--background-primary);
      border-radius: 4px;
      padding: 0.25em;
      //box-shadow: inset 0 0 0 1px var(--primary-soft);

      .avatar {
        font-size: 1.5em; // emoji size
      }

      .tags-list__data {
        display: flex;
        flex-direction: column;
        gap: 0.05em;
        flex: 1;

        .tags-list__name {
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-color);
        }

        // maximum 2 lines
        .tags-list__description {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;

          &--empty {
            font-style: italic;
          }
        }
      }

      button {
        margin-right: 1em;
      }
    }
  }
}
</style>

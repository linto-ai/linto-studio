<template>
  <div class="tag-management">
    <div class="tag-management__header">
      <h2 class="flex1">{{ $t("manage_tags.title") }}</h2>
    </div>
    <div class="tags-list">
      <ul>
        <li v-for="tag in tags" :key="`tags-list-item--${tag._id}`">
          <!-- <Avatar :material-color="tag.color" :size="54" :emoji="tag.emoji" /> -->
          <span class="tags-list__data">
            <div class="flex gap-small align-bottom">
              <ColorPicker
                :value="tag.color"
                @input="onColorChange($event, tag)" />
              <ChipTag
                :name="tag.name"
                @input="onCurrentEditionName($event, tag)"
                @blur="onTagEdit(tag)"
                :emoji="tag.emoji"
                :color="tag.color"
                editable />
            </div>
            <TagManagementDescriptionLine
              :description="tag.description"
              @submit="editDescription($event, tag)" />
            <!-- <span
              v-if="tag.description"
              class="tags-list__description"
              :aria-label="tag.description"
              >{{ tag.description }}</span
            >
            <span
              v-else
              class="tags-list__description tags-list__description--empty">
              {{ $t("manage_tags.no_description") }}
            </span> -->
          </span>
          <Alert
            variant="error"
            icon="trash"
            size="xs"
            :title="$t('modal_delete_tag.title', { name: tag.name })"
            :message="$t('modal_delete_tag.message')"
            @confirm="onTagDelete(tag)">
            <Button
              variant="outline"
              color="tertiary"
              icon="trash"
              size="sm"
              :title="$t('manage_tags.delete_tag')"
              :aria-label="$t('manage_tags.delete_tag')"
              iconOnly />
          </Alert>
        </li>
        <li>
          <span class="tags-list__data">
            <div class="flex gap-small">
              <ColorPicker
                :value="newTag.color"
                @input="newTag.color = $event" />
              <ChipTag
                :key="newTagKey"
                :name="newTag.name"
                @input="onCurrentEditionName($event, newTag)"
                @blur="createNewTag()"
                :emoji="newTag.emoji"
                :color="newTag.color"
                editable
                startEditionEmpty />
            </div>
          </span>
        </li>
      </ul>
      <!-- <h3 v-if="tags.length === 0">{{ $t("manage_tags.no_tags") }}</h3> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import MediaExplorerFormTag from "@/components/MediaExplorerFormTag.vue"
import Alert from "./atoms/Alert.vue"
import ChipTag from "./atoms/ChipTag.vue"
import ColorPicker from "./molecules/ColorPicker.vue"
import TagManagementDescriptionLine from "./TagManagementDescriptionLine.vue"

export default {
  name: "TagManagement",
  components: {
    MediaExplorerFormTag,
    ColorPicker,
    TagManagementDescriptionLine,
  },
  computed: {
    ...mapState("tags", {
      tags: (state) => structuredClone(state.tags),
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
      modalTagEdit: null,
      newTag: {
        name: this.$t("manage_tags.placeholder_new_tag_name"),
        color: "blue",
      },
      newTagKey: 1,
    }
  },
  methods: {
    async onSubmit(tag) {
      if (this.loading) return
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
    onCurrentEditionName(name, tag) {
      this.modalTagEdit = {
        ...tag,
        name,
      }
    },
    editDescription(description, tag) {
      this.modalTagEdit = {
        ...tag,
        description,
      }
      this.onTagEdit()
    },
    onColorChange(color, tag) {
      this.modalTagEdit = {
        ...tag,
        color,
      }
      this.onTagEdit()
    },
    createNewTag() {
      this.onSubmit(this.modalTagEdit)
      this.newTag = {
        name: "Type your tag name here",
        color: "blue",
      }
      this.newTagKey = this.newTagKey + 1
    },
    async onTagEdit() {
      if (!this.modalTagEdit) return
      try {
        this.loading = true
        await this.$store.dispatch("tags/updateTag", {
          ...this.modalTagEdit,
          _id: this.modalTagEdit._id,
        })
        this.$emit("submit", this.modalTagEdit)
      } catch (error) {
        console.error("Error updating tag", error)
      } finally {
        this.loading = false
      }
    },
    async onTagDelete(tag) {
      try {
        this.loading = true
        await this.$store.dispatch("tags/deleteTag", tag)
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
        gap: 0.15rem;
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

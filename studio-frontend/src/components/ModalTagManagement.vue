<template>
  <Modal
    :value="value"
    @input="$emit('input', $event)"
    :size="computedSize"
    title="Gestion des tags"
    subtitle="Gérez vos tags"
    :loading="loading"
    :with-action-apply="false"
    :with-action-cancel="false">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open" />
    </template>
    <template #content>
      <div class="tags-list">
        <ul>
          <li v-for="tag in tags" :key="`tags-list-item--${tag._id}`">
            <Avatar :material-color="tag.color" :size="54" :emoji="tag.emoji" />
            <span class="tags-list__data">
              <span class="tags-list__name" :aria-label="tag.name">{{
                tag.name
              }}</span>
              <span
                class="tags-list__description"
                :aria-label="tag.description"
                >{{ tag.description }}</span
              >
            </span>
            <Button
              variant="outline"
              color="primary"
              icon="trash"
              size="xs"
              @click="openModalTagEdit(tag)">
              Edit
            </Button>
            <Alert
              variant="error"
              icon="trash"
              size="xs"
              :title="`Supprimer le tag ${tag.name} ?`"
              :message="`Vous ne pourrez plus utiliser ce tag dans les médias.`"
              @confirm="onTagDelete(tag)">
              <Button variant="outline" color="tertiary" icon="trash" size="xs"
                >Delete</Button
              >
            </Alert>
          </li>
        </ul>
      </div>
      <MediaExplorerFormTag
        v-model="modalTagEditOpen"
        :tag="modalTagEdit"
        @submit="onTagEdit"
        @cancel="modalTagEditOpen = false"
        @close="modalTagEditOpen = false" />
    </template>
    <template #actions-right>
      <MediaExplorerFormTag @submit="onSubmit" :loading="loading">
        <template #trigger="{ open }">
          <Button
            variant="outline"
            color="primary"
            icon="plus"
            icon-position="left"
            @click.stop="open">
            Create a new tag
          </Button>
        </template>
      </MediaExplorerFormTag>
    </template>
  </Modal>
</template>

<script>
import { mapState } from "vuex"
import Modal from "@/components/molecules/Modal.vue"
import MediaExplorerFormTag from "@/components/MediaExplorerFormTag.vue"
import Alert from "./atoms/Alert.vue"

export default {
  name: "ModalTagManagement",
  components: {
    Modal,
    MediaExplorerFormTag,
  },
  props: {
    value: { type: Boolean, default: false },
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
.tags-list {
  margin-top: 1em;
  flex-direction: row;
  display: flex;
  gap: 0.25em;
  padding: 0.25em;
  border: 1px solid var(--primary-soft);
  background-color: var(--primary-soft);
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
      box-shadow: inset 0 0 0 1px var(--primary-soft);

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
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      button {
        margin-right: 1em;
      }
    }
  }
}
</style>

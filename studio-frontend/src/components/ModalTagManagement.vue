<template>
  <Modal
    size="md"
    title="Gestion des tags"
    subtitle="Gérez vos tags"
    :loading="loading"
    :with-actions="false">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open" />
    </template>
    <template #content>
      <div class="tags-list">
        <Alert
          v-for="tag in tags"
          :key="tag._id"
          :title="`Delete tag ${tag.name}`"
          :message="`Are you sure you want to delete the tag ${tag.name}?`"
          type="danger"
          @confirm="() => onTagDelete(tag)">
          <ChipTag
            :name="tag.name"
            :emoji="tag.emoji"
            :color="tag.color"
            :active="false"
            size="lg" />
        </Alert>
      </div>
    </template>
    <template #actions>
      <MediaExplorerFormTag @submit="onSubmit" :loading="loading">
        <template #trigger="{ open }">
          <Button
            variant="outline"
            color="primary"
            icon="plus"
            icon-position="left"
            size="sm"
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

export default {
  name: "ModalTagManagement",
  components: {
    Modal,
    MediaExplorerFormTag,
  },
  computed: {
    ...mapState("tags", {
      tags: (state) => [...state.tags].sort((a, b) => a.name.localeCompare(b.name)),
    }),
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
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
    async onTagDelete(tag) {
      try {
        this.loading = true
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
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0.25em;
  border: 1px solid var(--primary-soft);
  background-color: var(--primary-soft);
  border-radius: 4px;
}
</style>

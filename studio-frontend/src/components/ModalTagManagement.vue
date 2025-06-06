<template>
  <Modal
    size="md"
    :title="$t('tagManagement.title')"
    :subtitle="$t('tagManagement.subtitle')"
    :loading="loading">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open" />
    </template>
    <template #content>
      <div class="flex col gap-small">
        <MediaExplorerFormTag @submit="onSubmit" :loading="loading">
          <template #trigger="{ open }">
            <button
              @click="open"
              class="tag-box__button outline primary xs with-icon">
              <ph-icon name="plus" weight="bold" />
              <span class="tag-box__button-text">Create a new tag</span>
            </button>
          </template>
        </MediaExplorerFormTag>
      </div>
      <div class="tags-list">
        <ChipTag
          v-for="tag in tags"
          :key="tag._id"
          :name="tag.name"
          :emoji="tag.emoji"
          :color="tag.color"
          :active="false"
          size="lg"
          @click="onTagClick(tag)"
        >
        </ChipTag>
        <Alert
          :visible="!!tagToDelete"
          :title="`Delete tag ${tagToDelete?.name}`"
          :message="`Are you sure you want to delete the tag ${tagToDelete?.name} ?`"
          type="danger"
          @confirm="onTagDelete"
          @cancel="tagToDelete = null"
          @close="tagToDelete = null"
        />
      </div>
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
      tags: (state) => state.tags,
    }),
  },
  data() {
    return {
      loading: false,
      tagToDelete: null,
    }
  },
  methods: {
    onSubmit(tag) {
      this.loading = true
      this.$store.dispatch("tags/createTag", tag).then(() => {
        this.loading = false
        this.$emit("submit", tag)
      })
    },
    onTagClick(tag) {
      this.tagToDelete = tag
    },
    onTagDelete() {
      this.$store.dispatch("tags/deleteTag", this.tagToDelete).then(() => {
        this.tagToDelete = null
      })
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
<template>
  <ContextMenu
    name="highlight-toolbox"
    first
    class="conversation-highlight-toolbox">
    <div class="context-menu__element">
      <div class="flex">
        <Tag
          :value="tag.name"
          :categoryId="tag.categoryId"
          :categoryName="category.name"
          :color="category.color" />
      </div>

      <!-- <p v-if="metadatas.length === 0">
        {{ $t("conversation.highlight_toolbox.no-metadata") }}
      </p>

      <component
        v-else
        v-for="metadata of metadatas"
        :is="metadatasComponents[metadata.schema]"
        :metadata="metadata"
        :conversationId="conversationId" />

      <button class="btn primary" @click="clickAddMetadata">
        <span class="icon plus"></span>
        <span class="label">{{
          $t("conversation.highlight_toolbox.button-add-metadata")
        }}</span>
      </button> -->
    </div>

    <!-- <AppEditorMetadataModal
      v-if="displayModal"
      @close="displayModal = false"
      @done="displayModal = false" /> -->
  </ContextMenu>
</template>
<script>
import CATEGORY_NAME_FROM_SCOPE from "../const/categoryNameFromScope"
import { bus } from "@/main.js"

import ContextMenu from "@/components/atoms/ContextMenu.vue"
import LabeledValue from "@/components/atoms/LabeledValue.vue"
import Tag from "@/components/molecules/Tag.vue"
import MetadataComment from "./MetadataComment.vue"

export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
    tag: {
      type: Object,
      required: true,
    },
  },
  data() {
    const metadatasComponents = {
      comment: MetadataComment,
    }
    //console.log(metadatasComponents[metadata.schema])
    return {
      metadatasComponents,
    }
  },
  computed: {
    colorTextCategory() {
      return `color-${this.category.color}-900`
    },
    categoryName() {
      return (
        CATEGORY_NAME_FROM_SCOPE((key) => this.$t(key))[this.category.scope] ??
        this.category.name
      )
    },
    metadatas() {
      return this.tag.metadata.filter((metadata) => metadata.schema != "words")
    },
  },
  methods: {
    clickAddMetadata(e) {
      // this.displayModal = true
      //
      //
      bus.$emit("open-metadata-modal", {
        category: this.category,
        tag: this.tag,
      })
      e.stopPropagation()
      e.preventDefault()
    },
  },
  components: { ContextMenu, Tag, LabeledValue, MetadataComment },
}
</script>

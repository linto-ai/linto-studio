<template>
  <!-- category selector -->

  <ContextMenu name="main-tag-menu" first>
    <div class="context-menu__element">
      <h4>{{ $t("conversation.highlight_toolbox.title") }}</h4>
    </div>
    <DropDownAddTag
      :conversationId="conversationId"
      searchCategoryType="highlight"
      :possess="true"
      :categoriesList="categoriesList"
      @selectTag="selectTag"></DropDownAddTag>
  </ContextMenu>
  <!-- tag selector -->
</template>
<script>
import { bus } from "@/main.js"
import ContextMenu from "@/components/atoms/ContextMenu.vue"
import DropDownAddTag from "./DropDownAddTag.vue"

export default {
  props: {
    conversationId: { type: String, required: true },
    categoriesList: { type: Array, required: false, default: null }, // if define, search will be done on this list instead of fetching from server
  },
  // data() {},
  methods: {
    selectTag(tag) {
      this.$emit("selectTag", tag)
    },
  },
  components: { DropDownAddTag, ContextMenu },
}
</script>

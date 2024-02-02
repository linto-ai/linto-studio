<template>
  <TagCategoryBox
    :id="id"
    :value="value"
    :category="category"
    :scope="scope"
    :scopeId="scopeId"
    :startOpen="startOpen"
    :showCategoryName="showCategoryName"
    :linkedTags="linkedTags"
    :withMetadata="true"
    :possess="possess"
    :hiddenSelectedTags="addable">
    <template v-slot:content-after-tag="slotProps">
      <SwitchInput
        v-if="selectable"
        :id="`${id}-${slotProps.tag._id}`"
        name="tag"
        :value="isTagSelected(slotProps.tag._id)"
        @input="switchSelectedTag($event, slotProps.tag)" />
      <button
        v-if="addable"
        @click="selectTag(slotProps.tag)"
        class="only-border"
        :id="`${id}-${slotProps.tag._id}`">
        <span class="icon add"></span>
        <span class="label">{{ $t("tags.add_tag_to_conversation") }}</span>
      </button>
    </template>
  </TagCategoryBox>
</template>
<script>
import { Fragment } from "vue-fragment"
import uuidv4 from "uuid/v4.js"

import { bus } from "../main.js"

import TagCategoryBox from "./TagCategoryBox.vue"
import SwitchInput from "./SwitchInput.vue"

export default {
  props: {
    category: { type: Object, required: true },
    value: { type: Array, required: true },
    scope: { type: String, required: true }, // "organization" or "conversation"
    scopeId: { type: String, required: true },
    startOpen: { type: Boolean, default: false },
    showCategoryName: { type: Boolean, default: true },
    linkedTags: { type: Array, default: () => [] },
    selectable: { type: Boolean, default: true },
    addable: { type: Boolean, default: false },
    possess: { type: Boolean, default: false },
  },
  data() {
    return {
      id: uuidv4(),
    }
  },
  mounted() {},
  methods: {
    isTagSelected(tagIdToSearch) {
      return this.value.find((tag) => tag._id == tagIdToSearch) != null
    },
    switchSelectedTag(selected, tag) {
      if (selected) {
        this.selectTag(tag)
      } else {
        this.unSelectTag(tag)
      }
    },
    unSelectTag(tag) {
      this.$emit("unSelectTag", tag)
    },
    selectTag(tag) {
      this.$emit("selectTag", tag, this.category)
    },
  },
  computed: {},
  components: { Fragment, TagCategoryBox, SwitchInput },
}
</script>

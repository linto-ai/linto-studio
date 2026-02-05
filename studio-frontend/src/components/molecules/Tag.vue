<template>
  <div
    class="tag"
    :clickable="clickable"
    :draggable="editable"
    @dragstart="dragStart"
    @click="onClick">
    <div
      class="tag__category"
      v-if="categoryName"
      :class="[classTextSize, classBackgroundColor, classCategoryColor]">
      {{ categoryName }}
    </div>
    <div
      class="tag__value flex align-center"
      :class="[classTextSize, classBackgroundColor, classTextColor]">
      <!-- <span class="tag__triangle" /> -->
      <span class="flex1 tag__value__main" :class="{ 'no-value': !value }">{{
        l_value
      }}</span>
      <Button
        v-if="removable"
        @click="$emit('remove')"
        variant="transparent"
        :size="size === 'small' ? 'sm' : 'md'"
        icon="x"
        :title="$t('tags.remove_tag')" />
      <Button
        v-if="deletable"
        @click="deleteTag"
        variant="transparent"
        :size="size === 'small' ? 'sm' : 'md'"
        icon="trash"
        :title="$t('tags.remove_tag')" />
    </div>
  </div>
</template>

<script>
import { Fragment } from "vue-fragment"

export default {
  props: {
    tagId: { type: String, required: false },
    value: { type: String, required: true },
    categoryId: { type: String, required: false },
    categoryName: { type: String, required: false, default: "" },
    color: { type: String, required: false, default: "brown" },
    size: { type: String, required: false, default: "small" },
    removable: { type: Boolean, required: false, default: false }, // add a cross to remove the tag
    deletable: { type: Boolean, required: false, default: false }, // add a trash to delete the tag
    editable: { type: Boolean, required: false, default: false },
    clickable: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      classTextSize: this.size == "small" ? "small-text" : "medium-text",
      //classColor,
    }
  },
  computed: {
    classBackgroundColor() {
      return `background-${this.color}-50`
    },
    classTextColor() {
      return `color-${this.color}-900`
    },
    classCategoryColor() {
      return `color-${this.color}-900`
    },
    l_value() {
      return this.value || this.$t("tags.empty_value")
    },
  },
  mounted() {},
  methods: {
    dragStart(e) {
      e.dataTransfer.setData("tagId", this.tagId)
      e.dataTransfer.setData("categoryId", this.categoryId)
    },
    deleteTag(e) {
      this.$emit("delete")
      e.stopPropagation()
    },
    onClick(e) {
      if (this.clickable) this.$emit("click", e)
    },
  },
  components: { Fragment },
}
</script>

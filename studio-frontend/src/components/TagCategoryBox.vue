<template>
  <div
    v-if="showCategoryName || tagsList.length > 0"
    :id="`${id}-${category._id}`"
    class="category-box small-padding"
    @dragover="dragOver"
    @dragleave="dragLeave"
    @dragenter="dragOver"
    @drop="drop"
    :class="{ 'no-title': !showCategoryName }">
    <header class="category-box__header">
      <h3
        class="flex row gap-small align-center"
        @click="toggleOpen"
        :class="{ 'no-padding': !open }">
        <span
          class="flex1 flex align-center gap-small"
          :class="[colorTextCategory]">
          <span>
            {{ displayedCategory.name }}
            <span v-if="displayedCategory.type == 'highlight'">
              {{ "(Highlight)" }}</span
            >
          </span>

          <button
            class="transparent inline"
            @click="editCategory"
            :title="$t('tags.edit_category_title')">
            <span class="icon edit" v-if="editable"></span>
          </button>
          <button
            class="transparent inline"
            @click="deleteCategory"
            :title="$t('tags.delete_category_title')">
            <span class="icon trash" v-if="editable"></span>
          </button>
        </span>

        <span class="icon" :class="iconClass"></span>
      </h3>
    </header>
    <ul class="category-box__tag-list flex col" v-if="open">
      <li
        class="flex align-bottom gap-small"
        v-for="tag of tagsList"
        :key="tag._id">
        <label :for="`${id}-${tag._id}`" class="flex flex1 no-margin">
          <Tag
            :title="$t('tags.select_tag_title')"
            :tagId="tag._id"
            :value="tag.name"
            :categoryId="tag.categoryId"
            :categoryName="showCategoryName ? null : displayedCategory.name"
            :editable="editable"
            :color="category.color" />
        </label>
        <SwitchInput
          v-if="selectable"
          :id="`${id}-${tag._id}`"
          name="tag"
          :value="isTagSelected(tag._id)"
          @input="switchSelectedTag($event, tag)" />
        <button
          v-if="addable"
          @click="selectTag(tag)"
          class="only-border"
          :id="`${id}-${tag._id}`">
          <span class="icon add"></span>
          <span class="label">{{ $t("tags.add_tag_to_conversation") }}</span>
        </button>
        <button
          class="transparent inline"
          @click="editTag(tag)"
          :title="$t('tags.edit_tag_title')">
          <span class="icon edit" v-if="editable"></span>
        </button>
        <button
          class="transparent inline"
          @click="deleteTag(tag)"
          :title="$t('tags.delete_tag_title')">
          <span class="icon trash" v-if="editable"></span>
        </button>
      </li>
      <div v-if="tagsList.length === 0 && showCategoryName">
        <span class="category-box__no-tag">{{
          $t("tags.no_tags_in_category")
        }}</span>
      </div>
      <div class="flex" v-if="editable && !addingTag">
        <button class="transparent fullwidth" @click="startAddingTag">
          <span class="icon add"></span>
          <span class="label">{{ $t("tags.create_a_tag") }}</span>
        </button>
      </div>
      <div
        class="flex align-bottom"
        v-if="addingTag"
        style="padding-top: 0.5rem">
        <FormInput
          :field="newTagName"
          v-model="newTagName.value"
          class="flex1"
          withConfirmation
          @on-cancel="cancelAddingTag"
          @on-confirm="addNewTag" />
      </div>
    </ul>
  </div>
</template>
<script>
import uuidv4 from "uuid/v4.js"

import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import {
  apiGetCategoryById,
  apiGetTagsFromCategory,
  apiUpdateTag,
  apiCreateTag,
} from "../api/tag"
import EMPTY_FIELD from "../const/emptyField"

import SwitchInput from "./SwitchInput.vue"
import Tag from "./Tag.vue"
import FormInput from "./FormInput.vue"

export default {
  props: {
    category: { type: Object, required: true },
    value: { type: Array, required: true },
    scope: { type: String, required: true }, // "organization" or "conversation"
    scopeId: { type: String, required: true },
    startOpen: { type: Boolean, default: false },
    showCategoryName: { type: Boolean, default: true },
    linkedTags: { type: Array, default: () => [] },
    editable: { type: Boolean, default: false },
    selectable: { type: Boolean, default: true },
    addable: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      displayedCategory: this.category,
      id: uuidv4(),
      open: this.startOpen,
      newTagName: {
        ...EMPTY_FIELD,
        label: this.$t("tags.new_tag_name"),
      },
      addingTag: false,
    }
  },
  mounted() {
    bus.$on("tag-category-changed", this.updateCategory)
  },
  beforeDestroy() {
    bus.$off("tag-category-changed")
  },
  computed: {
    iconClass() {
      if (this.loading) return "loading"
      return !this.open ? "bottom-arrow" : "top-arrow"
    },
    tagsList() {
      const tags =
        this.displayedCategory?.tags ?? this.displayedCategory?.tag ?? []
      if (!this.addable) {
        return tags
      } else {
        return tags.filter((tag) => !this.value.find((t) => t._id === tag._id))
      }
    },
    colorTextCategory() {
      return `color-${this.category.color}-900`
    },
  },
  watch: {
    startOpen() {
      this.open = this.startOpen
    },
    "category.name"() {
      this.displayedCategory.name = this.category.name
    },
  },
  methods: {
    editCategory(event) {
      this.$emit("edit")
      event.stopPropagation()
      event.preventDefault()
    },
    dragOver(e) {
      e.preventDefault()
      e.stopPropagation()
      document
        .getElementById(`${this.id}-${this.category._id}`)
        .classList.add("drag-over")
    },
    async drop(e) {
      if (scope === "conversation") return
      document
        .getElementById(`${this.id}-${this.category._id}`)
        .classList.remove("drag-over")

      const tagId = e.dataTransfer.getData("tagId")
      const categoryIdSource = e.dataTransfer.getData("categoryId")

      if (categoryIdSource === this.category._id) return

      await apiUpdateTag(this.scopeId, tagId, {
        categoryId: this.category._id,
      })
      bus.$emit("tag-category-changed", {
        categoryIdTarget: this.category._id,
      })
      bus.$emit("tag-category-changed", {
        categoryIdTarget: categoryIdSource,
      })
    },
    dragLeave(e) {
      e.stopPropagation()
      document
        .getElementById(`${this.id}-${this.category._id}`)
        .classList.remove("drag-over")
    },
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
    async toggleOpen() {
      if (this.loading) return
      this.loading = true
      if (!this.open && this.tagsList.length === 0) {
        await this.fetchTags()
      }
      this.loading = false
      this.open = !this.open
    },
    async fetchTags() {
      if (this.linkedTags.length > 0) {
        const tags = await apiGetTagsFromCategory(
          this.scopeId,
          this.category._id,
          this.linkedTags.map((t) => t._id),
          this.scope
        )
        this.displayedCategory = {
          ...this.category,
          tags,
        }
      } else {
        this.displayedCategory = await apiGetCategoryById(
          this.scopeId,
          this.category._id,
          this.scope
        )
      }
    },
    updateCategory({ categoryIdTarget }) {
      if (this.category._id === categoryIdTarget) {
        this.fetchTags()
      }
    },
    editTag(tag) {
      this.$emit("edit-tag", tag)
    },
    deleteTag(tag) {
      this.$emit("delete-tag", tag)
    },
    deleteCategory(event) {
      this.$emit("delete-category", this.category)
      event.stopPropagation()
      event.preventDefault()
    },
    startAddingTag() {
      this.addingTag = true
    },
    cancelAddingTag() {
      this.addingTag = false
      this.newTagName = {
        ...EMPTY_FIELD,
        label: this.$t("tags.new_tag_name"),
      }
    },
    async addNewTag() {
      if (this.newTagName.value === "") return
      const res = await apiCreateTag(
        this.scopeId,
        this.newTagName.value,
        this.category._id,
        "organization"
      )
      if (res.status == "error") {
        this.newTagName.error = "error"
      } else {
        this.addTag({
          ...res,
          color: this.category.color,
          categoryName: this.displayedCategory.name,
        })
        this.cancelAddingTag()
      }
    },
    addTag(tag) {
      this.displayedCategory.tags.push(tag)
    },
  },
  components: { Fragment, SwitchInput, Tag, FormInput },
}
</script>

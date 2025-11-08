<template>
  <TagCategoryBox
    :category="category"
    :editable="editable"
    scope="organization"
    :scopeId="organizationId"
    :value="[]"
    @input="($event) => $emit('input', $event)"
    :selectable="false">
    <template v-slot:content-just-after-title>
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
    </template>

    <template v-slot:content-after-tag="slotProps">
      <button
        class="transparent inline"
        @click="editTag(slotProps.tag)"
        :title="$t('tags.edit_tag_title')">
        <span class="icon edit" v-if="editable"></span>
      </button>
      <button
        class="transparent inline"
        @click="deleteTag(slotProps.tag)"
        :title="$t('tags.delete_tag_title')">
        <span class="icon trash" v-if="editable"></span>
      </button>
    </template>

    <template v-slot:content-after-tag-list>
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
    </template>
  </TagCategoryBox>
</template>
<script>
import { bus } from "@/main.js"

import EMPTY_FIELD from "../const/emptyField"

import { apiCreateTag } from "../api/tag"

import TagCategoryBox from "./TagCategoryBox.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  props: {
    category: { type: Object, required: true },
    organizationId: { type: String, required: true },
    editable: { type: Boolean, default: false },
    startOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      newTagName: {
        ...EMPTY_FIELD,
        label: this.$t("tags.new_tag_name"),
      },
      addingTag: false,
    }
  },
  mounted() {},
  methods: {
    editCategory(event) {
      this.$emit("edit")
      event.stopPropagation()
      event.preventDefault()
    },
    deleteCategory(event) {
      this.$emit("delete-category", this.category)
      event.stopPropagation()
      event.preventDefault()
    },
    editTag(tag) {
      this.$emit("edit-tag", tag)
    },
    deleteTag(tag) {
      this.$emit("delete-tag", tag)
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
        this.organizationId,
        this.newTagName.value,
        this.category._id,
        "organization",
      )
      if (res.status == "error") {
        this.newTagName.error = "error"
      } else {
        bus.emit("tag-category-changed", {
          categoryIdTarget: this.category._id,
        })
        this.cancelAddingTag()
      }
    },
  },
  components: { TagCategoryBox, FormInput },
}
</script>

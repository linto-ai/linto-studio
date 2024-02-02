<template>
  <!-- Tag panel -->
  <div>
    <div class="context-menu__element">
      <div class="form-field flex col small-padding no-margin fullwidth">
        <label class="form-label fullwidth" for="dropdown-search-tags">
          {{ $t("tags.search_tags_or_categories_or_create_new_one") }}
        </label>
        <input
          type="search"
          ref="searchInput"
          v-model="searchValueForTag"
          id="dropdown-search-tags"
          autocomplete="off"
          @keydown="keydown"
          class="fullwidth" />
      </div>

      <div class="context-menu__element" v-if="searchValueForTag">
        <button
          class="transparent flex context-menu__action"
          :selected="state == STATES.SEARCH_TAG"
          style="width: 100%; text-align: left"
          @click="searchTags">
          <span class="icon search"></span>
          <span class="label flex1 text-cut"
            >{{ $t("tags.search_tags_with") }} "{{ searchValueForTag }}"</span
          >
          <span class="icon right-arrow"></span>
        </button>
        <ContextMenu v-if="state == STATES.SEARCH_TAG" name="tag-search">
          <TagSearch
            :value="value"
            @selectTag="selectTag"
            @unSelectTag="unSelectTag"
            :search="searchValueForTag"
            :reload="reloadTagList"
            :selectable="false"
            :withCategories="false"
            addable
            :conversationId="conversationId"
            :searchCategoryType="searchCategoryType">
          </TagSearch>
        </ContextMenu>
      </div>

      <div class="context-menu__element" v-if="searchValueForTag">
        <button
          class="transparent flex align-center context-menu__action"
          :selected="state == STATES.CREATE_TAG"
          style="width: 100%; text-align: left"
          @click="createTag">
          <span class="icon new"></span>
          <span class="label flex1 flex gap-small align-bottom text-cut">
            {{ $t("tags.create_tag") }} "{{ searchValueForTag }}"
          </span>
          <span class="icon right-arrow"></span>
        </button>

        <ContextMenu v-if="state == STATES.CREATE_TAG">
          <DropDownAddTagCreate
            :tagValue="searchValueForTag"
            :conversationId="conversationId"
            :selectedCategory="selectedCategory"
            :searchCategoryType="searchCategoryType"
            @done="done"
            v-model="selectedCategory"></DropDownAddTagCreate>
        </ContextMenu>
      </div>
    </div>

    <div class="context-menu__element" v-if="!searchValueForTag">
      <button
        class="transparent flex context-menu__action"
        :selected="state == STATES.BROWSE_CATEGORY"
        style="width: 100%; text-align: left"
        @click="browseCategories">
        <span class="label flex1">{{ $t("tags.browse_categories") }}</span>
        <span class="icon right-arrow"></span>
      </button>

      <ContextMenu v-if="state == STATES.BROWSE_CATEGORY" name="browse cats">
        <TagCategoryBoxSelectable
          v-for="category of allCategories"
          :key="category._id"
          :category="category"
          :value="value"
          :scopeId="conversationId"
          scope="conversation"
          :startOpen="false"
          addable
          :possess="possess"
          :selectable="false"
          @selectTag="selectTag"
          @unSelectTag="unSelectTag" />
        <div v-if="allCategories.length == 0">
          {{ $t("tags.no_tags_found") }}
        </div>
      </ContextMenu>
    </div>
  </div>

  <!--
    state 1: search tags and cat, if no search show tag recommendation
    state 2: creating tag -> show category selector
    state 3: browse cats -> show categories list
  -->
</template>

<script>
// could be rename tagSelector or something like that
import { Fragment } from "vue-fragment"

import { bus } from "../main.js"
import {
  apiCreateCategory,
  apiCreateTag,
  apiGetAllCategories,
} from "../api/tag.js"

import TagSearch from "./TagSearch.vue"
import TagCategorySearch from "./TagCategorySearch.vue"
import Tag from "./Tag.vue"
import TagCategoryBox from "./TagCategoryBox.vue"
import ContextMenu from "./ContextMenu.vue"
import DropDownAddTagCreate from "./DropDownAddTagCreate.vue"
import TagCategoryBoxSelectable from "./TagCategoryBoxSelectable.vue"

const STATES = {
  SEARCH_TAG: 1,
  CREATE_TAG: 2,
  BROWSE_CATEGORY: 3,
}

export default {
  props: {
    menuPosition: { type: String, default: "right" },
    conversationId: { type: String, required: true },
    value: { type: Array, required: false, default: () => [] }, // tags
    searchCategoryType: { type: String, default: "conversation_metadata" },
    possess: { type: Boolean, default: false },
  },
  data() {
    return {
      STATES,
      state: null,
      searchValueForTag: "",
      selectedCategory: null,
      reloadTagList: false,
      reloadCategoryList: false,
      allCategories: [],
    }
  },
  mounted() {
    this.$refs.searchInput.focus()
  },
  computed: {
    currentTagcategoryName() {
      return this.selectedCategory
        ? this.selectedCategory.name
        : this.$t("tags.empty_category")
    },
    currentTagcategoryColor() {
      return this?.selectedCategory?.color ?? "white"
    },
  },
  watch: {
    searchValueForTag() {
      this.state = STATES.SEARCH_TAG
    },
  },
  methods: {
    keydown(e) {
      e.stopPropagation()
    },
    createTag() {
      this.state = STATES.CREATE_TAG
    },
    searchTags() {
      this.state = STATES.SEARCH_TAG
    },
    backToTagSearch() {
      this.selectedCategory = null
      this.state = STATES.SEARCH_TAG
    },
    close() {
      this.$emit("close")
    },
    async createCategory(name) {
      const res = await apiCreateCategory(
        this.conversationId,
        name,
        this.searchCategoryType,
        "conversation",
        null
      )

      if (res.status == "error") {
        console.error(res)
      } else {
        this.selectCategory(res)
        this.done()
      }
    },
    selectCategory(value) {
      this.selectedCategory = value
    },
    async done() {
      if (this.selectedCategory == null) {
        return
      }

      if (!this.selectedCategory._id) {
        await this.createCategory(this.selectedCategory.name)
        return
      }

      const res = await apiCreateTag(
        this.conversationId,
        this.searchValueForTag,
        this.selectedCategory._id,
        "conversation",
        null
      )
      if (res.status == "error") {
        // TODO: show error
      } else {
        this.selectTag(res, this.selectedCategory)
      }
      this.state = null
      this.reloadTagList = !this.reloadTagList
      this.selectedCategory = null
      this.close()
    },
    selectTag(tag, category) {
      this.$emit("selectTag", tag, category)
    },
    unSelectTag(tag) {
      this.$emit("unSelectTag", tag)
    },
    async browseCategories() {
      this.state = STATES.BROWSE_CATEGORY
      this.loading = true
      this.allCategories = await apiGetAllCategories(
        this.conversationId,
        this.searchCategoryType,
        "conversation",
        false,
        this.possess
      )
      this.loading = false
    },
  },
  components: {
    Fragment,
    TagSearch,
    Tag,
    TagCategorySearch,
    TagCategoryBox,
    ContextMenu,
    ContextMenu,
    DropDownAddTagCreate,
    TagCategoryBoxSelectable,
  },
}
</script>

<template>
  <Modal
    @on-confirm="applyFilters"
    @on-cancel="cancel"
    :title="$t('conversation.search_criterions')"
    :actionBtnLabel="$t('conversation.apply_filters')"
    fullHeight
    v-if="modalOpen">
    <div class="flex col gap-medium flex1">
      <div
        v-if="withSearch"
        class="form-field flex col small-padding no-margin no-padding"
        style="width: 20rem">
        <label class="form-label" for="explore-modal-search-tags">
          {{ $t("tags.search_tags_or_categories") }}
        </label>
        <input
          type="search"
          v-model="searchValueForTag"
          id="explore-modal-search-tags" />
        <div class="relative">
          <div
            class="dropDown fullwidth"
            style="max-height: calc(100vh - 250px)"
            v-if="searchValueForTag && searchModalDropdownOpen"
            v-click-outside="closeSearchModalDropdown">
            <TagSearch
              :search="searchValueForTag"
              :currentOrganizationScope="currentOrganizationScope"
              :value="value"
              @selectTag="selectTag"
              @unSelectTag="unSelectTag" />
          </div>
        </div>
      </div>
      <div
        class="flex wrap align-top gap-medium flex1"
        v-if="!loadingCategories">
        <div class="flex wrap align-top gap-medium">
          <TagCategoryBoxSelectable
            v-for="category of categories"
            :startOpen="false"
            :key="category._id"
            :value="selectedTags"
            @selectTag="selectTag"
            @unSelectTag="unSelectTag"
            :category="category"
            :scopeId="currentOrganizationScope"
            scope="organization"
            :linkedTags="selectedTags"
            style="width: 18rem" />
        </div>
        <div
          v-if="categories.length == 0"
          class="flex1 flex col align-center justify-center fullwidth center-text">
          <h2>{{ $t("explore.no_categories_modal") }}</h2>
          <router-link :to="`/interface/inbox`" class="underline">
            <span>{{ $t("explore.link_to_inbox") }}</span>
          </router-link>
        </div>
      </div>
      <div class="flex flex1 relative" v-else>
        <Loading />
      </div>
    </div>
  </Modal>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import TagCategoryBoxSelectable from "@/components/TagCategoryBoxSelectable.vue"
import Loading from "./Loading.vue"
import TagSearch from "./TagSearch.vue"
import ModalNew from "./ModalNew.vue"

export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    currentOrganizationScope: { type: String, required: true },
    categories: { type: Array, required: false, default: () => [] },
    loadingCategories: { type: Boolean, required: true },
    withSearch: { type: Boolean, required: false, default: true },
  },
  data() {
    return {
      modalOpen: true,
      searchValueForTag: "",
      searchModalDropdownOpen: false,
      tempSelectedTags: [...this.value],
    }
  },
  watch: {
    searchValueForTag() {
      this.searchModalDropdownOpen = true
    },
  },
  computed: {
    selectedTags() {
      return this.tempSelectedTags
    },
  },
  methods: {
    closeSearchModalDropdown() {
      this.searchModalDropdownOpen = false
    },
    applyFilters() {
      this.$emit("apply", this.tempSelectedTags)
    },
    cancel() {
      this.$emit("cancel")
    },
    selectTag(tag, category) {
      this.tempSelectedTags.push({
        ...tag,
        color: category.color,
        categoryName: category.name,
      })
    },
    unSelectTag(tag) {
      this.tempSelectedTags = this.tempSelectedTags.filter(
        (t) => t._id !== tag._id
      )
    },
  },
  components: {
    Fragment,
    TagCategoryBoxSelectable,
    Loading,
    TagSearch,
    Modal: ModalNew,
  },
}
</script>

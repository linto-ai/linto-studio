<template>
  <div class="flex row">
    <div
      class="form-field flex col"
      style="width: 20rem"
      v-click-outside="closeSearchTextDropdown">
      <label class="form-label" for="explore-search-text-in-conv">
        {{ $t("explore.search_text_label") }}
      </label>
      <input
        type="search"
        v-model="searchTextValue"
        @click="handleFocus"
        @focus="handleFocus"
        id="explore-search-text-in-conv" />
      <div class="select__list">
        <div
          class="select__list__inner flex col"
          v-if="searchTextValue && searchTextDropdownOpen">
          <button
            class="select__list__item"
            @click="searchInConversationsTitleHandler">
            {{
              $t("explore.search_text_in_title", {
                text: searchTextValue,
              })
            }}
          </button>
          <button
            class="select__list__item"
            @click="searchInConversationsTextHandler">
            {{
              $t("explore.search_text_in_content", {
                text: searchTextValue,
              })
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {},
  data() {
    return {
      searchTextValue: "",
      searchTextDropdownOpen: false,
    }
  },

  mounted() {},
  watch: {
    searchTextValue() {
      this.searchTextDropdownOpen = true
    },
  },
  methods: {
    handleFocus() {
      console.log("handleFocus")
      this.searchTextDropdownOpen = true
    },
    closeSearchTextDropdown() {
      this.searchTextDropdownOpen = false
    },
    resetSearch() {
      this.searchTextValue = ""
      this.closeSearchTextDropdown()
    },
    searchInConversationsTitleHandler() {
      this.closeSearchTextDropdown()
      this.$emit("searchInConversationsTitle", this.searchTextValue)
    },
    searchInConversationsTextHandler() {
      this.closeSearchTextDropdown()
      this.$emit("searchInConversationsText", this.searchTextValue)
    },
  },
  components: { Fragment },
}
</script>

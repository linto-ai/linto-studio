<template>
  <div class="flex gap-medium align-center">
    <div class="flex col flex1">
      <h2 class="flex1">Derniers médias</h2>
      <i18n path="inbox.subtitle" tag="span">
        <a
          href="https://linto.app"
          style="vertical-align: text-top; text-decoration: underline"
          place="appLink"
          >linto.app</a
        >
      </i18n>
    </div>

    <ConversationListSearch
      @searchInConversationsTitle="onSearchInConversationsTitle"
      @searchInConversationsText="onSearchInConversationsText" />
    <div class="form-field flex col">
      <label for="options-list">Trier par</label>
      <CustomSelect
        id="options-list"
        :options="options"
        v-model="selectedOption"
        buttonClass="btn--input-color"></CustomSelect>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import ConversationListSearch from "./ConversationListSearch.vue"
import CustomSelect from "./CustomSelect.vue"
export default {
  props: {
    value: { type: String, required: true },
  },
  data() {
    return {
      options: {
        lang: [
          { value: "created", text: this.$i18n.t("inbox.sort.created") },
          {
            value: "last_update",
            text: this.$i18n.t("inbox.sort.last_update"),
          },
          { value: "notags", text: this.$i18n.t("inbox.sort.notags") },
        ],
      },
      //selectedOption: "fr-FR",
    }
  },
  computed: {
    selectedOption: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  mounted() {},
  methods: {
    onSearchInConversationsTitle(search) {},
    onSearchInConversationsText(search) {},
  },
  components: { Fragment, ConversationListSearch, CustomSelect },
}
</script>

<template>
  <div class="text-toolbox">
    <h4>Ajouter un highlight sur le texte</h4>
    <!-- category selector -->
    <DropDownAddTag
      :conversationId="conversationId"
      searchCategoryType="highlight"
      v-model="selectedTags"></DropDownAddTag>
    <!-- tag selector -->
  </div>
</template>
<script>
import { bus } from "../main.js"
import DropDownAddTag from "./DropDownAddTag.vue"

export default {
  props: {
    conversationId: { type: String, required: true },
  },
  data() {
    return {
      selectedTags: [],
    }
  },
  methods: {},
  components: { DropDownAddTag },
}
</script>

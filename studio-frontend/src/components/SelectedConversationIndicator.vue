<template>
  <div class="selected-conversation-indicator">
    <span class="selected-conversation-indicator__text">
      {{
        $tc(
          "conversation.number_of_conversations_selected",
          selectedConversationsSize
        )
      }}
    </span>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    selectedConversationsSize: { type: Number, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>

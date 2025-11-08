<template>
  <router-link
    :title="conversation.name"
    :to="`/interface/conversations/${conversation._id}/transcription`"
    class="conversation-line__title h3 no-padding">
    {{ conversation.name }}
  </router-link>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    conversation: { type: Object, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>

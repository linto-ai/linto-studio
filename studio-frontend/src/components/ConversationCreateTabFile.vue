<template></template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import ConversationCreateMixin from "@/mixins/conversationCreate.js"
import ConversationCreateAudio from "./ConversationCreateAudio.vue"
import ConversationCreateServices from "@/components/ConversationCreateServices.vue"

export default {
  mixins: [ConversationCreateMixin],
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment, ConversationCreateAudio, ConversationCreateServices },
}
</script>

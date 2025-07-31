<template>
  <SessionChannelTurn
    :previous="previous"
    :turn="turn"
    :selectedTranslations="selectedTranslations"
    :channelLanguages="channelLanguages" />
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"

import SessionChannelTurn from "@/components/SessionChannelTurn.vue"

export default {
  props: {
    previous: {
      type: Object,
      required: false,
    },
    partialText: {
      type: String,
      required: true,
    },
    partialObject: {
      type: Object,
      required: true,
    },
    selectedTranslations: {
      type: String,
      required: false,
      default: "original",
    },
    channelLanguages: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    turn() {
      return this.partialObject
    },
  },
  methods: {},
  components: { Fragment, SessionChannelTurn },
}
</script>

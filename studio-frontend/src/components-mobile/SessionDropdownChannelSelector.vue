<template>
  <div class="dropdown-channel-selector">
    <SessionChannelsSelector
      class="flex1"
      :channels="channels"
      :selectedChannel="selectedChannel"
      v-model="selectedChannel"></SessionChannelsSelector>

    <SessionTranslationSelection
      class="flex1"
      :selectedChannel="selectedChannel"
      :selectedTranslation="selectedTranslation"
      v-model="selectedTranslation"></SessionTranslationSelection>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"

export default {
  props: {
    channels: {
      type: Array,
      required: true,
    },
    selectedChannel: {
      type: Object,
      required: true,
    },
    selectedTranslation: {
      type: String,
      default: "original",
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {
    SessionChannelsSelector,
    SessionTranslationSelection,
  },
}
</script>

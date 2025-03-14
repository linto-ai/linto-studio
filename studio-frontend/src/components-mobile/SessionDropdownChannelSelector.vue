<template>
  <div class="dropdown-channel-selector">
    <SessionChannelsSelector
      class="flex1"
      :channels="channels"
      :selectedChannel="selectedChannel"
      v-model="p_selectedChannel"></SessionChannelsSelector>

    <SessionTranslationSelection
      class="flex1"
      :selectedChannel="selectedChannel"
      :selectedTranslation="selectedTranslation"
      v-model="p_selectedTranslation"></SessionTranslationSelection>
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
    return {
      p_selectedTranslation: this.selectedTranslation,
      p_selectedChannel: this.selectedChannel,
    }
  },
  watch: {
    p_selectedTranslation(value) {
      this.$emit("update:selectedTranslation", value)
    },
    p_selectedChannel(value) {
      this.$emit("update:selectedChannel", value)
    },
    selectedTranslation(value) {
      this.p_selectedTranslation = value
    },
    selectedChannel(value) {
      this.p_selectedChannel = value
    },
  },
  mounted() {},
  methods: {},
  components: {
    SessionChannelsSelector,
    SessionTranslationSelection,
  },
}
</script>

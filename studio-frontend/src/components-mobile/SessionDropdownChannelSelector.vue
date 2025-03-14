<template>
  <div class="dropdown-channel-selector">
    <div class="dropdown-channel-selector__bar flex align-center">
      <div class="dropdown-channel-selector__bar__channel flex1">
        <span>{{ selectedChannel.name }}</span>
      </div>
      <button class="only-icon transparent">
        <span class="icon top-arrow" />
      </button>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
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
    console.log("channels", this.channels)
    console.log("selectedChannel", this.selectedChannel)
    console.log("selectedTranslation", this.selectedTranslation)
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>

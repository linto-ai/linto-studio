<template>
  <div class="flex col">
    <label for="channel-selector" class="text-cut">{{
      $t("session.live_page.channel_selector.label")
    }}</label>
    <CustomSelect
      class="channel-selector fullwidth"
      v-model="selectedChannel"
      id="channel-selector"
      :aria-label="$t('session.live_page.channel_selector.label')"
      :valueKey="(c) => c.id"
      :options="channelsList" />
  </div>
</template>
<script>
import CustomSelect from "@/components/molecules/CustomSelect.vue"

import { bus } from "@/main.js"
export default {
  props: {
    channels: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    console.log("SessionChannelsSelector", this.channels)
    return {}
  },
  computed: {
    name() {
      return "name"
    },
    channelsList() {
      let channelsList = this.channels.map((channel) => {
        return {
          value: channel,
          text: `${channel.name}`,
        }
      })

      return {
        channels: channelsList,
      }
    },
    selectedChannel: {
      get() {
        return this.value
      },
      set(channelId) {
        this.$emit(
          "input",
          this.channels.find((c) => c.id === channelId),
        )
      },
    },
  },
  mounted() {},
  methods: {},
  components: { CustomSelect },
}
</script>

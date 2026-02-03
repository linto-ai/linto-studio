<template>
  <div class="flex col">
    <label for="channel-selector">{{
      $t("app_editor_channels_selector.label")
    }}</label>
    <CustomSelect
      class="channel-selector fullwidth"
      v-model="selectedChannel"
      id="channel-selector"
      :aria-label="$t('session.live_page.channel_selector.label')"
      :options="channelsList" />
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import CustomSelect from "@/components/molecules/CustomSelect.vue"

import { bus } from "@/main.js"
export default {
  props: {
    channels: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    name() {
      return "name"
    },
    channelsList() {
      let channelsList
      // Case with two channels, one offline and one live:
      if (this.channels.length == 2) {
        if (this.channels[0].metadata.transcription) {
          channelsList = [
            {
              value: this.channels[0]._id,
              text: this.$t("conversation.channel.offline_transcription"),
            },
            {
              value: this.channels[1]._id,
              text: this.$t("conversation.channel.live_transcription"),
            },
          ]

          return {
            channels: channelsList,
          }
        }

        if (this.channels[1].metadata.transcription) {
          channelsList = [
            {
              value: this.channels[1]._id,
              text: this.$t("conversation.channel.offline_transcription"),
            },
            {
              value: this.channels[0]._id,
              text: this.$t("conversation.channel.live_transcription"),
            },
          ]

          return {
            channels: channelsList,
          }
        }
      }

      // Generic case

      channelsList = this.channels.map((channel) => {
        let text = channel.name.replace("multiple channels - ", "")
        return {
          value: channel._id,
          text,
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
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  mounted() {},
  methods: {},
  components: { Fragment, CustomSelect },
}
</script>

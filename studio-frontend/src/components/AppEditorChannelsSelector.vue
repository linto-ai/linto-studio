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
    <span
      v-if="hasProcessingChannels"
      class="channels-processing-hint">
      <span class="icon loading"></span>
      {{ $t("app_editor_channels_selector.transcription_in_progress") }}
    </span>
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
    hasProcessingChannels() {
      return this.channels.some(
        (channel) => this.isChannelProcessing(channel),
      )
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
              disabled: this.isChannelProcessing(this.channels[0]),
            },
            {
              value: this.channels[1]._id,
              text: this.$t("conversation.channel.live_transcription"),
              disabled: this.isChannelProcessing(this.channels[1]),
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
              disabled: this.isChannelProcessing(this.channels[1]),
            },
            {
              value: this.channels[0]._id,
              text: this.$t("conversation.channel.live_transcription"),
              disabled: this.isChannelProcessing(this.channels[0]),
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
        const processing = this.isChannelProcessing(channel)
        if (processing) {
          text += ` (${this.$t("app_editor_channels_selector.transcription_in_progress")})`
        }
        return {
          value: channel._id,
          text,
          disabled: processing,
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
  methods: {
    isChannelProcessing(channel) {
      const state = channel.jobs?.transcription?.state
      return !!state && state !== "done" && state !== "error"
    },
  },
  components: { Fragment, CustomSelect },
}
</script>

<style lang="scss" scoped>
.channels-processing-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--dark-70);
}
</style>

<template>
  <div class="emoji-picker-container" ref="emojiPicker-container">
    <Button
      class="neutral outline icon-only"
      ref="emojiPicker-button"
      :icon="value ? null : 'smiley-blank'"
      :avatar-text="value || null"
      :avatar-color="value ? 'primary-soft' : null"
      variant="outline"
      size="md"
      @mouseenter.prevent
      @mouseleave.prevent
      @click="openEmojiPicker" />
  </div>
</template>
<script>
import { EmojiButton } from "@joeattardi/emoji-button"
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      picker: null,
    }
  },
  mounted() {},
  methods: {
    openEmojiPicker(e) {
      if (!this.picker) {
        this.picker = new EmojiButton({
          position: "bottom-start",
          rootElement: this.$refs["emojiPicker-container"],
        })
        this.picker.on("emoji", (selection) => {
          this.$emit("input", selection.emoji)
        })
      }

      this.picker.togglePicker(this.$refs["emojiPicker-button"].$el)
    },
  },
  components: {},
}
</script>

<style lang="scss">
.emoji-picker-container {
  display: inline-block;
}

.emoji-picker__wrapper {
  z-index: 2;
}
</style>

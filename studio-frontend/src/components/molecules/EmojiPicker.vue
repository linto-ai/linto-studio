<template>
  <div
    class="emoji-picker-container"
    ref="emojiPicker-container"
    v-click-outside="closeEmojiPicker">
    <Button
      ref="emojiPicker-button"
      :icon="value ? null : 'smiley-blank'"
      :avatar-text="value || null"
      :avatar-color="value ? 'primary-soft' : null"
      iconWeight="regular"
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
      domElementWithListener: [],
    }
  },
  mounted() {
    if (document.getElementsByClassName("modal")) {
      Array.from(document.getElementsByClassName("modal")).forEach((el) => {
        el.addEventListener("click", this.closeEmojiPicker)
        this.domElementWithListener.push(el)
      })
    }
  },
  beforeDestroy() {
    this.domElementWithListener.forEach((el) => {
      el.removeEventListener("click", this.closeEmojiPicker)
    })
    if (this.picker) this.picker.destroyPicker()
  },
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
    closeEmojiPicker(e) {
      if (e && e.target.closest(".emoji-picker-container")) return
      if (!this.picker) return
      this.picker.hidePicker()
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

button.emoji-picker__category-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: unset;
}
</style>

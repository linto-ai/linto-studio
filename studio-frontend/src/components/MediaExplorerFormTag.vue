<template>
  <Modal title="Créer un tag" isForm @submit="onSubmit" :loading="loading">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open"></slot>
    </template>
    <template #content>
      <div class="media-explorer-form-tag__content">
        <p>
          Les tags vous permettent de créer des collections de médias. Demain
          ils seront utiles pour automatiser des actions.
        </p>
        <div class="input-group">
          <label for="tag-name">Attributs du tag</label>
          <span class="input-item">
            <Popover position="bottom">
              <template #trigger>
                <span
                  class="emoji-popover-trigger"
                  @click="toggleEmojiPopover"
                  ref="emojiTrigger">
                  {{ selectedEmoji ? selectedEmoji.native : "🙂" }}
                </span>
              </template>
              <template #content>
                <Picker
                  @select="onSelectEmoji"
                  :showPreview="false"
                  :showSkinTones="false"
                  :title="'Choisir un emoji'"
                  :emoji="selectedEmoji ? selectedEmoji.id : 'smile'"
                  @click.stop />
              </template>
            </Popover>
            <input
              type="color"
              placeholder="orange"
              class="input-item__prefix"
              v-model="color" />
            <input
              type="text"
              placeholder="Tag name"
              class="input-item__input"
              v-model="name" />
          </span>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import Popover from "@/components/atoms/Popover.vue"
import { Picker } from "emoji-mart-vue"
import "emoji-mart-vue/css/emoji-mart.css"

export default {
  name: "MediaExplorerFormTag",
  components: {
    Modal,
    Picker,
    Popover,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedEmoji: null,
      name: "",
      color: "#11977c",
      emojiPopoverOpen: false,
    }
  },
  methods: {
    toggleEmojiPopover() {
      this.emojiPopoverOpen = !this.emojiPopoverOpen
      console.log("toggleEmojiPopover", this.emojiPopoverOpen)
    },
    onSelectEmoji(emoji) {
      this.selectedEmoji = emoji
      this.emojiPopoverOpen = false
    },
    onSubmit() {
      this.$emit("submit", {
        name: this.name,
        color: this.color,
        emoji: this.selectedEmoji?.unified || "",
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-form-tag {
  &__content {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }
}
.emoji-popover-trigger {
  font-size: 2em;
  margin-right: 0.5em;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  border-radius: 4px;
  border: 1px solid var(--neutral-90, #ccc);
  background: var(--neutral-10, #fff);
  transition: box-shadow 0.2s;
}
.emoji-popover-trigger:hover {
  box-shadow: 0 0 0 2px var(--primary-color, #007bff);
}
</style>

<style lang="scss">
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.input-group input[type="color"] {
  width: 32px;
  height: 32px;
  padding: 0;
  border: var(--border-input);
  background-color: transparent;
  border-radius: 4px;
  border: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 1px solid var(--neutral-90);
    border-radius: 4px;
  }
}
</style>

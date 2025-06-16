<template>
  <Modal title="Créer un tag" isForm @submit="onSubmit" :loading="loading" overlay>
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
            <Popover position="bottom" width="auto">
              <template #trigger>
                <Button
                  class="neutral outline icon-only"
                  :icon="selectedEmoji ? null : 'smiley-blank'"
                  :avatar-text="selectedEmoji ? selectedEmoji.native : null"
                  :avatar-color="selectedEmoji ? 'primary-soft' : null"
                  variant="outline"
                  size="sm"
                  @mouseenter.prevent
                  @mouseleave.prevent />
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
            <Popover position="bottom" v-model="colorPopoverOpen">
              <template #trigger>
                <Button
                  class="neutral outline icon-only"
                  variant="outline"
                  size="sm"
                  :avatar-color="color" />
              </template>
              <template #content>
                <Box class="color-picker p-1">
                  <div class="color-picker__color" v-for="color in TAG_COLORS" :key="color" :style="{ backgroundColor: color }" @click="handlePickColor(color)"></div>
                </Box>
              </template>
            </Popover>
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

const TAG_COLORS = [
  "#931F1F",
  "#933C1F",
  "#93591F",
  "#93761F",
  "#93931F",
  "#76931F",
  "#59931F",
  "#3C931F",
  "#1F931F",
  "#1F933C",
  "#1F9359",
  "#1F9376",
  "#1F9393",
  "#1F7693",
  "#1F5993",
  "#1F3C93",
  "#1F1F93",
  "#3C1F93",
  "#591F93",
  "#761F93",
  "#931F93",
  "#931F76",
  "#931F59",
  "#931F3C" 
];

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
      colorPopoverOpen: false,
      TAG_COLORS,
    }
  },
  methods: {
    handlePickColor(color) {
      this.color = color
      this.colorPopoverOpen = false
    },
    onSelectEmoji(emoji) {
      this.selectedEmoji = emoji
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
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em;
  max-width: 200px;

  &__color {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    border: 1px solid var(--neutral-90);
    cursor: pointer;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid var(--neutral-90);
      box-shadow: 0 0 0 2px var(--neutral-10);
    }
  }
}

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

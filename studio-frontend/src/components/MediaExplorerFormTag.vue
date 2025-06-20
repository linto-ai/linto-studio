<template>
  <Modal
    :title="tag ? 'Modifier un tag' : 'Créer un tag'"
    isForm
    @submit="onSubmit"
    :loading="loading"
    :value="value"
    overlay>
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
                  size="md"
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
                  size="md"
                  :avatar-color="computedAvatarColor" />
              </template>
              <template #content>
                <Box class="color-picker p-1">
                  <div
                    class="color-picker__color"
                    v-for="color in TAG_COLORS"
                    :key="color"
                    :style="{ backgroundColor: `var(--material-${color}-500)` }"
                    @click="handlePickColor(color)"></div>
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
        <div class="input-group">
          <label for="tag-name">Description du tag</label>
          <textarea
            placeholder="Description du tag"
            v-model="description"
            rows="3"
            maxlength="255" />
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

/*
 * Material color identifiers defined in _material-colors.scss
 * Only the base name (without the shade number) is stored.
 * The preview uses shade 500 to give a medium-tone overview.
 */
const TAG_COLORS = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "grey",
  "blue-grey",
]

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
    tag: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedEmoji: null,
      name: "",
      description: "",
      color: "teal",
      colorPopoverOpen: false,
      TAG_COLORS,
    }
  },
  watch: {
    tag: {
      handler(tag) {
        if (!tag) return
        this.name = tag.name
        this.description = tag.description
        this.color = tag.color
        this.selectedEmoji = tag.emoji
      },
      immediate: true,
    },
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
        description: this.description,
        color: this.color,
        emoji: this.selectedEmoji?.unified || "",
      })
    },
  },
  computed: {
    computedAvatarColor() {
      return `var(--material-${this.color}-500)`
    },
  },
}
</script>

<style lang="scss" scoped>
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em;
  max-width: 240px;

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

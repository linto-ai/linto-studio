<template>
  <Modal
    :title="tag ? 'Modifier un tag' : 'Créer un tag'"
    isForm
    @submit="onSubmit"
    :loading="loading"
    v-model="isOpen"
    :size="computedSize"
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
                  :avatar-text="selectedEmoji || null"
                  :avatar-color="selectedEmoji ? 'primary-soft' : null"
                  variant="outline"
                  size="md"
                  @mouseenter.prevent
                  @mouseleave.prevent />
              </template>
              <template #content>
                <div class="emoji-picker-content">
                  <div class="emoji-search">
                    <input
                      type="text"
                      v-model="emojiSearch"
                      placeholder="Rechercher un emoji..."
                      class="emoji-search-input" />
                  </div>
                  <div class="emoji-categories">
                    <div
                      v-for="(category, categoryName) in filteredEmojis"
                      :key="categoryName"
                      class="emoji-category">
                      <h5 class="emoji-category-title">{{ categoryName }}</h5>
                      <div class="emoji-grid">
                        <span
                          v-for="emoji in category"
                          :key="emoji"
                          @click="onSelectEmoji(emoji)"
                          :title="emoji"
                          class="emoji-item"
                          >{{ emoji }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
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

const EMOJI_CATEGORIES = {
  Faces: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "🙃",
    "😉",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "😚",
    "😙",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "🤥",
  ],
  Nature: [
    "🌱",
    "🌿",
    "🍀",
    "🌳",
    "🌲",
    "🌴",
    "🌵",
    "🌾",
    "🌻",
    "🌺",
    "🌸",
    "🌼",
    "🌷",
    "🥀",
    "🌹",
    "🌌",
    "🌞",
    "🌝",
    "🌛",
    "🌜",
    "🌚",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "⭐",
    "🌟",
    "💫",
    "✨",
    "☄️",
    "🌍",
    "🌎",
    "🌏",
    "🔥",
    "💧",
    "🌊",
  ],
  Objects: [
    "💼",
    "👜",
    "🎒",
    "💻",
    "📱",
    "⌚",
    "📷",
    "📹",
    "🎬",
    "📺",
    "📻",
    "🎵",
    "🎶",
    "🎤",
    "🎧",
    "📞",
    "☎️",
    "📠",
    "🔌",
    "🔋",
    "🪫",
    "💡",
    "🔦",
    "🕯️",
    "🗑️",
    "🛒",
    "💰",
    "💎",
    "⚖️",
    "🔧",
    "🔨",
    "⚒️",
    "🛠️",
    "⛏️",
    "🔩",
    "⚙️",
    "⛓️",
    "🔫",
    "💣",
  ],
  Activities: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛷",
    "⛸️",
    "🥌",
    "🎿",
    "⛷️",
    "🏂",
    "🪂",
    "🏋️",
    "🤼",
    "🤸",
    "⛹️",
    "🤺",
    "🏌️",
  ],
  Food: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥖",
    "🍞",
    "🥨",
    "🥯",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
  ],
  Travel: [
    "🚗",
    "🚕",
    "🚙",
    "🚌",
    "🚎",
    "🏎️",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🛻",
    "🚚",
    "🚛",
    "🚜",
    "🏍️",
    "🛵",
    "🚲",
    "🛴",
    "🛹",
    "🛼",
    "🚁",
    "✈️",
    "🛩️",
    "🛫",
    "🛬",
    "🪂",
    "💺",
    "🚀",
    "🛸",
    "🚉",
    "🚇",
    "🚂",
    "🚃",
    "🚄",
    "🚅",
    "🚆",
    "🚈",
    "🚊",
    "🚝",
    "🚞",
  ],
  Symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
  ],
}

export default {
  name: "MediaExplorerFormTag",
  components: {
    Modal,
    Popover,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    initialName: {
      type: String,
      default: "",
    },
    tag: {
      type: Object,
      default: () => ({}),
    },
    value: Boolean,
  },
  data() {
    return {
      emojiSearch: "",
      selectedEmoji: null,
      name: this.initialName,
      description: "",
      color: "teal",
      colorPopoverOpen: false,
      TAG_COLORS,
      EMOJI_CATEGORIES,
      internalOpen: false,
    }
  },
  watch: {
    tag: {
      handler(tag) {
        if (!tag) return
        this.name = tag.name
        this.description = tag.description
        this.color = tag.color
        this.selectedEmoji = tag.emoji || null

        // Auto-select emoji from name or description if not already set
        if (!this.selectedEmoji) {
          this.autoSelectEmojiFromText()
        }
      },
      immediate: true,
    },
    name: {
      handler() {
        // Auto-select emoji when typing in name field
        if (!this.selectedEmoji) {
          this.autoSelectEmojiFromText()
        }
      },
    },
    description: {
      handler() {
        // Auto-select emoji when typing in description field
        if (!this.selectedEmoji) {
          this.autoSelectEmojiFromText()
        }
      },
    },
    isOpen: {
      handler(val) {
        if (val) {
          this.name = this.initialName
        }
      },
    },
  },
  methods: {
    /**
     * Extract first emoji from a text string
     * @param {string} text - Text to analyze
     * @returns {string|null} - First emoji found or null
     */
    extractFirstEmoji(text) {
      if (!text) return null

      // Enhanced emoji regex that captures most emoji patterns
      const emojiRegex =
        /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

      const matches = text.match(emojiRegex)
      return matches ? matches[0] : null
    },

    /**
     * Auto-select emoji from name or description text
     */
    autoSelectEmojiFromText() {
      // Check name first, then description
      const firstEmoji =
        this.extractFirstEmoji(this.name) ||
        this.extractFirstEmoji(this.description)

      if (firstEmoji) {
        this.selectedEmoji = firstEmoji
      }
    },

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
        emoji: this.selectedEmoji || "",
      })

      this.name = ""
      this.description = ""
      this.color = "teal"
      this.selectedEmoji = null
      this.emojiSearch = ""
    },
  },
  computed: {
    computedAvatarColor() {
      return `var(--material-${this.color}-500)`
    },
    filteredEmojis() {
      if (!this.emojiSearch.trim()) {
        return this.EMOJI_CATEGORIES
      }

      const search = this.emojiSearch.toLowerCase()
      const filtered = {}

      Object.keys(this.EMOJI_CATEGORIES).forEach((category) => {
        const categoryEmojis = this.EMOJI_CATEGORIES[category]
        const matchingEmojis = categoryEmojis.filter((emoji) => {
          // Simple emoji matching - could be enhanced with emoji names
          return (
            emoji.includes(search) || category.toLowerCase().includes(search)
          )
        })

        if (matchingEmojis.length > 0) {
          filtered[category] = matchingEmojis
        }
      })

      return filtered
    },
    isOpen: {
      get() {
        const isControlled =
          this.$options.propsData &&
          Object.prototype.hasOwnProperty.call(this.$options.propsData, "value")

        return isControlled ? this.value : this.internalOpen
      },
      set(val) {
        const isControlled =
          this.$options.propsData &&
          Object.prototype.hasOwnProperty.call(this.$options.propsData, "value")

        if (isControlled) {
          this.$emit("input", val)
        } else {
          this.internalOpen = val
        }
      },
    },
    computedSize() {
      if (window.innerWidth < 1100) {
        return "screen"
      }
      return "md"
    },
  },
}
</script>

<style lang="scss" scoped>
.input-item input {
  width: 100%;
  flex: 1;
  max-width: 100%;
}

textarea {
  width: 100%;
  flex: 1;
  max-width: 100%;
}

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

.emoji-picker-content {
  max-width: 320px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.emoji-search {
  padding: 8px;
  border-bottom: 1px solid var(--neutral-20);

  &-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--neutral-30);
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: var(--primary-500);
    }
  }
}

.emoji-categories {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.emoji-category {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  &-title {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--neutral-70);
    margin: 0 0 8px 0;
    padding: 0;
  }
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--neutral-20);
  }
}

@media (max-width: 1100px) {
  .emoji-picker-content {
    max-width: 90vw;
    max-height: 60vh;
  }

  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>

<template>
  <div
    class="chip-tag"
    :class="[active ? 'active' : '', clickable, size]"
    :style="{
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      color: colorText,
    }"
    @click="$emit('click')">
    <span class="chip-tag__data">
      <span v-if="emoji" class="chip-tag__icon-wrapper">
        <span
          class="chip-tag__icon-emoji"
          :style="{ borderColor: borderColor }">
          {{ unifiedToEmoji(emoji) }}
        </span>
      </span>
      <span
        class="chip-tag__name"
        ref="tagName"
        :contenteditable="contentEditableProperty"
        @focus="onTagNameFocus"
        @input="onTagNameChange"
        @blur="onTagNameBlur"
        @keydown.enter.prevent="onTagNameBlur"
        @keydown.esc.prevent="onTagNameReset"
        :class="{ 'with-emoji': emoji }"
        :style="{ color: colorText }">
        {{ currentName }}
      </span>
      <ph-icon v-if="active" name="trash" color="var(--neutral-10)" />
      <Avatar
        v-if="count"
        class="chip-tag__count"
        size="xs"
        color="var(--neutral-20)"
        color-text="var(--neutral-10)">
        {{ count }}
      </Avatar>
      <slot></slot>
      <Button
        v-if="removable"
        icon="x"
        size="xs"
        color="tertiary"
        shape="circle"
        variant="transparent"
        @click="$emit('remove')" />
    </span>
    <span v-if="description" class="chip-tag__description">
      {{ description }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ChipTag",
  props: {
    name: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "teal",
    },
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [Number, String],
      default: "md",
    },
    count: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    removable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    startEditionEmpty: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentName: this.name,
    }
  },
  watch: {
    name(newName) {
      this.currentName = newName
    },
  },
  computed: {
    clickable() {
      return this.$listeners.click ? "clickable" : ""
    },
    borderColor() {
      return `var(--material-${this.color}-500)`
    },
    backgroundColor() {
      return `var(--material-${this.color}-${this.active ? 800 : 100})`
    },
    colorText() {
      return this.active ? "white" : `var(--material-${this.color}-900)`
    },
    contentEditableProperty() {
      // to support old ESR versions (not for a long time, firefox 140 is the last ESR, released on June 24, 2025 )
      if (navigator.userAgent.indexOf("Firefox") > -1) {
        const version = navigator.userAgent.split("Firefox/")[1]
        if (parseInt(version) < 139) {
          return this.editable ? "true" : "false"
        }
      }
      return this.editable ? "plaintext-only" : "false"
    },
  },
  methods: {
    unifiedToEmoji(unified) {
      if (!unified) return ""

      try {
        return unified
          .split("-")
          .map((u) => String.fromCodePoint(parseInt(u, 16)))
          .join("")
      } catch (e) {
        return unified
      }
    },
    onTagNameFocus() {
      if (!this.editable) return
      if (this.startEditionEmpty) {
        this.currentName = ">"
        this.$nextTick(() => {
          this.$refs.tagName.innerText = ">"
          //move cursor to the end
          const range = document.createRange()
          range.selectNodeContents(this.$refs.tagName)
          range.collapse(false)
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
          this.$refs.tagName.focus()
        })
      }
    },
    onTagNameChange(e) {
      let newValue = e.target.innerText
      // remove new lines
      //newValue = newValue.replace(/(\r\n|\n|\r)/gm, "")
      newValue = newValue.replace(">", "")
      this.$emit("input", newValue)
    },
    onTagNameBlur(e) {
      if (this.$refs.tagName.innerText.replace(">", "").trim() === "") {
        this.onTagNameReset()
        return
      }
      this.$emit("blur")
      document.activeElement?.blur && document.activeElement.blur()
    },
    onTagNameReset(e) {
      this.currentName = this.name
      this.$nextTick(() => {
        this.$refs.tagName.innerText = this.name
      })
      document.activeElement?.blur && document.activeElement.blur()
      e?.stopPropagation()
      e?.preventDefault()
    },
  },
}
</script>

<style lang="scss" scoped>
.chip-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // padding-left: 0.5em;
  // padding-right: 0.5em;
  padding: 0.25em 0.5em;
  box-sizing: border-box;
  height: 25px;
  text-transform: capitalize;
  border: 1px solid;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  text-overflow: ellipsis;

  white-space: nowrap;
  // box-shadow:
  //   inset 0 0 0 1px rgba(255, 255, 255, 0.4),
  //   inset 0px 0.2px 0 1px rgba(255, 255, 255, 0.4);
  &.active {
    .chip-tag__count {
      display: none;
    }
  }

  &:has(.chip-tag__count) {
    padding-right: 0.25em;
  }

  &:hover {
    border-color: currentColor !important;
  }
  .chip-tag__data {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    //line-height: 1em;
  }

  .chip-tag__name {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chip-tag__name:focus {
    outline: none;
  }

  .chip-tag__count {
    border-radius: 4px;
  }

  &:has(.chip-tag__name:focus) {
    background-color: white !important;
    color: var(--text-color);
  }

  &.clickable {
    cursor: pointer;
  }
}
</style>

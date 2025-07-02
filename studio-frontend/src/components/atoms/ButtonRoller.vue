<template>
  <button
    class="btn btn-roller"
    :class="classes"
    :style="styles"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :aria-disabled="disabled || loading"
    :title="isIconOnly ? $attrs.ariaLabel : ''"
    v-on="$listeners"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <span class="btn-prefix-label">
      <span class="btn-prefix" v-if="!isIconOnly">
        <!-- Roller icon container -->
        <div
          ref="iconContainer"
          class="roller-icon"
          :class="{ spinning: isSpinning }">
          <!-- Default plus icon -->
          <ph-icon
            v-if="!isSpinning && !currentIcon && !isEasterEgg"
            name="plus"
            :weight="computedIconWeight"
            :color="computedIconColor"
            :size="iconSize" />

          <!-- Current rolled icon -->
          <ph-icon
            v-if="!isSpinning && currentIcon && !isEasterEgg"
            :name="currentIcon"
            :weight="computedIconWeight"
            :color="computedIconColor"
            :size="iconSize" />

          <!-- Easter egg LinTO logo -->
          <img
            v-if="!isSpinning && isEasterEgg"
            :src="lintoSvgUrl"
            alt="LinTO"
            class="linto-logo" />

          <!-- Spinning reel -->
          <div v-if="isSpinning" ref="reel" class="reel">
            <div
              v-for="(icon, index) in reelIcons"
              :key="index"
              class="reel-item">
              <ph-icon
                :name="icon"
                :weight="computedIconWeight"
                :color="computedIconColor"
                :size="iconSize" />
            </div>
          </div>
        </div>
      </span>

      <!-- Label/Content -->
      <span class="label">
        <slot>{{ label }}</slot>
      </span>
    </span>

    <!-- Icon only mode -->
    <div
      v-if="isIconOnly"
      ref="iconContainer"
      class="roller-icon"
      :class="{ spinning: isSpinning }">
      <!-- Default plus icon -->
      <ph-icon
        v-if="!isSpinning && !currentIcon && !isEasterEgg"
        name="plus"
        :weight="computedIconWeight"
        :color="computedIconColor"
        :size="iconSize" />

      <!-- Current rolled icon -->
      <ph-icon
        v-if="!isSpinning && currentIcon && !isEasterEgg"
        :name="currentIcon"
        :weight="computedIconWeight"
        :color="computedIconColor"
        :size="iconSize" />

      <!-- Easter egg LinTO logo -->
      <img
        v-if="!isSpinning && isEasterEgg"
        :src="lintoSvgUrl"
        alt="LinTO"
        class="linto-logo" />

      <!-- Spinning reel -->
      <div v-if="isSpinning" ref="reel" class="reel">
        <div v-for="(icon, index) in reelIcons" :key="index" class="reel-item">
          <ph-icon
            :name="icon"
            :weight="computedIconWeight"
            :color="computedIconColor"
            :size="iconSize" />
        </div>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: "ButtonRoller",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: false,
    },
    // Button props from original Button component
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: "primary",
      validator: (value) =>
        [
          "primary",
          "secondary",
          "tertiary",
          "neutral",
          "primary-soft",
          "primary-hard",
          "secondary-soft",
          "secondary-hard",
          "tertiary-soft",
          "tertiary-hard",
          "neutral-soft",
          "neutral-hard",
        ].includes(value),
    },
    borderColor: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
      default: "md",
      validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
    },
    shape: {
      type: String,
      required: false,
      default: "default",
      validator: (value) =>
        ["default", "rounded", "pill", "circle"].includes(value),
    },
    variant: {
      type: String,
      required: false,
      default: "solid",
      validator: (value) =>
        ["solid", "outline", "transparent", "text"].includes(value),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    iconOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    wrap: {
      type: Boolean,
      required: false,
      default: false,
    },
    rollerIcons: {
      type: Array,
      required: false,
      default: () => [
        "arrow-square-up", // import cloud
        "microphone", // micro studio
        "megaphone", // megaphone
        "broadcast", // streaming
        "file-video", // video
        "closed-captioning", // subtitles
      ],
    },
    easterEggFrequency: {
      type: Number,
      required: false,
      default: 5, // Every 5th spin
    },
    lintoSvgUrl: {
      type: String,
      required: false,
      default: "https://doc.linto.ai/img/linto.svg",
    },
    spinDuration: {
      type: Number,
      required: false,
      default: 1100,
    },
  },
  data() {
    return {
      isSpinning: false,
      isHovered: false,
      currentIcon: null,
      isEasterEgg: false,
      rollCount: 0,
    }
  },
  computed: {
    computedIconWeight() {
      if (this.variant === "solid") {
        return "fill"
      }
      return "regular"
    },
    computedIconColor() {
      if (this.variant === "solid") {
        return "primary-contrast"
      }
      return this.color || "primary"
    },
    isIconOnly() {
      return this.iconOnly || (!this.label && !this.$slots.default)
    },
    iconSize() {
      const sizeMap = {
        xs: "12",
        sm: "16",
        md: "20",
        lg: "24",
        xl: "28",
      }
      return sizeMap[this.size] || "20"
    },
    classes() {
      const classes = []

      // Base classes
      classes.push("btn", "btn-roller")

      // Variant/Color
      classes.push(this.color)

      // Size
      classes.push(this.size)

      // Shape
      if (this.shape !== "default") {
        classes.push(this.shape)
      }

      // Appearance
      if (this.variant === "outline") {
        classes.push("outline")
      } else if (this.variant === "transparent") {
        classes.push("transparent")
      } else if (this.variant === "text") {
        classes.push("text")
      }

      // Layout
      if (this.block) {
        classes.push("block")
      }

      if (this.isIconOnly) {
        classes.push("only-icon")
      }

      if (this.wrap) {
        classes.push("wrap")
      }

      // States
      if (this.disabled) {
        classes.push("disabled")
      }

      if (this.active) {
        classes.push("active")
      }

      return classes
    },
    styles() {
      return {
        borderColor: this.borderColor,
      }
    },
    reelIcons() {
      return [...this.rollerIcons, ...this.rollerIcons]
    },
  },
  methods: {
    handleMouseEnter() {
      this.isHovered = true
      this.spin()
    },
    handleMouseLeave() {
      this.isHovered = false
      if (!this.isSpinning) {
        this.showPlus()
      }
    },
    showPlus() {
      this.currentIcon = null
      this.isEasterEgg = false
    },
    async spin() {
      if (this.isSpinning) return

      this.isSpinning = true
      this.rollCount++

      await this.$nextTick()

      const iconContainer = this.$refs.iconContainer
      if (!iconContainer) return

      const slotHeight = iconContainer.clientHeight
      const loops = 1
      const stopAt = Math.floor(Math.random() * this.rollerIcons.length)
      const distance = (loops * this.rollerIcons.length + stopAt) * slotHeight

      const reel = this.$refs.reel
      if (!reel) return

      // Set initial position
      reel.style.transition = "none"
      reel.style.transform = "translateY(0)"

      // Start animation on next frame
      await this.$nextTick()

      reel.style.transition = `transform ${this.spinDuration}ms cubic-bezier(.42,0,.58,1)`
      reel.style.transform = `translateY(-${distance}px)`

      // Handle animation end
      setTimeout(() => {
        this.isSpinning = false

        // Check for easter egg
        const isEaster = this.rollCount % this.easterEggFrequency === 0

        if (isEaster) {
          this.isEasterEgg = true
          this.currentIcon = null
        } else {
          this.isEasterEgg = false
          this.currentIcon = this.rollerIcons[stopAt]
        }

        if (!this.isHovered) {
          this.showPlus()
        }
      }, this.spinDuration)
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-roller {
  .btn-prefix-label {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-prefix {
      margin-right: 0.5rem;
    }
  }
  .roller-icon {
    position: relative;
    overflow: hidden;
    width: 1.6rem;
    height: 1.6rem;
    border: 2px solid currentColor;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s ease;

    .linto-logo {
      width: 70%;
      height: 70%;
      object-fit: contain;
    }

    .reel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;

      .reel-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.6rem;
        flex-shrink: 0;
      }
    }
  }

  &:hover .roller-icon {
    transform: rotate(10deg) scale(1.1);
  }

  .label {
    display: inline-block;
    min-width: 5.5ch;
  }

  &.xs .roller-icon {
    width: 1.2rem;
    height: 1.2rem;

    .reel-item {
      height: 1.2rem;
    }
  }

  &.sm .roller-icon {
    width: 1.4rem;
    height: 1.4rem;

    .reel-item {
      height: 1.4rem;
    }
  }

  &.lg .roller-icon {
    width: 1.8rem;
    height: 1.8rem;

    .reel-item {
      height: 1.8rem;
    }
  }

  &.xl .roller-icon {
    width: 2rem;
    height: 2rem;

    .reel-item {
      height: 2rem;
    }
  }

  &.only-icon {
    .roller-icon {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    &.xs .roller-icon .reel-item {
      height: 16px;
    }

    &.sm .roller-icon .reel-item {
      height: 24px;
    }

    &.md .roller-icon .reel-item {
      height: 24px;
    }

    &.lg .roller-icon .reel-item {
      height: 32px;
    }

    &.xl .roller-icon .reel-item {
      height: 32px;
    }
  }
}
</style>

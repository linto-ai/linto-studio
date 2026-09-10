<template>
  <div
    class="avatar"
    :class="[sizeClass, tone, clickable, circle ? 'circle' : '']"
    :style="frameStyle"
    @click="$emit('click')">
    <AvatarImage v-if="src" :src="src" :alt="text" />
    <AvatarIcon v-else-if="icon" :name="icon" />
    <AvatarInitials v-else-if="text" :text="text" />
    <AvatarEmoji v-else-if="emoji" :unified="emoji" />
    <slot v-else></slot>
  </div>
</template>

<script>
import AvatarImage from "./AvatarImage.vue"
import AvatarInitials from "./AvatarInitials.vue"
import AvatarIcon from "./AvatarIcon.vue"
import AvatarEmoji from "./AvatarEmoji.vue"
import { SIZE_SCALE } from "@/const/componentSize"

// Avatar is a frame: it owns size/shape/tone and renders one content child
// (AvatarImage/AvatarIcon/AvatarInitials/AvatarEmoji) picked by priority
// (src > icon > text > emoji > slot). No style prop is ever passed down to
// a child — size reaches them as the --avatar-size CSS custom property
// (consumed as a font-size ratio, see .avatar below), and color/tone reaches
// them purely by CSS inheritance (currentColor). A child only ever receives
// its own content data (src, icon name, text, emoji).
export default {
  name: "Avatar",
  components: { AvatarImage, AvatarInitials, AvatarIcon, AvatarEmoji },
  props: {
    src: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
    emoji: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    circle: {
      type: Boolean,
      required: false,
      default: false,
    },
    // xs/sm/md/lg/xl, or a raw number (px) for a one-off custom size.
    size: {
      type: [Number, String],
      required: false,
      default: "sm",
    },
    // Intent, not a color: which fond/contenu pair the frame renders.
    // primary = solid, high-contrast (identity — initials, photos).
    // soft = pale fond + colored content (a badge-like category marker).
    // neutral = gray, for a purely decorative/inert marker.
    tone: {
      type: String,
      required: false,
      default: "primary",
      validator: (value) => ["primary", "soft", "neutral"].includes(value),
    },
  },
  computed: {
    clickable() {
      return this.$listeners.click ? "clickable" : ""
    },
    sizeClass() {
      return SIZE_SCALE[this.size] ? this.size : null
    },
    frameStyle() {
      if (SIZE_SCALE[this.size]) return {}
      const n = Number(this.size)
      return n ? { "--avatar-size": `${n}px` } : {}
    },
  },
}
</script>

<style lang="scss">
a:hover .avatar {
  /* hack to make the avatar clickable without ugly underline */
  text-decoration: underline overline;
  text-decoration-color: var(--primary-color);
}

.avatar {
  --avatar-size: 1.25rem; // sm, overridden by a size class or frameStyle
  position: relative;
  padding: 0;
  margin: 0;
  border-radius: 4px;
  width: var(--avatar-size);
  height: var(--avatar-size);
  // Content (icon/initials/emoji) sizes itself off this, in CSS, by
  // inheriting font-size — no size prop is passed to any child.
  font-size: calc(var(--avatar-size) * 0.8);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.circle {
    border-radius: 50%;
  }

  &.clickable {
    cursor: pointer;
  }

  &.xs {
    --avatar-size: 1rem;
  }

  &.sm {
    --avatar-size: 1.25rem;
  }

  &.md {
    --avatar-size: 1.5rem;
  }

  &.lg {
    --avatar-size: 1.75rem;
  }

  &.xl {
    --avatar-size: 2rem;
  }

  &.primary {
    background-color: var(--primary-color);
    color: var(--primary-soft);
  }

  &.soft {
    background-color: var(--primary-soft);
    color: var(--primary-color);
  }

  &.neutral {
    background-color: var(--neutral-15);
    color: var(--neutral-80);
  }
}
</style>

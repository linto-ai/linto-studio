<template>
  <span class="avatar-emoji">{{ character }}</span>
</template>

<script>
export default {
  name: "AvatarEmoji",
  props: {
    // Unified codepoint string (e.g. "1f600"), as used by emoji-picker data.
    unified: { type: String, required: true },
  },
  computed: {
    character() {
      try {
        return this.unified
          .split("-")
          .map((u) => String.fromCodePoint(parseInt(u, 16)))
          .join("")
      } catch {
        return this.unified
      }
    },
  },
}
</script>

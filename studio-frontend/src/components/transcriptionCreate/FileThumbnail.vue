<template>
  <span
    class="file-thumbnail flex align-center justify-center"
    :class="`file-thumbnail--${size}`">
    <PhIcon :name="icon" :size="size" />
  </span>
</template>
<script>
export default {
  name: "FileThumbnail",
  props: {
    file: { type: File, required: true },
    // "sm" or "lg"
    size: { type: String, default: "lg" },
  },
  computed: {
    icon() {
      return this.file.type.startsWith("video/") ? "video" : "music-notes"
    },
  },
}
</script>
<style lang="scss" scoped>
.file-thumbnail {
  flex-shrink: 0;
  border-radius: var(--border-radius-sm);
  background: var(--primary-color);
  color: var(--primary-contrast);
}

.file-thumbnail--sm {
  width: 2.25rem;
  height: 2.25rem;
}

.file-thumbnail--lg {
  width: 3.5rem;
  height: 3.5rem;
}
</style>

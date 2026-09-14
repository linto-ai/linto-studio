<template>
  <img :src="src" :alt="alt" @error="onError" ref="img" />
</template>

<script>
import userAvatar from "@/tools/userAvatar"

export default {
  name: "AvatarImage",
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  data() {
    return {
      hasErrored: false,
    }
  },
  methods: {
    onError() {
      if (this.hasErrored) return
      this.hasErrored = true
      this.$refs.img.src = userAvatar("/pictures/default.jpg")
    },
  },
}
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
